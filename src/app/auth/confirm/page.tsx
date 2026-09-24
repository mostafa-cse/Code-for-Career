"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/providers/language-provider";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { LogoIcon } from "@/components/layout/logo";

function ConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let isCancelled = false;

    async function handleConfirmation() {
      try {
        // 1. Inspect hash fragment (Supabase email magic link verification defaults to #access_token=...&refresh_token=...)
        const rawHash = typeof window !== "undefined" ? window.location.hash : "";
        const hashParams = new URLSearchParams(rawHash.startsWith("#") ? rawHash.slice(1) : rawHash);

        // Check for error parameters in query or hash
        const queryError = searchParams.get("error");
        const queryErrorDesc = searchParams.get("error_description");
        const hashError = hashParams.get("error");
        const hashErrorDesc = hashParams.get("error_description");

        const err = queryErrorDesc || queryError || hashErrorDesc || hashError;
        if (err) {
          if (!isCancelled) {
            setStatus("error");
            setErrorMessage(err);
          }
          return;
        }

        // 2. Check for PKCE authorization code in query string (?code=...)
        const code = searchParams.get("code");
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (!exchangeError) {
            if (!isCancelled) {
              setStatus("success");
              const next = searchParams.get("next") || "/dashboard";
              window.location.href = next;
            }
            return;
          }
        }

        // 3. Check for token_hash and type in query string (?token_hash=...&type=...)
        const token_hash = searchParams.get("token_hash");
        const type = searchParams.get("type");
        if (token_hash && type) {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            type: type as Parameters<typeof supabase.auth.verifyOtp>[0]["type"],
            token_hash,
          });
          if (!verifyError) {
            if (!isCancelled) {
              setStatus("success");
              const next = searchParams.get("next") || "/dashboard";
              window.location.href = next;
            }
            return;
          }
        }

        // 4. Check for tokens in hash fragment (#access_token=...&refresh_token=...)
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (!sessionError) {
            if (!isCancelled) {
              setStatus("success");
              const next = searchParams.get("next") || "/dashboard";
              window.location.href = next;
            }
            return;
          }
        }

        // 5. Fallback: check if session is already active (e.g. Supabase client auto-parsed hash)
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          if (!isCancelled) {
            setStatus("success");
            const next = searchParams.get("next") || "/dashboard";
            window.location.href = next;
          }
          return;
        }

        // If no tokens found and no active session
        if (!isCancelled) {
          setStatus("error");
          setErrorMessage(
            t(
              "Your confirmation link is invalid or has expired. Please try signing in again.",
              "আপনার নিশ্চিতকরণ লিঙ্কটির মেয়াদ শেষ হয়ে গেছে বা অকার্যকর। অনুগ্রহ করে পুনরায় লগইন করার চেষ্টা করুন।"
            )
          );
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          setStatus("error");
          setErrorMessage(err instanceof Error ? err.message : "Authentication error occurred");
        }
      }
    }

    handleConfirmation();

    return () => {
      isCancelled = true;
    };
  }, [router, searchParams, t]);

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center shadow-xs">
        <div className="mb-6 flex justify-center">
          <LogoIcon size={44} />
        </div>

        {status === "loading" && (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <h2 className="text-base font-bold text-foreground">
              {t("Verifying your session...", "আপনার লগইন যাচাই করা হচ্ছে...")}
            </h2>
            <p className="text-xs text-muted-foreground">
              {t(
                "Please wait while we complete your authentication.",
                "অনুগ্রহ করে অপেক্ষা করুন, প্রক্রিয়াটি সম্পন্ন হচ্ছে।"
              )}
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            <h2 className="text-base font-bold text-foreground">
              {t("Authentication Successful!", "লগইন সফল হয়েছে!")}
            </h2>
            <p className="text-xs text-muted-foreground">
              {t("Redirecting you to dashboard...", "ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...")}
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="h-8 w-8 text-rose-500" />
            <div>
              <h2 className="text-base font-bold text-foreground">
                {t("Authentication Failed", "লগইন ব্যর্থ হয়েছে")}
              </h2>
              <p className="mt-1 text-xs text-rose-500 leading-relaxed">
                {errorMessage}
              </p>
            </div>
            <Link
              href="/auth/login"
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-foreground px-4 py-2 text-xs font-semibold text-background shadow-xs hover:opacity-90"
            >
              {t("Back to Login", "লগইন পেজে ফিরে যান")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ConfirmContent />
    </Suspense>
  );
}
