-- Indexes and full-text search capabilities

create index idx_subjects_order on subjects(display_order);
create index idx_lessons_subject on lessons(subject_id, display_order);
create index idx_resources_lesson on resources(lesson_id, display_order);
create index idx_problems_lesson on problems(lesson_id, display_order);
create index idx_user_progress_user on user_progress(user_id);
create index idx_user_problem_progress_user on user_problem_progress(user_id);
create index idx_editorial_suggestions_status on editorial_suggestions(status);

-- Full text search function across lessons
create or replace function search_content(search_query text)
returns table (
  id uuid,
  subject_slug text,
  lesson_slug text,
  title text,
  snippet text,
  rank real
) language sql stable as $$
  select
    l.id,
    s.slug as subject_slug,
    l.slug as lesson_slug,
    l.title_en as title,
    ts_headline('english', l.content_en, plainto_tsquery('english', search_query)) as snippet,
    ts_rank(
      setweight(to_tsvector('english', l.title_en), 'A') ||
      setweight(to_tsvector('english', l.content_en), 'B'),
      plainto_tsquery('english', search_query)
    ) as rank
  from lessons l
  join subjects s on s.id = l.subject_id
  where
    to_tsvector('english', l.title_en || ' ' || l.content_en) @@ plainto_tsquery('english', search_query)
  order by rank desc
  limit 20;
$$;
