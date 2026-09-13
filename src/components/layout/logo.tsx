"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";

interface LogoIconProps {
  size?: number;
  className?: string;
}

/**
 * Logo icon — renders the actual brand image (interlocking green diamond
 * with red circle, Bangladesh flag inspired).
 */
export function LogoIcon({ size = 36, className = "" }: LogoIconProps) {
  return (
    <Image
      src="/logo.png"
      alt="Code For Career"
      width={size}
      height={size}
      className={`rounded-lg ${className}`}
      priority
    />
  );
}

/* ------------------------------------------------------------------ */

interface LogoBrandProps {
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
  className?: string;
}

/**
 * Full brand mark: logo image + gradient wordmark.
 * Wraps in a Next.js Link to "/".
 */
export function LogoBrand({
  size = "md",
  showSubtitle = true,
  className = "",
}: LogoBrandProps) {
  const { t } = useLanguage();

  const iconSize = size === "sm" ? 28 : size === "lg" ? 44 : 36;

  const titleClass =
    size === "sm"
      ? "text-sm font-bold"
      : size === "lg"
        ? "text-lg font-extrabold"
        : "text-base font-bold";

  return (
    <Link
      href="/"
      className={`group flex items-center gap-2.5 transition-opacity hover:opacity-90 ${className}`}
    >
      {/* Logo icon with hover glow */}
      <div className="relative">
        <LogoIcon size={iconSize} />
        {/* Glow ring on hover */}
        <div
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            boxShadow:
              "0 0 16px 2px rgba(34,197,94,0.35), 0 0 32px 4px rgba(239,68,68,0.15)",
          }}
        />
      </div>

      <div className="flex flex-col">
        <span
          className={`${titleClass} tracking-tight bg-gradient-to-r from-green-500 via-emerald-400 to-green-600 bg-clip-text text-transparent`}
        >
          Code For Career
        </span>
        {showSubtitle && (
          <span className="hidden text-[10px] font-medium text-muted-foreground sm:inline-block">
            {t("Job Preparation Platform", "চাকরি প্রস্তুতির প্ল্যাটফর্ম")}
          </span>
        )}
      </div>
    </Link>
  );
}
