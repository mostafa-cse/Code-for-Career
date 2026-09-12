"use client";

import React, { useState, useEffect } from "react";
import {
  BD_SWE_ROADMAP,
  type RoadmapTrack,
  type RoadmapNode,
} from "@/lib/roadmap-data";
import { RoadmapCanvas } from "./roadmap-canvas";
import { RoadmapStepsView } from "./roadmap-steps-view";
import { RoadmapDrawer } from "./roadmap-drawer";
import { RoadmapSidebar } from "./roadmap-sidebar";
import { useLanguage } from "@/components/providers/language-provider";
import { Network, ListOrdered } from "lucide-react";

export function RoadmapView() {
  const { language, t } = useLanguage();

  // The website's flagship career roadmap
  const currentTrack: RoadmapTrack = BD_SWE_ROADMAP;

  // View mode: "graph" (Flowchart Canvas) vs "steps" (Step-by-step Milestones)
  const [viewMode, setViewMode] = useState<"graph" | "steps">("graph");

  // Selected node (opens side drawer)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Completed and Starred problem IDs (persisted to localStorage)
  const [completedProblemIds, setCompletedProblemIds] = useState<Set<string>>(
    () => new Set(["cs-1", "cs-2", "oop-1"])
  );
  const [starredProblemIds, setStarredProblemIds] = useState<Set<string>>(
    () => new Set(["cs-6", "oop-4", "net-1"])
  );

  // Load saved state from localStorage on client mount
  useEffect(() => {
    try {
      const savedCompleted = localStorage.getItem("roadmap_completed_ids");
      if (savedCompleted) {
        setCompletedProblemIds(new Set(JSON.parse(savedCompleted)));
      }
      const savedStarred = localStorage.getItem("roadmap_starred_ids");
      if (savedStarred) {
        setStarredProblemIds(new Set(JSON.parse(savedStarred)));
      }
      const savedView = localStorage.getItem("roadmap_view_mode") as "graph" | "steps";
      if (savedView === "graph" || savedView === "steps") {
        setViewMode(savedView);
      }
    } catch {
      // ignore
    }
  }, []);

  function handleToggleProblem(problemId: string) {
    setCompletedProblemIds((prev) => {
      const next = new Set(prev);
      if (next.has(problemId)) {
        next.delete(problemId);
      } else {
        next.add(problemId);
      }
      try {
        localStorage.setItem(
          "roadmap_completed_ids",
          JSON.stringify(Array.from(next))
        );
      } catch {
        // ignore
      }
      return next;
    });
  }

  function handleToggleStar(problemId: string) {
    setStarredProblemIds((prev) => {
      const next = new Set(prev);
      if (next.has(problemId)) {
        next.delete(problemId);
      } else {
        next.add(problemId);
      }
      try {
        localStorage.setItem(
          "roadmap_starred_ids",
          JSON.stringify(Array.from(next))
        );
      } catch {
        // ignore
      }
      return next;
    });
  }

  function handleRandomTopic() {
    const uncompletedNodes = currentTrack.nodes.filter((n) => {
      const isAllDone =
        n.problems.length > 0 &&
        n.problems.every((p) => completedProblemIds.has(p.id));
      return !isAllDone;
    });
    const pool = uncompletedNodes.length > 0 ? uncompletedNodes : currentTrack.nodes;
    const random = pool[Math.floor(Math.random() * pool.length)];
    setSelectedNodeId(random.id);
  }

  function handleResetProgress() {
    if (
      window.confirm(
        language === "bn"
          ? "আপনি কি সত্যিই সব প্রগ্রেস রিসেট করতে চান?"
          : "Are you sure you want to reset all your progress?"
      )
    ) {
      setCompletedProblemIds(new Set());
      setStarredProblemIds(new Set());
      try {
        localStorage.removeItem("roadmap_completed_ids");
        localStorage.removeItem("roadmap_starred_ids");
      } catch {
        // ignore
      }
    }
  }

  function handleViewModeChange(mode: "graph" | "steps") {
    setViewMode(mode);
    try {
      localStorage.setItem("roadmap_view_mode", mode);
    } catch {
      // ignore
    }
  }

  // Pre-calculate problem completion stats per node
  const nodeProgressMap: Record<
    string,
    { completed: number; total: number; isCompleted: boolean }
  > = {};

  currentTrack.nodes.forEach((node) => {
    const total = node.problems.length;
    let completed = 0;
    node.problems.forEach((p) => {
      if (completedProblemIds.has(p.id)) completed++;
    });
    nodeProgressMap[node.id] = {
      completed,
      total,
      isCompleted: total > 0 && completed === total,
    };
  });

  const selectedNode: RoadmapNode | null =
    currentTrack.nodes.find((n) => n.id === selectedNodeId) ?? null;

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full flex-col overflow-hidden bg-[#0d1017]">
      {/* Top Header Bar */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border/60 bg-[#121520] px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Network className="h-3.5 w-3.5" />
            </span>
            <h1 className="text-sm font-bold text-white sm:text-base">
              {language === "bn" ? currentTrack.titleBn : currentTrack.titleEn}
            </h1>
          </div>
          <span className="hidden rounded-md border border-border/60 bg-muted/20 px-2 py-0.5 text-[11px] font-semibold text-slate-400 md:inline-block">
            {t("Interactive Dependency Graph", "ইন্টারেক্টিভ ডিপেন্ডেন্সি গ্রাফ")}
          </span>
        </div>

        {/* View Mode Toggle: Graph vs Steps */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden lg:inline-flex items-center rounded-lg border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-400">
            {currentTrack.nodes.length} {t("Core Subjects", "টি মূল বিষয়")}
          </span>

          <div className="flex items-center rounded-xl border border-border/70 bg-[#151926] p-0.5 sm:p-1">
            <button
              type="button"
              onClick={() => handleViewModeChange("graph")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                viewMode === "graph"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Network className="h-3.5 w-3.5" />
              <span className="hidden xs:inline sm:inline">{t("Flowchart", "ফ্লোচার্ট")}</span>
            </button>
            <button
              type="button"
              onClick={() => handleViewModeChange("steps")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                viewMode === "steps"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ListOrdered className="h-3.5 w-3.5" />
              <span className="hidden xs:inline sm:inline">{t("Step-by-Step", "ধাপ অনুসারে")}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Area: Canvas or Steps View + Sidebar + Slide-in Drawer */}
      <div className="relative flex flex-1 overflow-hidden">
        {viewMode === "graph" ? (
          <>
            {/* Interactive Graph Canvas */}
            <div className="flex-1 overflow-hidden">
              <RoadmapCanvas
                track={currentTrack}
                selectedNodeId={selectedNodeId}
                onSelectNode={(nodeId) => setSelectedNodeId(nodeId)}
                nodeProgressMap={nodeProgressMap}
              />
            </div>

            {/* Gamified Sidebar (hidden on mobile, visible on lg screens) */}
            <RoadmapSidebar
              currentTrack={currentTrack}
              completedProblemIds={completedProblemIds}
              onRandomTopic={handleRandomTopic}
              onResetProgress={handleResetProgress}
            />
          </>
        ) : (
          <div className="flex-1 overflow-hidden">
            <RoadmapStepsView
              track={currentTrack}
              selectedNodeId={selectedNodeId}
              onSelectNode={(nodeId) => setSelectedNodeId(nodeId)}
              nodeProgressMap={nodeProgressMap}
            />
          </div>
        )}

        {/* Slide-in Topic Drawer when a node is clicked */}
        <RoadmapDrawer
          node={selectedNode}
          onClose={() => setSelectedNodeId(null)}
          completedProblemIds={completedProblemIds}
          starredProblemIds={starredProblemIds}
          onToggleProblem={handleToggleProblem}
          onToggleStar={handleToggleStar}
        />
      </div>
    </div>
  );
}
