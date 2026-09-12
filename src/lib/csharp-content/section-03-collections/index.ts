import type { LocalLesson } from "@/lib/lessons-data";
import { collectionsArrayLesson } from "./collections-array";
import { collectionsListLesson } from "./collections-list";
import { collectionsDictionaryLesson } from "./collections-dictionary";
import { collectionsHashsetLesson } from "./collections-hashset";
import { collectionsQueueLesson } from "./collections-queue";
import { collectionsStackLesson } from "./collections-stack";

export const SECTION_03_COLLECTIONS_LESSONS: LocalLesson[] = [
  collectionsArrayLesson,
  collectionsListLesson,
  collectionsDictionaryLesson,
  collectionsHashsetLesson,
  collectionsQueueLesson,
  collectionsStackLesson,
];
