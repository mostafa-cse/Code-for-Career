import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { codeToHtml } from "shiki";
import { Callout } from "./callout";
import { CodeBlock } from "./code-block";
import { FileChaosComparison } from "./git-visuals/file-chaos-comparison";
import { GitVsGitHubCard } from "./git-visuals/git-vs-github-card";
import { GitWorkflowPipeline } from "./git-visuals/git-workflow-pipeline";

// Custom components available in MDX content
const MDX_COMPONENTS = {
  Callout,
  FileChaosComparison,
  GitVsGitHubCard,
  GitWorkflowPipeline,
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

/**
 * Strips duplicate static markdown problem tables (e.g. "## Recommended Practice Problems"
 * or "## অনুশীলনের জন্য নির্বাচিত সমস্যা") so only the interactive ProblemList component is rendered.
 */
function stripDuplicateProblemSection(source: string): string {
  if (!source) return "";
  return source.replace(
    /(?:\n\s*---\s*)?\n##\s+(?:[0-9০-৯]+\.\s+)?(?:Recommended Practice Problems|Practice Problems|অনুশীলনের জন্য নির্বাচিত সমস্যা|অনুশীলনী)[\s\S]*?(?=(?:\n##\s)|$)/gi,
    ""
  );
}

/**
 * Escapes unescaped C# generic type parameters (e.g. List<T>, Queue<T>, PriorityQueue<TElement, TPriority>,
 * Func<T, bool>) and comparison operators (<, (<)) outside code blocks so MDXRemote doesn't mistakenly
 * parse them as unclosed JSX components or invalid JSX names.
 */
function escapeMdxGenerics(source: string): string {
  if (!source) return "";
  // 1. Split on code fences (```...```) or inline code (`...`) so we never modify code blocks
  return source
    .replace(
      /(```[\s\S]*?```|`[^`\n]*?`)|<(\/?)([A-Za-z0-9_-]+)?([^>]*)>/g,
      (match, codeBlock, slash, tagName, rest) => {
        if (codeBlock) return codeBlock;

        if (tagName) {
          const lower = tagName.toLowerCase();
          const isKnown =
            /^(callout|filechaoscomparison|gitvsgithubcard|gitworkflowpipeline|div|span|p|a|b|i|strong|em|pre|code|table|tr|td|th|thead|tbody|ul|ol|li|h[1-6]|hr|br|img|svg|path|blockquote)$/i.test(
              lower
            );
          if (isKnown) {
            return match;
          }
        }

        // Everything else: <T>, <TKey, TValue>, <string, int>, etc.
        return `&lt;${slash || ""}${tagName || ""}${rest || ""}&gt;`;
      }
    )
    .replace(
      // 2. Also catch bare "<" not closed with ">" on the same line, like "(<)" or "i < n"
      /(```[\s\S]*?```|`[^`\n]*?`)|<(?![a-zA-Z/])/g,
      (match, codeBlock) => {
        if (codeBlock) return codeBlock;
        return "&lt;";
      }
    );
}

interface MdxRendererProps {
  source: string;
}

export async function MdxRenderer({ source }: MdxRendererProps) {
  const cleanSource = escapeMdxGenerics(stripDuplicateProblemSection(source));
  return (
    <MDXRemote
      source={cleanSource}
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
