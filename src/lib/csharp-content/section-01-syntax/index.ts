import type { LocalLesson } from "@/lib/lessons-data";
import { csharpVariablesLesson } from "./csharp-variables";
import { csharpDataTypesLesson } from "./csharp-data-types";
import { csharpStringsSyntaxLesson } from "./csharp-strings-syntax";
import { csharpInputOutputLesson } from "./csharp-input-output";
import { csharpOperatorsLesson } from "./csharp-operators";

export const SECTION_01_SYNTAX_LESSONS: LocalLesson[] = [
  csharpVariablesLesson,
  csharpDataTypesLesson,
  csharpStringsSyntaxLesson,
  csharpInputOutputLesson,
  csharpOperatorsLesson,
];
