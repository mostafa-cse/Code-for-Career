import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { RoadmapView } from "@/components/roadmap/roadmap-view";

export const metadata: Metadata = {
  title: `Interactive Career & DSA Roadmap — ${SITE_NAME}`,
  description:
    "Interactive dependency roadmap for Bangladesh software engineering interviews and NeetCode 150 DSA preparation. Visual DAG with topics, prerequisites, and practice problems.",
};

export default function RoadmapPage() {
  return <RoadmapView />;
}
