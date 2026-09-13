"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  MinusCircle,
  ChevronDown,
} from "lucide-react";
import { useUserProgress } from "@/lib/hooks/use-user-progress";
import { useLanguage } from "@/components/providers/language-provider";

export type LessonStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED";

interface ModuleProgressSelectorProps {
  subjectSlug: string;
  lessonSlug: string;
  className?: string;
  displayLang?: "en" | "bn";
  onStatusChange?: (newStatus: LessonStatus, oldStatus: LessonStatus) => void;
}

const STATUS_CONFIG: Record<
  LessonStatus,
  {
    labelEn: string;
    labelBn: string;
    icon: React.ComponentType<{ className?: string }>;
    badgeStyle: string;
    iconStyle: string;
  }
> = {
  NOT_STARTED: {
    labelEn: "Not Started",
    labelBn: "শুরু হয়নি",
    icon: Circle,
    badgeStyle: "bg-muted/60 text-muted-foreground border-border hover:bg-muted",
    iconStyle: "text-muted-foreground",
  },
  IN_PROGRESS: {
    labelEn: "In Progress",
    labelBn: "চলমান",
    icon: Clock,
    badgeStyle:
      "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/20",
    iconStyle: "text-amber-600 dark:text-amber-400",
  },
  COMPLETED: {
    labelEn: "Completed",
    labelBn: "সম্পন্ন",
    icon: CheckCircle2,
    badgeStyle:
      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25",
    iconStyle: "text-emerald-600 dark:text-emerald-400",
  },
  SKIPPED: {
    labelEn: "Skipped",
    labelBn: "বাদ দেওয়া",
    icon: MinusCircle,
    badgeStyle:
      "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30 hover:bg-slate-500/20",
    iconStyle: "text-slate-500",
  },
};

export function ModuleProgressSelector({
  subjectSlug,
  lessonSlug,
  className = "",
  displayLang,
  onStatusChange,
}: ModuleProgressSelectorProps) {
  const { language } = useLanguage();
  const activeLang = displayLang || language;
  const isBn = activeLang === "bn";
  const { getLessonStatus, markLesson } = useUserProgress();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentStatus: LessonStatus = getLessonStatus(subjectSlug, lessonSlug);
  const currentConfig = STATUS_CONFIG[currentStatus];
  const CurrentIcon = currentConfig.icon;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  function handleSelect(status: LessonStatus) {
    const oldStatus = currentStatus;
    markLesson(subjectSlug, lessonSlug, status);
    setIsOpen(false);
    if (status !== oldStatus && onStatusChange) {
      onStatusChange(status, oldStatus);
    }
  }

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all shadow-2xs ${currentConfig.badgeStyle}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <CurrentIcon className={`h-3.5 w-3.5 ${currentConfig.iconStyle}`} />
        <span>
          {isBn ? currentConfig.labelBn : currentConfig.labelEn}
        </span>
        <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-1.5 w-44 rounded-xl border border-border bg-card p-1 shadow-lg backdrop-blur-md animate-in fade-in-80 zoom-in-95">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 mb-1">
            {isBn ? "মডিউল সমাপ্তি অবস্থা" : "Module Progress"}
          </div>
          {(["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "SKIPPED"] as LessonStatus[]).map(
            (status) => {
              const cfg = STATUS_CONFIG[status];
              const Icon = cfg.icon;
              const isSelected = currentStatus === status;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleSelect(status)}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-accent text-accent-foreground font-semibold"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`h-3.5 w-3.5 ${cfg.iconStyle}`} />
                    <span>{isBn ? cfg.labelBn : cfg.labelEn}</span>
                  </div>
                  {isSelected && (
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                  )}
                </button>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}
