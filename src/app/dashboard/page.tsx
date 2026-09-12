import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Candidate Dashboard | ${SITE_NAME}`,
  description:
    "Track your progress across 12 software preparation subjects, problem sets, and interview readiness metrics.",
};

export default function DashboardPage() {
  return (
    <main className="flex-1 flex flex-col w-full min-h-0 bg-background">
      <DashboardView />
    </main>
  );
}
