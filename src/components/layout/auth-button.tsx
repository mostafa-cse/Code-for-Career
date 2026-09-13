"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User, LayoutDashboard, ChevronDown, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";

import { UserAvatar } from "@/components/ui/user-avatar";

function Avatar({ name, avatarUrl }: { name?: string | null; avatarUrl?: string | null }) {
  return (
    <UserAvatar
      src={avatarUrl}
      name={name}
      shape="circle"
      sizeClassName="h-7 w-7"
      className="ring-2 ring-border"
      textClassName="text-[10px]"
    />
  );
}

export function AuthButton() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [open]);

  const router = useRouter();

  async function handleSignOut() {
    setOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="hidden rounded-lg bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background shadow-xs transition-opacity hover:opacity-90 sm:inline-flex"
      >
        {t("Sign In", "সাইন ইন")}
      </Link>
    );
  }

  const name = user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email;
  const avatarUrl = user.user_metadata?.avatar_url ?? null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full p-0.5 transition-opacity hover:opacity-80"
        aria-label="User menu"
        aria-expanded={open}
      >
        <Avatar name={name} avatarUrl={avatarUrl} />
        <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-border bg-card shadow-lg z-50">
          {/* User info */}
          <div className="border-b border-border px-4 py-3">
            <p className="text-xs font-bold text-foreground truncate">
              {name}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground truncate">
              {user.email}
            </p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-foreground hover:bg-muted"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-muted-foreground" />
              {t("Dashboard", "ড্যাশবোর্ড")}
            </Link>
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-foreground hover:bg-muted"
            >
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              {t("Profile", "প্রোফাইল")}
            </Link>

            <div className="my-1 border-t border-border" />

            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-muted dark:text-rose-400"
            >
              <LogOut className="h-3.5 w-3.5" />
              {t("Sign Out", "সাইন আউট")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
