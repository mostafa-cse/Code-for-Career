"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={() => setLanguage(language === "en" ? "bn" : "en")}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-card-foreground shadow-xs transition-colors hover:bg-muted focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`Switch language to ${language === "en" ? "Bangla" : "English"}`}
      title={language === "en" ? "বাংলায় দেখুন" : "View in English"}
    >
      <Languages className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="font-mono">{language === "en" ? "বাংলা" : "EN"}</span>
    </button>
  );
}
