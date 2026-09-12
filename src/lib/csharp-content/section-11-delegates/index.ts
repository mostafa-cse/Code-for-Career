import type { LocalLesson } from "@/lib/lessons-data";
import { delegatesBasicLesson } from "./delegates-basic";
import { delegatesMulticastLesson } from "./delegates-multicast";
import { delegatesActionLesson } from "./delegates-action";
import { delegatesFuncLesson } from "./delegates-func";
import { delegatesPredicateLesson } from "./delegates-predicate";

export const SECTION_11_DELEGATES_LESSONS: LocalLesson[] = [
  delegatesBasicLesson,
  delegatesMulticastLesson,
  delegatesActionLesson,
  delegatesFuncLesson,
  delegatesPredicateLesson,
];
