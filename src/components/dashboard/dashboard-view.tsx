"use client";

import { DashboardHeader } from "./dashboard-header";
import { SectionLayout } from "./section-layout";

export function DashboardView() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-background text-foreground">
      {/* 1. Full-bleed edge-to-edge Header Banner with metrics strip */}
      <DashboardHeader />

      {/* 2. Full-bleed edge-to-edge Workspace: Left rail attached to 0, Right content attached to 100% */}
      <div className="flex-1 w-full min-h-0 flex flex-col">
        <SectionLayout />
      </div>
    </div>
  );
}
