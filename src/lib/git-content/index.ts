import type { LocalLesson } from "@/lib/lessons-data";
import { SECTION_01_FUNDAMENTALS_LESSONS } from "./section-01-fundamentals";
import { SECTION_02_SETUP_CONFIG_LESSONS } from "./section-02-setup-config";
import { SECTION_03_REPOSITORY_BASICS_LESSONS } from "./section-03-repository-basics";
import { SECTION_04_STAGING_COMMITS_LESSONS } from "./section-04-staging-commits";
import { SECTION_05_BRANCHING_LESSONS } from "./section-05-branching";
import { SECTION_06_MERGING_LESSONS } from "./section-06-merging";
import { SECTION_07_REMOTE_REPOSITORIES_LESSONS } from "./section-07-remote-repositories";
import { SECTION_08_GITHUB_BASICS_LESSONS } from "./section-08-github-basics";
import { SECTION_09_PULL_REQUESTS_LESSONS } from "./section-09-pull-requests";
import { SECTION_10_COLLABORATION_LESSONS } from "./section-10-collaboration";
import { SECTION_11_MERGE_VS_REBASE_LESSONS } from "./section-11-merge-vs-rebase";
import { SECTION_12_STASH_LESSONS } from "./section-12-stash";
import { SECTION_13_TAGS_RELEASES_LESSONS } from "./section-13-tags-releases";
import { SECTION_14_GITIGNORE_REPO_HYGIENE_LESSONS } from "./section-14-gitignore-repo-hygiene";
import { SECTION_15_GITHUB_AUTHENTICATION_LESSONS } from "./section-15-github-authentication";
import { SECTION_16_GITHUB_ISSUES_LESSONS } from "./section-16-github-issues";
import { SECTION_17_GITHUB_ACTIONS_LESSONS } from "./section-17-github-actions";
import { SECTION_18_GITHUB_SECURITY_LESSONS } from "./section-18-github-security";
import { SECTION_19_ADVANCED_GIT_LESSONS } from "./section-19-advanced-git";
import { SECTION_20_INTERVIEW_QUESTIONS_LESSONS } from "./section-20-interview-questions";

export const GIT_LESSONS: LocalLesson[] = [
  ...SECTION_01_FUNDAMENTALS_LESSONS,
  ...SECTION_02_SETUP_CONFIG_LESSONS,
  ...SECTION_03_REPOSITORY_BASICS_LESSONS,
  ...SECTION_04_STAGING_COMMITS_LESSONS,
  ...SECTION_05_BRANCHING_LESSONS,
  ...SECTION_06_MERGING_LESSONS,
  ...SECTION_07_REMOTE_REPOSITORIES_LESSONS,
  ...SECTION_08_GITHUB_BASICS_LESSONS,
  ...SECTION_09_PULL_REQUESTS_LESSONS,
  ...SECTION_10_COLLABORATION_LESSONS,
  ...SECTION_11_MERGE_VS_REBASE_LESSONS,
  ...SECTION_12_STASH_LESSONS,
  ...SECTION_13_TAGS_RELEASES_LESSONS,
  ...SECTION_14_GITIGNORE_REPO_HYGIENE_LESSONS,
  ...SECTION_15_GITHUB_AUTHENTICATION_LESSONS,
  ...SECTION_16_GITHUB_ISSUES_LESSONS,
  ...SECTION_17_GITHUB_ACTIONS_LESSONS,
  ...SECTION_18_GITHUB_SECURITY_LESSONS,
  ...SECTION_19_ADVANCED_GIT_LESSONS,
  ...SECTION_20_INTERVIEW_QUESTIONS_LESSONS,
];
