"use client";

import { useState, useEffect, useRef, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  BookOpen,
  Code2,
  Layers,
  ArrowRight,
  Building2,
  Loader2,
} from "lucide-react";
import { useSearchModal } from "@/components/providers/search-provider";
import { useLanguage } from "@/components/providers/language-provider";
import type { SearchItemResult } from "@/app/api/search/route";

const SUGGESTED_QUERIES = [
  "Enosis",
  "Therap",
  "Samsung",
  "SOLID",
  "Big-O",
  "B-Tree",
  "C#",
  "Garbage Collection",
];

function SearchDialog({ onClose }: { onClose: () => void }) {
  const { language, t } = useLanguage();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItemResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [, startTransition] = useTransition();

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const navigateTo = useCallback(
    (url: string) => {
      onClose();
      startTransition(() => {
        router.push(url);
      });
    },
    [onClose, router]
  );

  // Search when query changes
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal }
        );
        if (res.ok) {
          const data = (await res.json()) as { results: SearchItemResult[] };
          setResults(data.results || []);
          setSelectedIndex(0);
        }
      } catch {
        // Search aborted or network error
      } finally {
        setIsLoading(false);
      }
    }, 150);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  // Keyboard navigation inside modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          results.length > 0 ? (prev + 1) % results.length : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          results.length > 0
            ? (prev - 1 + results.length) % results.length
            : 0
        );
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        navigateTo(results[selectedIndex].url);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [results, selectedIndex, navigateTo]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      );
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  function handleQueryChange(newQuery: string) {
    setQuery(newQuery);
    if (!newQuery.trim()) {
      setResults([]);
      setSelectedIndex(0);
      setIsLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-[15vh] backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all">
        {/* Search input header */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder={t(
              "Search lessons, subjects, or companies (e.g., Enosis)...",
              "পাঠ, বিষয় বা কোম্পানি খুঁজুন (যেমন: Enosis)..."
            )}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />
          )}
          {query && (
            <button
              type="button"
              onClick={() => handleQueryChange("")}
              className="rounded p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground sm:inline-block">
            ESC
          </kbd>
        </div>

        {/* Results / Suggestions Container */}
        <div
          ref={listRef}
          className="max-h-[60vh] overflow-y-auto p-2"
        >
          {query.trim() === "" ? (
            /* Suggested searches when query is empty */
            <div className="p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {t("Popular Searches", "জনপ্রিয় সার্চসমূহ")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGESTED_QUERIES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleQueryChange(item)}
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/60 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 && !isLoading ? (
            /* No results state */
            <div className="py-12 text-center">
              <Search className="mx-auto h-8 w-8 text-muted-foreground/40" />
              <p className="mt-2 text-sm font-semibold text-foreground">
                {t("No results found", "কোনো ফলাফল পাওয়া যায়নি")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t(
                  `No matches for "${query}". Try another keyword.`,
                  `"${query}" এর জন্য কিছু পাওয়া যায়নি। অন্য শব্দ খুঁজুন।`
                )}
              </p>
            </div>
          ) : (
            /* Search results list */
            <div className="flex flex-col gap-1">
              {results.map((item, index) => {
                const isSelected = index === selectedIndex;
                const Icon =
                  item.type === "subject"
                    ? Layers
                    : item.type === "problem"
                    ? Code2
                    : BookOpen;

                return (
                  <div
                    key={item.id}
                    data-index={index}
                    onClick={() => navigateTo(item.url)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                      isSelected
                        ? "bg-foreground text-background"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                          isSelected
                            ? "border-background/20 bg-background/10 text-background"
                            : "border-border bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold leading-tight truncate">
                            {language === "bn" && item.titleBn
                              ? item.titleBn
                              : item.title}
                          </span>
                          {item.company && (
                            <span
                              className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                                isSelected
                                  ? "bg-background/20 text-background"
                                  : "border border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/50 dark:bg-violet-950/40 dark:text-violet-300"
                              }`}
                            >
                              <Building2 className="h-2.5 w-2.5" />
                              {item.company}
                            </span>
                          )}
                        </div>
                        {item.subtitle && (
                          <p
                            className={`mt-0.5 text-[11px] truncate ${
                              isSelected
                                ? "text-background/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.badge && (
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                            isSelected
                              ? "bg-background/20 text-background"
                              : "border border-border bg-muted text-muted-foreground"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ArrowRight
                        className={`h-3.5 w-3.5 transition-transform ${
                          isSelected
                            ? "translate-x-0.5 text-background"
                            : "text-muted-foreground/50"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono">
                ↑
              </kbd>{" "}
              <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono">
                ↓
              </kbd>{" "}
              {t("navigate", "নেভিগেট")}
            </span>
            <span>
              <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono">
                ↵
              </kbd>{" "}
              {t("select", "নির্বাচন")}
            </span>
          </div>
          <span>
            <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono">
              ESC
            </kbd>{" "}
            {t("close", "বন্ধ")}
          </span>
        </div>
      </div>
    </div>
  );
}

export function SearchModal() {
  const { isOpen, closeSearch } = useSearchModal();
  if (!isOpen) return null;
  return <SearchDialog onClose={closeSearch} />;
}
