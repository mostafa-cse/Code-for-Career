"use client";

import { ExternalLink, Star, BookOpen } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import type { LocalResource } from "@/lib/lessons-data";

interface ResourceListProps {
  resources: LocalResource[];
  displayLang?: "en" | "bn";
}

export function ResourceList({ resources, displayLang }: ResourceListProps) {
  const { language } = useLanguage();
  const activeLang = displayLang || language;
  const isBn = activeLang === "bn";

  if (resources.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
        <BookOpen className="h-5 w-5 text-muted-foreground" />
        {isBn ? "বাছাইকৃত রিসোর্স ও রেফারেন্স" : "Curated Resources"}
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        {isBn
          ? "গভীর বোঝাপড়ার জন্য সুপারিশকৃত অফিশিয়াল পাঠ্য ও ডকুমেন্টেশন।"
          : "Recommended official reading and documentation for deeper understanding."}
      </p>
      <div className="mt-4 flex flex-col gap-2">
        {resources.map((resource, i) => (
          <a
            key={i}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-foreground/30 hover:shadow-xs"
          >
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-xs font-bold text-muted-foreground">
              {resource.source.slice(0, 2).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {resource.title}
                </span>
                {resource.isStarred && (
                  <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                )}
                <span className="text-[11px] text-muted-foreground">
                  {resource.source}
                </span>
              </div>
              {resource.description && (
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                  {resource.description}
                </p>
              )}
            </div>

            <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          </a>
        ))}
      </div>
    </section>
  );
}
