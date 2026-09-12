import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { RoadmapView } from "@/components/roadmap/roadmap-view";

export const metadata: Metadata = {
  title: `Interactive Career Roadmap — ${SITE_NAME}`,
  description:
    "Interactive dependency roadmap for Bangladesh software engineering interviews. Visual DAG covering 12 core subjects, prerequisites, and preparation topics.",
};

export default function RoadmapPage() {
  return <RoadmapView />;
}
