"use client";

import React, { useState, useEffect } from "react";
import {
  BD_SWE_ROADMAP,
  NEETCODE_DSA_ROADMAP,
  ALL_ROADMAPS,
  type RoadmapTrack,
  type RoadmapNode,
} from "@/lib/roadmap-data";
import { RoadmapCanvas } from "./roadmap-canvas";
import { RoadmapDrawer } from "./roadmap-drawer";
import { RoadmapSidebar } from "./roadmap-sidebar";
import { useLanguage } from "@/components/providers/language-provider";
import { LayoutGrid, Network } from "lucide-react";

export function RoadmapView() {
  const { language, t } = useLanguage();

  // Track selection state
  const [selectedTrackId, setSelectedTrackId] = useState<string>("bd-swe");
  const currentTrack: RoadmapTrack =
    ALL_ROADMAPS.find((t) => t.id === selectedTrackId) ?? BD_SWE_ROADMAP;

  // Selected node (opens side drawer)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Completed and Starred problem IDs (persisted to localStorage)
  const [completedProblemIds, setCompletedProblemIds] = useState<Set<string>>(
    () => new Set(["cs-1", "cs-2", "nc-1", "nc-2", "nc-3"])
  );
  const [starredProblemIds, setStarredProblemIds] = useState<Set<string>>(
    () => new Set(["cs-6", "nc-4", "nc-14"])
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

  function handleResetProgress() {
    if (
      window.confirm(
        t(
          "Are you sure you want to reset your progress on this roadmap?",
          "আপনি কি নিশ্চিত যে এই রোডম্যাপের অগ্রগতি রিসেট করতে চান?"
        )
      )
    ) {
      setCompletedProblemIds(new Set());
      try {
        localStorage.removeItem("roadmap_completed_ids");
      } catch {
        // ignore
      }
    }
  }

  function handleRandomTopic() {
    // find nodes that have uncompleted problems
    const candidateNodes = currentTrack.nodes.filter((node) => {
      const remaining = node.problems.filter(
        (p) => !completedProblemIds.has(p.id)
      );
      return remaining.length > 0;
    });
    const pool = candidateNodes.length > 0 ? candidateNodes : currentTrack.nodes;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    if (picked) {
      setSelectedNodeId(picked.id);
    }
  }

  // Node progress computation for canvas styling
  const nodeProgressMap: Record<
    string,
    { completed: number; total: number; isCompleted: boolean }
  > = {};
  currentTrack.nodes.forEach((node) => {
    const total = node.problems.length;
    const completed = node.problems.filter((p) =>
      completedProblemIds.has(p.id)
    ).length;
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
          <span className="hidden rounded-md border border-border/60 bg-muted/20 px-2 py-0.5 text-[11px] font-semibold text-slate-400 sm:inline-block">
            {t("Interactive Dependency Graph", "ইন্টারেক্টিভ ডিপেন্ডেন্সি গ্রাফ")}
          </span>
        </div>

        {/* Track switch buttons on header for fast switching */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl border border-border/70 bg-[#161a26] p-1">
            <button
              type="button"
              onClick={() => {
                setSelectedTrackId("bd-swe");
                setSelectedNodeId(null);
              }}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                selectedTrackId === "bd-swe"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t("🇧🇩 BD Career", "🇧🇩 বিডি ক্যারিয়ার")}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedTrackId("dsa-neetcode");
                setSelectedNodeId(null);
              }}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                selectedTrackId === "dsa-neetcode"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t("⚡ NeetCode 150", "⚡ নিটকড ১৫০")}
            </button>
          </div>
        </div>
      </header>

      {/* Main Area: Canvas + Sidebar + Slide-in Drawer */}
      <div className="relative flex flex-1 overflow-hidden">
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
          onSelectTrack={(id) => {
            setSelectedTrackId(id);
            setSelectedNodeId(null);
          }}
          completedProblemIds={completedProblemIds}
          onRandomTopic={handleRandomTopic}
          onResetProgress={handleResetProgress}
        />

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
