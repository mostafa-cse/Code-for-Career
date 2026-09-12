import type { LocalLesson } from "@/lib/lessons-data";
import { genericsMethodsLesson } from "./generics-methods";
import { genericsClassesLesson } from "./generics-classes";
import { genericsInterfacesLesson } from "./generics-interfaces";
import { genericsConstraintsLesson } from "./generics-constraints";

export const SECTION_07_GENERICS_LESSONS: LocalLesson[] = [
  genericsMethodsLesson,
  genericsClassesLesson,
  genericsInterfacesLesson,
  genericsConstraintsLesson,
];
