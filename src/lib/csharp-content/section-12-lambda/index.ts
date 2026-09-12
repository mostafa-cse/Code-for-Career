import type { LocalLesson } from "@/lib/lessons-data";
import { lambdaSyntaxLesson } from "./lambda-syntax";
import { lambdaExpressionLesson } from "./lambda-expression";
import { lambdaStatementLesson } from "./lambda-statement";

export const SECTION_12_LAMBDA_LESSONS: LocalLesson[] = [
  lambdaSyntaxLesson,
  lambdaExpressionLesson,
  lambdaStatementLesson,
];
