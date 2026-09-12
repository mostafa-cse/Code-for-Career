"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { CURRICULUM_TRACKS } from "@/lib/curriculum-data";
import { useUserProgress } from "@/lib/hooks/use-user-progress";

const TRACK_ACCENTS: Record<string, { bar: string; text: string; bg: string }> = {
  "core-cs":       { bar: "bg-blue-500",   text: "text-blue-600 dark:text-blue-400",   bg: "bg-blue-50 dark:bg-blue-950/20" },
  "systems":       { bar: "bg-violet-500", text: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/20" },
  "modern-stack":  { bar: "bg-emerald-500",text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
  "practice":      { bar: "bg-amber-500",  text: "text-amber-600 dark:text-amber-400",  bg: "bg-amber-50 dark:bg-amber-950/20" },
};

export function TrackProgress() {
  const { language, t } = useLanguage();
  const { trackStats } = useUserProgress();

  return (
    <div className="rounded-2xl border border-border bg-card shadow-xs">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">
          {t("Track Progress", "ট্র্যাকভিত্তিক অগ্রগতি")}
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {t(
            "Progress across the 4 primary specialization tracks",
            "চারটি মূল বিষয়ের পৃথক অগ্রগতি পর্যালোচনা"
          )}
        </p>
      </div>

      {/* Tracks */}
      <div className="divide-y divide-border">
        {CURRICULUM_TRACKS.map((track) => {
          const stats = trackStats[track.id] ?? {
            completed: 0,
            total: 0,
            percentage: 0,
          };
          const accent = TRACK_ACCENTS[track.id] ?? {
            bar: "bg-foreground",
            text: "text-foreground",
            bg: "bg-muted/30",
          };

          return (
            <div key={track.id} className="flex items-center gap-6 px-6 py-4">
              {/* Track name */}
              <div className="w-44 shrink-0">
                <p className={`text-xs font-bold ${accent.text}`}>
                  {language === "bn" ? track.nameBn : track.nameEn}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {stats.completed} / {stats.total} {t("lessons", "পাঠ")}
                </p>
              </div>

              {/* Progress bar */}
              <div className="flex-1">
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${accent.bar}`}
                    style={{ width: `${Math.max(stats.percentage, 0)}%` }}
                  />
                </div>
              </div>

              {/* Percentage */}
              <span className="w-10 shrink-0 text-right font-mono text-xs font-semibold text-foreground">
                {stats.percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
