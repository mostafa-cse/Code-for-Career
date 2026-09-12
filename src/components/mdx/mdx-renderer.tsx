import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { codeToHtml } from "shiki";
import { Callout } from "./callout";
import { CodeBlock } from "./code-block";

// Custom components available in MDX content
const MDX_COMPONENTS = {
  Callout,
  // Override pre to render our CodeBlock with syntax highlighting
  pre: async (props: React.ComponentPropsWithoutRef<"pre">) => {
    const child = props.children as React.ReactElement<{
      className?: string;
      children?: string;
    }>;

    const rawCode =
      typeof child?.props?.children === "string"
        ? child.props.children.trimEnd()
        : "";

    const className = child?.props?.className ?? "";
    const langMatch = className.match(/language-(\w+)/);
    const lang = langMatch?.[1] ?? "text";

    let highlightedHtml = `<pre><code>${rawCode}</code></pre>`;
    try {
      highlightedHtml = await codeToHtml(rawCode, {
        lang,
        theme: "one-dark-pro",
      });
      // Strip extraneous \n between line elements that cause extra empty lines in pre/code
      highlightedHtml = highlightedHtml
        .replace(/(<\/span>)\r?\n(?=<span class="line">)/g, "$1")
        .replace(/<code>\r?\n(?=<span class="line">)/g, "<code>")
        .replace(/(<\/span>)\r?\n(?=<\/code>)/g, "$1");
    } catch {
      // unknown language – fall back to plain display
    }

    return (
      <CodeBlock code={rawCode} language={lang} highlightedHtml={highlightedHtml} />
    );
  },
};

interface MdxRendererProps {
  source: string;
}

export async function MdxRenderer({ source }: MdxRendererProps) {
  return (
    <MDXRemote
      source={source}
      components={MDX_COMPONENTS}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkMath],
          rehypePlugins: [
            rehypeKatex,
            rehypeSlug,
            [
              rehypeAutolinkHeadings,
              {
                behavior: "wrap",
                properties: {
                  className: ["no-underline", "text-inherit", "hover:no-underline"],
                  style: "text-decoration: none;",
                },
              },
            ],
          ],
        },
      }}
    />
  );
}
