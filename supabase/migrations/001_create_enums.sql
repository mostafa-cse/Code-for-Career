-- Enums for application roles, difficulty levels, and statuses

create type user_role as enum ('USER', 'ADMIN');

create type difficulty_level as enum ('EASY', 'MEDIUM', 'HARD', 'INSANE');

create type progress_status as enum ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED');

create type suggestion_status as enum ('PENDING', 'APPROVED', 'REJECTED');
