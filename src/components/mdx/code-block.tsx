"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  highlightedHtml: string;
}

const LANG_MAP: Record<string, string> = {
  csharp: "C#",
  cs: "C#",
  "c#": "C#",
  cpp: "CPP",
  "c++": "CPP",
  c: "C",
  python: "PY",
  py: "PY",
  typescript: "TS",
  ts: "TS",
  javascript: "JS",
  js: "JS",
  java: "JAVA",
  rust: "RS",
  go: "GO",
  sql: "SQL",
  bash: "BASH",
  sh: "SH",
  shell: "BASH",
  json: "JSON",
  html: "HTML",
  css: "CSS",
  xml: "XML",
  text: "TXT",
};

function getLangBadge(lang: string): string {
  if (!lang) return "C#";
  const lower = lang.toLowerCase();
  return LANG_MAP[lower] ?? lower.toUpperCase();
}

export function CodeBlock({
  code,
  language = "csharp",
  highlightedHtml,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const badge = getLangBadge(language);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for non-secure contexts
    }
  }

  return (
    <div className="group relative not-prose my-6 overflow-hidden rounded-lg border border-[#272c36] bg-[#141820] shadow-xl">
      {/* ── USACO-Style Top-Right Floating Badges ── */}
      <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 select-none">
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 rounded bg-[#e2e8f0] px-2.5 py-0.5 text-xs font-semibold text-slate-900 shadow-sm transition-all hover:bg-white active:scale-95"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-600" />
              <span className="text-emerald-700">Copied!</span>
            </>
          ) : (
            <span>Copy</span>
          )}
        </button>

        <span className="rounded bg-[#facc15] px-2 py-0.5 font-mono text-xs font-bold text-black tracking-wide">
          {badge}
        </span>
      </div>

      {/* ── Code Body (USACO Guide line numbers & styling) ── */}
      <div
        className="cb-lines overflow-x-auto py-3 pl-1 pr-28 text-[13px] leading-[1.35]"
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />
    </div>
  );
}
