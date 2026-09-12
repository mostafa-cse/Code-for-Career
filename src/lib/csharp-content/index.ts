import type { LocalLesson } from "../lessons-data";
import { SECTION_01_SYNTAX_LESSONS } from "./section-01-syntax";
import { SECTION_02_CONTROL_FLOW_LESSONS } from "./section-02-control-flow";
import { SECTION_03_COLLECTIONS_LESSONS } from "./section-03-collections";
import { SECTION_04_METHODS_LESSONS } from "./section-04-methods";
import { SECTION_05_TYPE_SYSTEM_LESSONS } from "./section-05-type-system";
import { SECTION_06_STRINGS_LESSONS } from "./section-06-strings";
import { SECTION_07_GENERICS_LESSONS } from "./section-07-generics";
import { SECTION_08_EXCEPTIONS_LESSONS } from "./section-08-exceptions";
import { SECTION_09_NULLABLES_LESSONS } from "./section-09-nullables";
import { SECTION_10_ENUM_STRUCT_LESSONS } from "./section-10-enum-struct";
import { SECTION_11_DELEGATES_LESSONS } from "./section-11-delegates";
import { SECTION_12_LAMBDA_LESSONS } from "./section-12-lambda";
import { SECTION_13_LINQ_LESSONS } from "./section-13-linq";
import { SECTION_14_ITERATORS_LESSONS } from "./section-14-iterators";
import { SECTION_15_MEMORY_LESSONS } from "./section-15-memory";
import { SECTION_16_RESOURCES_LESSONS } from "./section-16-resources";
import { SECTION_17_ASYNC_LESSONS } from "./section-17-async";
import { SECTION_18_EVENTS_LESSONS } from "./section-18-events";

export const CSHARP_LESSONS: LocalLesson[] = [
  ...SECTION_01_SYNTAX_LESSONS,
  ...SECTION_02_CONTROL_FLOW_LESSONS,
  ...SECTION_03_COLLECTIONS_LESSONS,
  ...SECTION_04_METHODS_LESSONS,
  ...SECTION_05_TYPE_SYSTEM_LESSONS,
  ...SECTION_06_STRINGS_LESSONS,
  ...SECTION_07_GENERICS_LESSONS,
  ...SECTION_08_EXCEPTIONS_LESSONS,
  ...SECTION_09_NULLABLES_LESSONS,
  ...SECTION_10_ENUM_STRUCT_LESSONS,
  ...SECTION_11_DELEGATES_LESSONS,
  ...SECTION_12_LAMBDA_LESSONS,
  ...SECTION_13_LINQ_LESSONS,
  ...SECTION_14_ITERATORS_LESSONS,
  ...SECTION_15_MEMORY_LESSONS,
  ...SECTION_16_RESOURCES_LESSONS,
  ...SECTION_17_ASYNC_LESSONS,
  ...SECTION_18_EVENTS_LESSONS,
];
