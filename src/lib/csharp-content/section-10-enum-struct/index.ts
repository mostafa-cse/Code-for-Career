import type { LocalLesson } from "@/lib/lessons-data";
import { enumBasicsLesson } from "./enum-basics";
import { enumFlagsLesson } from "./enum-flags";
import { structBasicsLesson } from "./struct-basics";
import { structVsClassLesson } from "./struct-vs-class";

export const SECTION_10_ENUM_STRUCT_LESSONS: LocalLesson[] = [
  enumBasicsLesson,
  enumFlagsLesson,
  structBasicsLesson,
  structVsClassLesson,
];
