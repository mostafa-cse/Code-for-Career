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
import { useAuth } from "@/components/providers/auth-provider";

export type LessonStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED";

interface ModuleProgressSelectorProps {
  subjectSlug: string;
  lessonSlug: string;
  className?: string;
  displayLang?: "en" | "bn";
  size?: "sm" | "md";
  direction?: "down" | "up" | "auto";
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
    labelBn: "শুরু হয়নি",
    icon: Circle,
    badgeStyle:
      "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border-border shadow-2xs",
    iconStyle: "text-muted-foreground",
  },
  IN_PROGRESS: {
    labelEn: "In Progress",
    labelBn: "চলমান",
    icon: Clock,
    badgeStyle:
      "bg-amber-500/15 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-500/40 hover:bg-amber-500/25 shadow-2xs",
    iconStyle: "text-amber-600 dark:text-amber-400",
  },
  COMPLETED: {
    labelEn: "Completed",
    labelBn: "সম্পন্ন",
    icon: CheckCircle2,
    badgeStyle:
      "bg-emerald-500/15 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25 shadow-2xs",
    iconStyle: "text-emerald-600 dark:text-emerald-400",
  },
  SKIPPED: {
    labelEn: "Skipped",
    labelBn: "বাদ দেওয়া",
    icon: MinusCircle,
    badgeStyle:
      "bg-card text-muted-foreground border-border hover:bg-muted shadow-2xs",
    iconStyle: "text-muted-foreground",
  },
};

export function ModuleProgressSelector({
  subjectSlug,
  lessonSlug,
  className = "",
  displayLang,
  size = "md",
  direction = "auto",
  onStatusChange,
}: ModuleProgressSelectorProps) {
  const { language } = useLanguage();
  const activeLang = displayLang || language;
  const isBn = activeLang === "bn";
  const { getLessonStatus, markLesson } = useUserProgress();
  const { user, openAuthModal } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentStatus: LessonStatus = getLessonStatus(subjectSlug, lessonSlug);
  const currentConfig = STATUS_CONFIG[currentStatus];
  const CurrentIcon = currentConfig.icon;

  const sizeClasses =
    size === "sm"
      ? "h-8 px-2.5 text-[11px] gap-1.5"
      : "h-9 px-3 text-xs gap-2";

  // Check remaining viewport space on toggle to intelligently flip upward or downward
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      if (direction === "up") {
        setOpenUpward(true);
      } else if (direction === "down") {
        setOpenUpward(false);
      } else {
        const rect = dropdownRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        setOpenUpward(spaceBelow < 230);
      }
    }
  }, [isOpen, direction]);

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
    if (!user) {
      setIsOpen(false);
      openAuthModal(
        isBn
          ? "পাঠের অগ্রগতি (Status) পরিবর্তন করতে অনুগ্রহ করে সাইন ইন করুন।"
          : "Please sign in to update your lesson progress and track your learning journey."
      );
      return;
    }
    const oldStatus = currentStatus;
    const ok = markLesson(subjectSlug, lessonSlug, status);
    setIsOpen(false);
    if (ok && status !== oldStatus && onStatusChange) {
      onStatusChange(status, oldStatus);
    }
  }

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center rounded-lg border font-medium transition-all ${sizeClasses} ${currentConfig.badgeStyle}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <CurrentIcon className={`h-3.5 w-3.5 ${currentConfig.iconStyle}`} />
        <span>
          {isBn ? currentConfig.labelBn : currentConfig.labelEn}
        </span>
        <ChevronDown className={`h-3 w-3 opacity-60 ml-0.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 z-50 w-48 rounded-xl border border-border bg-card dark:bg-[#0f172a] p-1.5 shadow-2xl animate-in fade-in-80 zoom-in-95 ${
            openUpward ? "bottom-full mb-1.5" : "top-full mt-1.5"
          }`}
        >
          <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/80 mb-1">
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
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-muted dark:bg-muted/80 text-foreground font-semibold"
                      : "text-foreground hover:bg-muted/60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`h-3.5 w-3.5 ${cfg.iconStyle}`} />
                    <span>{isBn ? cfg.labelBn : cfg.labelEn}</span>
                  </div>
                  {isSelected && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
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
