import type { MetadataRoute } from "next";
import { SITE_URL, SUBJECTS } from "@/lib/constants";
import { LOCAL_CURRICULUM } from "@/lib/lessons-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  const now = new Date();

  // Core static pages
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/problems`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // 13 Subjects
  for (const subject of SUBJECTS) {
    routes.push({
      url: `${baseUrl}/subjects/${subject.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // All Lessons
  for (const [subjectSlug, subjectData] of Object.entries(LOCAL_CURRICULUM)) {
    for (const lesson of subjectData.lessons) {
      routes.push({
        url: `${baseUrl}/subjects/${subjectSlug}/${lesson.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return routes;
}
