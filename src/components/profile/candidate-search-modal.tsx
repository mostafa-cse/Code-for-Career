"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  X,
  Flame,
  Building2,
  Trophy,
  ArrowRight,
  Sparkles,
  Users,
  Loader2,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { UserProfile, COMMUNITY_CANDIDATES } from "@/lib/user-profiles";
import { UserAvatar } from "@/components/ui/user-avatar";

interface CandidateSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CandidateSearchModal({
  isOpen,
  onClose,
}: CandidateSearchModalProps) {
  const { language, t } = useLanguage();
  const isBn = language === "bn";

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<UserProfile[]>(COMMUNITY_CANDIDATES);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search query
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setCandidates(data.candidates || []);
        } else {
          setCandidates(COMMUNITY_CANDIDATES);
        }
      } catch {
        setCandidates(COMMUNITY_CANDIDATES);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 sm:pt-16 overflow-y-auto">
      {/* Backdrop with Frosted Blur */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Radiant Modal Container */}
      <div className="relative z-50 w-full max-w-2xl rounded-3xl p-[1.5px] bg-gradient-to-b from-blue-500/40 via-emerald-500/30 to-amber-500/20 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="relative w-full overflow-hidden rounded-[1.4rem] bg-card/95 dark:bg-[#070c18]/95 p-5 sm:p-6 backdrop-blur-2xl shadow-2xl">
          {/* Header & Search Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-border/80">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  {t("Find Candidates & Peers", "সহকর্মী ও পরীক্ষার্থীদের খুঁজুন")}
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  {t(
                    "Search by @username, name, target company, or tech stack",
                    "@ইউজারনেম, নাম, টার্গেট কোম্পানি বা প্রযুক্তি দিয়ে খুঁজুন"
                  )}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Search Input Box */}
          <div className="mt-4 relative flex items-center">
            <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-blue-500" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                isBn
                  ? "যেমন: @mostafakamal, Therap, C#, Ariful..."
                  : "e.g. @mostafakamal, Therap, C#, Ariful, Enosis..."
              }
              className="w-full rounded-2xl border border-border/80 bg-background/80 py-3 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3.5 rounded-full p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Tags */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-muted-foreground font-medium mr-1">
              {t("Popular:", "জনপ্রিয়:")}
            </span>
            {["@mostafakamal", "Enosis", "Therap", "Samsung", "C#", "BUET"].map(
              (tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setQuery(tag.replace(/^@/, ""))}
                  className="rounded-full border border-border/70 bg-muted/50 px-2.5 py-0.5 font-medium text-foreground hover:bg-muted hover:border-border transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              )
            )}
          </div>

          {/* Candidates Result List */}
          <div className="mt-4 max-h-[55vh] overflow-y-auto pr-1 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-1">
              <span>
                {query
                  ? t(`Search Results (${candidates.length})`, `ফলাফল (${candidates.length})`)
                  : t("Featured Community Peers", "নির্বাচিত সহকর্মী পরীক্ষার্থী")}
              </span>
              {loading && (
                <span className="flex items-center gap-1 text-blue-500 font-normal lowercase">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  {t("searching...", "খোঁজা হচ্ছে...")}
                </span>
              )}
            </div>

            {candidates.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center">
                <Users className="mx-auto h-8 w-8 text-muted-foreground/40" />
                <p className="mt-2 text-xs font-bold text-foreground">
                  {t("No candidates found", "কোনো প্রার্থী খুঁজে পাওয়া যায়নি")}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {t(
                    "Try searching for another username like @mostafakamal or company like Therap.",
                    "@mostafakamal ইউজারনেম অথবা Therap দিয়ে খুঁজে দেখুন।"
                  )}
                </p>
              </div>
            ) : (
              candidates.map((candidate) => {
                const initials = (candidate.name || candidate.username || "?")
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <Link
                    key={candidate.id}
                    href={`/profile/${candidate.username}`}
                    onClick={onClose}
                    className="group relative flex items-center justify-between rounded-2xl border border-border/70 bg-card/60 hover:bg-muted/60 p-3 sm:p-3.5 transition-all hover:border-blue-500/40 hover:shadow-md cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <UserAvatar
                          src={candidate.avatarUrl}
                          name={candidate.name || candidate.username}
                          shape="rounded"
                          sizeClassName="h-12 w-12"
                          className="ring-1 ring-border shadow-xs group-hover:ring-blue-500/50 transition-all"
                          textClassName="text-sm font-black"
                        />
                        {candidate.role === "ADMIN" && (
                          <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-white shadow-xs">
                            <ShieldCheck className="h-2.5 w-2.5" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground text-sm truncate group-hover:text-blue-500 transition-colors">
                            {candidate.name}
                          </span>
                          <span className="font-mono text-xs text-blue-500 dark:text-blue-400 font-semibold shrink-0">
                            @{candidate.username}
                          </span>
                        </div>

                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {candidate.targetRole}
                        </p>

                        {/* Companies & Readiness Tags */}
                        <div className="mt-1.5 flex flex-wrap items-center gap-1">
                          <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            <Flame className="h-2.5 w-2.5" />
                            {candidate.readinessLevelEn}
                          </span>

                          {candidate.targetCompanies.slice(0, 3).map((comp) => (
                            <span
                              key={comp}
                              className="rounded bg-muted/80 px-1.5 py-0.5 text-[9px] font-medium text-foreground border border-border/60"
                            >
                              {comp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Action */}
                    <div className="hidden sm:flex items-center gap-2 pl-3">
                      <div className="text-right">
                        <span className="text-xs font-black text-foreground block">
                          {candidate.completedLessons}
                        </span>
                        <span className="text-[9px] text-muted-foreground uppercase">
                          {t("Lessons", "পাঠ")}
                        </span>
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="mt-4 pt-3 border-t border-border/80 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>
              {t("Press ESC to close", "বন্ধ করতে ESC চাপুন")}
            </span>
            <span className="text-foreground font-semibold">
              Code For Career Community
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
