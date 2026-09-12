import type { LocalLesson } from "@/lib/lessons-data";
import { csharpIfElseLesson } from "./csharp-if-else";
import { csharpSwitchLesson } from "./csharp-switch";
import { csharpForLoopLesson } from "./csharp-for-loop";
import { csharpWhileLoopLesson } from "./csharp-while-loop";
import { csharpDoWhileLoopLesson } from "./csharp-do-while-loop";
import { csharpForeachLoopLesson } from "./csharp-foreach-loop";

export const SECTION_02_CONTROL_FLOW_LESSONS: LocalLesson[] = [
  csharpIfElseLesson,
  csharpSwitchLesson,
  csharpForLoopLesson,
  csharpWhileLoopLesson,
  csharpDoWhileLoopLesson,
  csharpForeachLoopLesson,
];
