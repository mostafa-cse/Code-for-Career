export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "USER" | "ADMIN";
export type DifficultyLevel = "EASY" | "MEDIUM" | "HARD" | "INSANE";
export type ProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED";
export type SuggestionStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Database {
  public: {
    Tables: {
      subjects: {
        Row: {
          id: string;
          slug: string;
          name_en: string;
          name_bn: string;
          icon: string;
          color: string;
          description_en: string | null;
          description_bn: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["subjects"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["subjects"]["Insert"]>;
      };
      lessons: {
        Row: {
          id: string;
          subject_id: string;
          slug: string;
          title_en: string;
          title_bn: string;
          content_en: string;
          content_bn: string;
          difficulty: DifficultyLevel;
          display_order: number;
          prerequisites: string[];
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["lessons"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["lessons"]["Insert"]>;
      };
      resources: {
        Row: {
          id: string;
          lesson_id: string;
          source: string;
          title: string;
          url: string;
          description: string | null;
          is_starred: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["resources"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["resources"]["Insert"]>;
      };
      problems: {
        Row: {
          id: string;
          lesson_id: string;
          source: string;
          name: string;
          url: string | null;
          difficulty: DifficultyLevel;
          company: string | null;
          tags: string[];
          solution_en: string | null;
          solution_bn: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["problems"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["problems"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          role: UserRole;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          status: ProgressStatus;
          completed_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["user_progress"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["user_progress"]["Insert"]>;
      };
      editorial_suggestions: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          title: string;
          content: string;
          status: SuggestionStatus;
          admin_feedback: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["editorial_suggestions"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["editorial_suggestions"]["Insert"]>;
      };
    };
  };
}
