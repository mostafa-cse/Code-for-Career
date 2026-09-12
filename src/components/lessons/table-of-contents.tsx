"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  displayLang?: "en" | "bn";
}

export function TableOfContents({ displayLang }: TableOfContentsProps) {
  const { language: contextLang, t } = useLanguage();
  const activeLang = displayLang || contextLang;
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Scan main content for h2 and h3 headings
    const timer = setTimeout(() => {
      const elements = Array.from(
        document.querySelectorAll("main h2, main h3")
      ).filter((el) => {
        // Exclude headings from inactive language
        const langContainer = el.closest("[data-lang]");
        if (langContainer && langContainer.getAttribute("data-lang") !== activeLang) {
          return false;
        }

        // Exclude elements inside hidden containers or modals
        if (el.closest(".hidden") || (el as HTMLElement).offsetParent === null) {
          return false;
        }

        // Exclude card headers inside aside or ignored containers
        return !el.closest("aside") && !el.closest("[data-ignore-toc]");
      });

      const items: TocItem[] = elements.map((el, index) => {
        if (!el.id) {
          // Generate an ID if missing
          el.id =
            el.textContent
              ?.toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "") || `heading-${index}`;
        }
        return {
          id: el.id,
          text: el.textContent || "",
          level: el.tagName === "H2" ? 2 : 3,
        };
      });

      setHeadings(items);

      // IntersectionObserver to highlight active heading
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.find((entry) => entry.isIntersecting);
          if (visible) {
            setActiveId(visible.target.id);
          }
        },
        {
          rootMargin: "-80px 0% -60% 0%",
          threshold: 0,
        }
      );

      elements.forEach((el) => observer.observe(el));

      return () => {
        observer.disconnect();
      };
    }, 50);

    return () => clearTimeout(timer);
  }, [activeLang]);

  if (headings.length === 0) return null;

  return (
    <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 no-scrollbar">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {t("Table of Contents", "সূচিপত্র")}
      </h3>
      <nav className="flex flex-col space-y-1.5 text-xs">
        {headings.map((item) => {
          const isActive = activeId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById(item.id);
                if (target) {
                  target.scrollIntoView({ behavior: "smooth", block: "start" });
                  setActiveId(item.id);
                }
              }}
              className={`transition-all line-clamp-1 py-1 block ${
                item.level === 3 ? "pl-3 text-[11px]" : "pl-0 font-medium"
              } ${
                isActive
                  ? "text-blue-600 dark:text-blue-400 font-semibold translate-x-1"
                  : "text-muted-foreground hover:text-foreground transition-colors"
              }`}
            >
              {item.text}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
