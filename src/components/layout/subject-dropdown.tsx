"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { SUBJECTS } from "@/lib/constants";
import { useLanguage } from "@/components/providers/language-provider";
import { SubjectIcon, SUBJECT_COLOR_STYLES } from "./icons";

export function SubjectDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{t("Subjects", "বিষয়সমূহ")}</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-[540px] max-w-[90vw] rounded-xl border border-border bg-card p-3 shadow-xl animate-in fade-in-0 zoom-in-95">
          <div className="mb-2 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t(`All ${SUBJECTS.length} Learning Modules`, `সকল ${SUBJECTS.length}টি মডিউল`)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {SUBJECTS.map((subject) => {
              const styles = SUBJECT_COLOR_STYLES[subject.color] ?? SUBJECT_COLOR_STYLES.blue;
              return (
                <Link
                  key={subject.slug}
                  href={`/subjects/${subject.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border ${styles.border} ${styles.bg} ${styles.text}`}
                  >
                    <SubjectIcon name={subject.icon} className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-foreground">
                      {language === "bn" ? subject.nameBn : subject.nameEn}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {language === "bn" ? subject.nameEn : subject.nameBn}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
