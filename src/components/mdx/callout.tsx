import type { ReactNode } from "react";
import { AlertCircle, Lightbulb, Building2, Info } from "lucide-react";

type CalloutVariant = "note" | "tip" | "warning" | "company";

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
}

const VARIANTS: Record<
  CalloutVariant,
  {
    icon: typeof Info;
    containerClass: string;
    iconClass: string;
    titleClass: string;
  }
> = {
  note: {
    icon: Info,
    containerClass:
      "border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/30",
    iconClass: "text-blue-500",
    titleClass: "text-blue-800 dark:text-blue-300",
  },
  tip: {
    icon: Lightbulb,
    containerClass:
      "border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/30",
    iconClass: "text-emerald-500",
    titleClass: "text-emerald-800 dark:text-emerald-300",
  },
  warning: {
    icon: AlertCircle,
    containerClass:
      "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30",
    iconClass: "text-amber-500",
    titleClass: "text-amber-800 dark:text-amber-300",
  },
  company: {
    icon: Building2,
    containerClass:
      "border-violet-200 bg-violet-50 dark:border-violet-900/50 dark:bg-violet-950/30",
    iconClass: "text-violet-500",
    titleClass: "text-violet-800 dark:text-violet-300",
  },
};

export function Callout({
  variant = "note",
  title,
  children,
}: CalloutProps) {
  const v = VARIANTS[variant];
  const Icon = v.icon;

  return (
    <div
      className={`not-prose my-5 flex gap-3 rounded-xl border p-4 ${v.containerClass}`}
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${v.iconClass}`} />
      <div className="min-w-0 flex-1 text-sm leading-relaxed">
        {title && (
          <p className={`mb-1 font-bold ${v.titleClass}`}>{title}</p>
        )}
        <div className="text-foreground/90">{children}</div>
      </div>
    </div>
  );
}
