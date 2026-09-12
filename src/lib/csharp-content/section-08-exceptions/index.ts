import type { LocalLesson } from "@/lib/lessons-data";
import { exceptionsTryCatchFinallyLesson } from "./exceptions-try-catch-finally";
import { exceptionsThrowLesson } from "./exceptions-throw";
import { exceptionsCustomLesson } from "./exceptions-custom";
import { exceptionsHierarchyLesson } from "./exceptions-hierarchy";

export const SECTION_08_EXCEPTIONS_LESSONS: LocalLesson[] = [
  exceptionsTryCatchFinallyLesson,
  exceptionsThrowLesson,
  exceptionsCustomLesson,
  exceptionsHierarchyLesson,
];
