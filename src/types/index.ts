import type {
  DifficultyLevel,
  ProgressStatus,
  SuggestionStatus,
  UserRole,
} from "./database";

export type { DifficultyLevel, ProgressStatus, SuggestionStatus, UserRole };

export interface Subject {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  icon: string;
  color: string;
  descriptionEn: string | null;
  descriptionBn: string | null;
  displayOrder: number;
}

export interface Lesson {
  id: string;
  subjectId: string;
  slug: string;
  titleEn: string;
  titleBn: string;
  contentEn: string;
  contentBn: string;
  difficulty: DifficultyLevel;
  displayOrder: number;
  prerequisites: string[];
}

export interface Resource {
  id: string;
  lessonId: string;
  source: string;
  title: string;
  url: string;
  description: string | null;
  isStarred: boolean;
  displayOrder: number;
}

export interface Problem {
  id: string;
  lessonId: string;
  source: string;
  name: string;
  url: string | null;
  difficulty: DifficultyLevel;
  company: string | null;
  tags: string[];
  solutionEn: string | null;
  solutionBn: string | null;
  displayOrder: number;
}

export interface EditorialSuggestion {
  id: string;
  userId: string;
  lessonId: string;
  title: string;
  content: string;
  status: SuggestionStatus;
  adminFeedback: string | null;
  createdAt: string;
}
