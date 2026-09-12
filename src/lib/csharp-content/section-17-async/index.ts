import type { LocalLesson } from "@/lib/lessons-data";
import { asyncSyncVsAsyncLesson } from "./async-sync-vs-async";
import { asyncTaskLesson } from "./async-task";
import { asyncAwaitLesson } from "./async-await";
import { asyncTaskWhenallLesson } from "./async-task-whenall";
import { asyncTaskWhenanyLesson } from "./async-task-whenany";
import { asyncCancellationtokenLesson } from "./async-cancellationtoken";
import { asyncTaskVsThreadLesson } from "./async-task-vs-thread";
import { asyncConcurrencyVsParallelismLesson } from "./async-concurrency-vs-parallelism";

export const SECTION_17_ASYNC_LESSONS: LocalLesson[] = [
  asyncSyncVsAsyncLesson,
  asyncTaskLesson,
  asyncAwaitLesson,
  asyncTaskWhenallLesson,
  asyncTaskWhenanyLesson,
  asyncCancellationtokenLesson,
  asyncTaskVsThreadLesson,
  asyncConcurrencyVsParallelismLesson,
];
