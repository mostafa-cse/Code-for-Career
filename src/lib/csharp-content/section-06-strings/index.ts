import type { LocalLesson } from "@/lib/lessons-data";
import { stringsMethodsLesson } from "./strings-methods";
import { stringsImmutabilityLesson } from "./strings-immutability";
import { stringsStringbuilderLesson } from "./strings-stringbuilder";
import { stringsStringVsStringbuilderLesson } from "./strings-string-vs-stringbuilder";

export const SECTION_06_STRINGS_LESSONS: LocalLesson[] = [
  stringsMethodsLesson,
  stringsImmutabilityLesson,
  stringsStringbuilderLesson,
  stringsStringVsStringbuilderLesson,
];
