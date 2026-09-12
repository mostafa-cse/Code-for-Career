import type { LocalLesson } from "@/lib/lessons-data";
import { nullablesValueTypesLesson } from "./nullables-value-types";
import { nullablesReferenceTypesLesson } from "./nullables-reference-types";
import { nullablesCoalescingOperatorLesson } from "./nullables-coalescing-operator";
import { nullablesConditionalOperatorLesson } from "./nullables-conditional-operator";
import { nullablesForgivingOperatorLesson } from "./nullables-forgiving-operator";

export const SECTION_09_NULLABLES_LESSONS: LocalLesson[] = [
  nullablesValueTypesLesson,
  nullablesReferenceTypesLesson,
  nullablesCoalescingOperatorLesson,
  nullablesConditionalOperatorLesson,
  nullablesForgivingOperatorLesson,
];
