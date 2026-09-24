"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { createClient } from "@/lib/supabase/client";
import {
  X,
  Sparkles,
  CheckCircle2,
  BookmarkCheck,
  Highlighter,
  ArrowRight,
  Loader2,
  Lock,
} from "lucide-react";
import Link from "next/link";

function GoogleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={`${className} fill-current`} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string | null;
}

export function AuthRequiredModal({
  isOpen,
  onClose,
  reason,
}: AuthRequiredModalProps) {
  const { t, language } = useLanguage();
  const pathname = usePathname();
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentRedirect = typeof window !== "undefined"
    ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(pathname || "/dashboard")}`
    : "/dashboard";

  async function handleOAuthLogin(provider: "google" | "github") {
    setOauthLoading(provider);
    setError(null);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: currentRedirect,
        },
      });
      if (err) {
        setError(err.message);
        setOauthLoading(null);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Authentication error");
      setOauthLoading(null);
    }
  }

  const isBn = language === "bn";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all duration-300 animate-in zoom-in-95 sm:max-w-lg">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500/20 via-sky-500/20 to-violet-500/20 blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative p-6 sm:p-8">
          {/* Header Icon */}
          <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-indigo-500/10 p-3 ring-1 ring-border">
            <Lock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>

          {/* Titles */}
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {isBn ? "অগ্রগতি সংরক্ষণ করতে সাইন ইন করুন" : "Sign in to save your progress"}
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {reason ||
              (isBn
                ? "পাঠ সম্পন্ন করা, প্রবলেম মার্ক করা এবং নোট ও হাইলাইটস ক্লাউডে সংরক্ষণ করতে সাইন ইন প্রয়োজন।"
                : "You must be signed in to mark topics as completed, save problem progress, and keep highlights synced across devices.")}
          </p>

          {/* Benefits list */}
          <div className="my-5 space-y-2 rounded-xl border border-border/60 bg-muted/30 p-3.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <BookmarkCheck className="h-4 w-4 shrink-0 text-emerald-500" />
              <span>
                {isBn
                  ? "১৩টি বিষয়ের অগ্রগতি ও লার্নিং রোডম্যাপ আজীবন সংরক্ষিত"
                  : "Tracks preparation roadmap across all 13 software subjects"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Highlighter className="h-4 w-4 shrink-0 text-amber-500" />
              <span>
                {isBn
                  ? "পড়ার সময় চিহ্নিত হাইলাইটস ও গুরুত্বপূর্ণ অংশ সংরক্ষণ"
                  : "Syncs highlighted lines, words, and notes across all your devices"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 shrink-0 text-sky-500" />
              <span>
                {isBn
                  ? "পাবলিক ক্যান্ডিডেট প্রোফাইল ও ইন্টারভিউ প্রস্তুতি শোকেস"
                  : "Unlocks personalized candidate showcase profile and badges"}
              </span>
            </div>
          </div>

          {/* Error notice */}
          {error && (
            <div className="mb-4 rounded-lg border border-rose-500/20 bg-rose-500/10 p-2.5 text-xs text-rose-500 text-center">
              {error}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-2.5">
            {/* Google */}
            <button
              type="button"
              onClick={() => handleOAuthLogin("google")}
              disabled={oauthLoading !== null}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground shadow-xs transition-all hover:bg-muted active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {oauthLoading === "google" ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <GoogleIcon className="h-4 w-4" />
              )}
              <span>{isBn ? "Google দিয়ে প্রবেশ করুন" : "Continue with Google"}</span>
            </button>

            {/* GitHub */}
            <button
              type="button"
              onClick={() => handleOAuthLogin("github")}
              disabled={oauthLoading !== null}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground shadow-xs transition-all hover:bg-muted active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {oauthLoading === "github" ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <GithubIcon className="h-4 w-4" />
              )}
              <span>{isBn ? "GitHub দিয়ে প্রবেশ করুন" : "Continue with GitHub"}</span>
            </button>

            {/* Email link / Full login page */}
            <Link
              href={`/auth/login?redirectTo=${encodeURIComponent(pathname || "/dashboard")}`}
              onClick={onClose}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background shadow-xs transition-all hover:opacity-90 active:scale-[0.99] text-center"
            >
              <span>{isBn ? "ইমেইল দিয়ে প্রবেশ করুন" : "Continue with Email (Magic Link)"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Footer dismiss */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {isBn ? "এখন নয়, পরে করবো" : "Maybe later"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
