"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Edit3,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  LogIn,
  Send,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";

interface SuggestionModalProps {
  subjectSlug: string;
  lessonSlug: string;
  lessonTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function SuggestionModal({
  subjectSlug,
  lessonSlug,
  lessonTitle,
  isOpen,
  onClose,
}: SuggestionModalProps) {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectSlug,
          lessonSlug,
          title: title.trim(),
          content: content.trim(),
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setTitle("");
        setContent("");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit suggestion");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setSubmitted(false);
    setError(null);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
              <Edit3 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">
                {t("Suggest an Edit", "সম্পাদনার পরামর্শ দিন")}
              </h2>
              <p className="text-[11px] text-muted-foreground truncate max-w-[320px]">
                {lessonTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!user ? (
            /* Unauthenticated Prompt */
            <div className="flex flex-col items-center py-6 text-center">
              <AlertCircle className="h-10 w-10 text-amber-500" />
              <h3 className="mt-3 text-base font-bold text-foreground">
                {t("Sign in required", "সাইন ইন প্রয়োজন")}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                {t(
                  "You must be signed in to submit editorial suggestions so we can attribute and notify you of review updates.",
                  "পরামর্শ জমা দিতে সাইন ইন করতে হবে যেন পর্যালোচনার আপডেট আপনাকে জানানো যায়।"
                )}
              </p>
              <Link
                href={`/auth/login?redirectTo=/subjects/${subjectSlug}/${lessonSlug}`}
                className="mt-5 flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-xs font-semibold text-background shadow-xs hover:opacity-90"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>{t("Sign In to Continue", "চালিয়ে যেতে সাইন ইন করুন")}</span>
              </Link>
            </div>
          ) : submitted ? (
            /* Success confirmation */
            <div className="flex flex-col items-center py-6 text-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              <h3 className="mt-3 text-base font-bold text-foreground">
                {t("Thank you for contributing!", "অবদানের জন্য ধন্যবাদ!")}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                {t(
                  "Your editorial suggestion has been received. Our review team will verify and integrate the improvements.",
                  "আপনার সম্পাদনার প্রস্তাব জমা হয়েছে। পর্যালোচনার পর তা কারিকুলামে যুক্ত করা হবে।"
                )}
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-5 rounded-lg bg-foreground px-4 py-2 text-xs font-semibold text-background shadow-xs hover:opacity-90"
              >
                {t("Done", "সম্পন্ন")}
              </button>
            </div>
          ) : (
            /* Suggestion Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="suggestion-title"
                  className="block text-xs font-semibold text-foreground"
                >
                  {t("Suggestion Summary", "পরামর্শের সারাংশ")}
                </label>
                <input
                  id="suggestion-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t(
                    "e.g., Fix typo in Big-O formula, Add Enosis interview question",
                    "যেমন: বিগ-ও সূত্রে টাইপো সংশোধন, এনোসিস ইন্টারভিউ প্রশ্ন সংযোজন"
                  )}
                  className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label
                  htmlFor="suggestion-content"
                  className="block text-xs font-semibold text-foreground"
                >
                  {t(
                    "Details / Proposed Changes",
                    "বিস্তারিত বিবরণ / প্রস্তাবিত পরিবর্তন"
                  )}
                </label>
                <textarea
                  id="suggestion-content"
                  required
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t(
                    "Explain what should be changed or paste the proposed code/text...",
                    "কী পরিবর্তন করতে হবে ব্যাখ্যা করুন অথবা প্রস্তাবিত কোড/লেখা লিখুন..."
                  )}
                  className="mt-1.5 w-full rounded-lg border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {error && (
                <p className="text-xs font-medium text-rose-500">{error}</p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                >
                  {t("Cancel", "বাতিল")}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-1.5 text-xs font-semibold text-background shadow-xs hover:opacity-90 disabled:opacity-60"
                >
                  {submitting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  <span>
                    {submitting
                      ? t("Submitting...", "জমা হচ্ছে...")
                      : t("Submit Suggestion", "পরামর্শ জমা দিন")}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
