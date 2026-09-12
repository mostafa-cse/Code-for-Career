import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { ProblemsDirectory } from "@/components/problems/problems-directory";

export const metadata: Metadata = {
  title: `Practice Problems & Company Challenges — ${SITE_NAME}`,
  description:
    "Solve curated software engineering interview questions and algorithmic challenges tagged by top Bangladesh tech employers: Enosis, Therap, Samsung R&D, Brain Station 23, and BJIT.",
};

export default function ProblemsPage() {
  return <ProblemsDirectory />;
}
