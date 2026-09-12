import type { LocalLesson } from "@/lib/lessons-data";
import { resourcesIdisposableLesson } from "./resources-idisposable";
import { resourcesDisposeLesson } from "./resources-dispose";
import { resourcesUsingLesson } from "./resources-using";
import { resourcesTryFinallyLesson } from "./resources-try-finally";

export const SECTION_16_RESOURCES_LESSONS: LocalLesson[] = [
  resourcesIdisposableLesson,
  resourcesDisposeLesson,
  resourcesUsingLesson,
  resourcesTryFinallyLesson,
];
