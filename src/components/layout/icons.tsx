import type { LucideIcon, LucideProps } from "lucide-react";
import {
  Binary,
  Boxes,
  Brain,
  Code,
  Cpu,
  Database,
  GitBranch,
  Globe,
  HelpCircle,
  Layers,
  Network,
  PenTool,
  Trophy,
  Users,
} from "lucide-react";

export const SUBJECT_ICONS: Record<string, LucideIcon> = {
  GitBranch,
  Code,
  Binary,
  Boxes,
  Layers,
  PenTool,
  Database,
  Network,
  Globe,
  Cpu,
  Brain,
  Users,
  Trophy,
};

export interface SubjectIconProps extends LucideProps {
  name: string;
}

export function SubjectIcon({ name, ...props }: SubjectIconProps) {
  const IconComponent = SUBJECT_ICONS[name] ?? HelpCircle;
  return <IconComponent {...props} />;
}

export const SUBJECT_COLOR_STYLES: Record<
  string,
  {
    text: string;
    bg: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    hoverBorder: string;
  }
> = {
  blue: {
    text: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    border: "border-blue-200 dark:border-blue-900/50",
    badgeBg: "bg-blue-100 dark:bg-blue-900/30",
    badgeText: "text-blue-700 dark:text-blue-300",
    hoverBorder: "hover:border-blue-400 dark:hover:border-blue-600",
  },
  emerald: {
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-900/50",
    badgeBg: "bg-emerald-100 dark:bg-emerald-900/30",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    hoverBorder: "hover:border-emerald-400 dark:hover:border-emerald-600",
  },
  violet: {
    text: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/40",
    border: "border-violet-200 dark:border-violet-900/50",
    badgeBg: "bg-violet-100 dark:bg-violet-900/30",
    badgeText: "text-violet-700 dark:text-violet-300",
    hoverBorder: "hover:border-violet-400 dark:hover:border-violet-600",
  },
  amber: {
    text: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-200 dark:border-amber-900/50",
    badgeBg: "bg-amber-100 dark:bg-amber-900/30",
    badgeText: "text-amber-700 dark:text-amber-300",
    hoverBorder: "hover:border-amber-400 dark:hover:border-amber-600",
  },
  rose: {
    text: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-950/40",
    border: "border-rose-200 dark:border-rose-900/50",
    badgeBg: "bg-rose-100 dark:bg-rose-900/30",
    badgeText: "text-rose-700 dark:text-rose-300",
    hoverBorder: "hover:border-rose-400 dark:hover:border-rose-600",
  },
  cyan: {
    text: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    border: "border-cyan-200 dark:border-cyan-900/50",
    badgeBg: "bg-cyan-100 dark:bg-cyan-900/30",
    badgeText: "text-cyan-700 dark:text-cyan-300",
    hoverBorder: "hover:border-cyan-400 dark:hover:border-cyan-600",
  },
  orange: {
    text: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950/40",
    border: "border-orange-200 dark:border-orange-900/50",
    badgeBg: "bg-orange-100 dark:bg-orange-900/30",
    badgeText: "text-orange-700 dark:text-orange-300",
    hoverBorder: "hover:border-orange-400 dark:hover:border-orange-600",
  },
  teal: {
    text: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-950/40",
    border: "border-teal-200 dark:border-teal-900/50",
    badgeBg: "bg-teal-100 dark:bg-teal-900/30",
    badgeText: "text-teal-700 dark:text-teal-300",
    hoverBorder: "hover:border-teal-400 dark:hover:border-teal-600",
  },
  slate: {
    text: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-50 dark:bg-slate-950/40",
    border: "border-slate-200 dark:border-slate-800",
    badgeBg: "bg-slate-100 dark:bg-slate-900/30",
    badgeText: "text-slate-700 dark:text-slate-300",
    hoverBorder: "hover:border-slate-400 dark:hover:border-slate-600",
  },
  pink: {
    text: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-50 dark:bg-pink-950/40",
    border: "border-pink-200 dark:border-pink-900/50",
    badgeBg: "bg-pink-100 dark:bg-pink-900/30",
    badgeText: "text-pink-700 dark:text-pink-300",
    hoverBorder: "hover:border-pink-400 dark:hover:border-pink-600",
  },
  lime: {
    text: "text-lime-600 dark:text-lime-400",
    bg: "bg-lime-50 dark:bg-lime-950/40",
    border: "border-lime-200 dark:border-lime-900/50",
    badgeBg: "bg-lime-100 dark:bg-lime-900/30",
    badgeText: "text-lime-700 dark:text-lime-300",
    hoverBorder: "hover:border-lime-400 dark:hover:border-lime-600",
  },
  indigo: {
    text: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    border: "border-indigo-200 dark:border-indigo-900/50",
    badgeBg: "bg-indigo-100 dark:bg-indigo-900/30",
    badgeText: "text-indigo-700 dark:text-indigo-300",
    hoverBorder: "hover:border-indigo-400 dark:hover:border-indigo-600",
  },
};
