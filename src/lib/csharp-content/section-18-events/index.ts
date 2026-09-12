import type { LocalLesson } from "@/lib/lessons-data";
import { eventsBasicsLesson } from "./events-basics";
import { eventsEventhandlerLesson } from "./events-eventhandler";
import { eventsSubscribeUnsubscribeLesson } from "./events-subscribe-unsubscribe";
import { eventsDelegateVsEventLesson } from "./events-delegate-vs-event";

export const SECTION_18_EVENTS_LESSONS: LocalLesson[] = [
  eventsBasicsLesson,
  eventsEventhandlerLesson,
  eventsSubscribeUnsubscribeLesson,
  eventsDelegateVsEventLesson,
];
