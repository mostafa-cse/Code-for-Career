import type { LocalLesson } from "@/lib/lessons-data";
import { memoryStackLesson } from "./memory-stack";
import { memoryHeapLesson } from "./memory-heap";
import { memoryGarbageCollectionLesson } from "./memory-garbage-collection";
import { memoryGcGenerationsLesson } from "./memory-gc-generations";
import { memoryLohLesson } from "./memory-loh";

export const SECTION_15_MEMORY_LESSONS: LocalLesson[] = [
  memoryStackLesson,
  memoryHeapLesson,
  memoryGarbageCollectionLesson,
  memoryGcGenerationsLesson,
  memoryLohLesson,
];
