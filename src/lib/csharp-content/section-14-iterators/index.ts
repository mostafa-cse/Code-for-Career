import type { LocalLesson } from "@/lib/lessons-data";
import { iteratorsIenumerableLesson } from "./iterators-ienumerable";
import { iteratorsIenumeratorLesson } from "./iterators-ienumerator";
import { iteratorsYieldLesson } from "./iterators-yield";

export const SECTION_14_ITERATORS_LESSONS: LocalLesson[] = [
  iteratorsIenumerableLesson,
  iteratorsIenumeratorLesson,
  iteratorsYieldLesson,
];
