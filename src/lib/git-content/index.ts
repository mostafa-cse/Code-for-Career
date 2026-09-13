import type { LocalLesson } from "@/lib/lessons-data";
import { MODULE_1_LESSONS } from "./module-1-fundamentals";
import { MODULE_2_LESSONS } from "./module-2-commits-branching";
import { MODULE_3_LESSONS } from "./module-3-remotes-github";
import { MODULE_4_LESSONS } from "./module-4-rebase-stash-tags";
import { MODULE_5_LESSONS } from "./module-5-auth-actions-security";
import { MODULE_6_LESSONS } from "./module-6-advanced-interview";

export const GIT_LESSONS: LocalLesson[] = [
  ...MODULE_1_LESSONS,
  ...MODULE_2_LESSONS,
  ...MODULE_3_LESSONS,
  ...MODULE_4_LESSONS,
  ...MODULE_5_LESSONS,
  ...MODULE_6_LESSONS,
];
