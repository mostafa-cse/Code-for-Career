import type { LocalLesson } from "@/lib/lessons-data";
import { typesValueTypesLesson } from "./types-value-types";
import { typesReferenceTypesLesson } from "./types-reference-types";
import { typesVarLesson } from "./types-var";
import { typesDynamicLesson } from "./types-dynamic";
import { typesObjectLesson } from "./types-object";
import { typesBoxingLesson } from "./types-boxing";
import { typesUnboxingLesson } from "./types-unboxing";

export const SECTION_05_TYPE_SYSTEM_LESSONS: LocalLesson[] = [
  typesValueTypesLesson,
  typesReferenceTypesLesson,
  typesVarLesson,
  typesDynamicLesson,
  typesObjectLesson,
  typesBoxingLesson,
  typesUnboxingLesson,
];
