import type { LocalLesson } from "@/lib/lessons-data";
import { linqWhereLesson } from "./linq-where";
import { linqSelectLesson } from "./linq-select";
import { linqSelectmanyLesson } from "./linq-selectmany";
import { linqOrderbyLesson } from "./linq-orderby";
import { linqGroupbyLesson } from "./linq-groupby";
import { linqJoinLesson } from "./linq-join";
import { linqAnyAllLesson } from "./linq-any-all";
import { linqFirstSingleLesson } from "./linq-first-single";
import { linqAggregatesLesson } from "./linq-aggregates";
import { linqDistinctLesson } from "./linq-distinct";
import { linqSkipTakeLesson } from "./linq-skip-take";
import { linqDeferredExecutionLesson } from "./linq-deferred-execution";
import { linqIenumerableLesson } from "./linq-ienumerable";
import { linqIqueryableLesson } from "./linq-iqueryable";

export const SECTION_13_LINQ_LESSONS: LocalLesson[] = [
  linqWhereLesson,
  linqSelectLesson,
  linqSelectmanyLesson,
  linqOrderbyLesson,
  linqGroupbyLesson,
  linqJoinLesson,
  linqAnyAllLesson,
  linqFirstSingleLesson,
  linqAggregatesLesson,
  linqDistinctLesson,
  linqSkipTakeLesson,
  linqDeferredExecutionLesson,
  linqIenumerableLesson,
  linqIqueryableLesson,
];
