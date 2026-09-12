"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Plus,
  Minus,
  Maximize2,
  Scan,
  RotateCcw,
  Code2,
  GitBranch,
  Boxes,
  Binary,
  Zap,
  Layers,
  Database,
  PenTool,
  Puzzle,
  Cpu,
  Globe,
  Server,
  Sparkles,
  Users,
  BookOpen,
  ArrowDown,
  Compass,
} from "lucide-react";
import type { RoadmapTrack, RoadmapNode } from "@/lib/roadmap-data";
import { BD_SWE_STAGES } from "@/lib/roadmap-data";
import { useLanguage } from "@/components/providers/language-provider";

interface RoadmapCanvasProps {
  track: RoadmapTrack;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  nodeProgressMap: Record<string, { completed: number; total: number; isCompleted: boolean }>;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Code2,
  GitBranch,
  Boxes,
  Binary,
  Zap,
  Layers,
  Database,
  PenTool,
  Puzzle,
  Cpu,
  Globe,
  Server,
  Sparkles,
  Users,
};

export function RoadmapCanvas({
  track,
  selectedNodeId,
  onSelectNode,
  nodeProgressMap,
}: RoadmapCanvasProps) {
  const { language, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  // Transform state for pan and zoom
  const [zoom, setZoom] = useState<number>(0.7);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 20 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Intelligent auto-fit that calculates scale so all stages (1 to 5) fit cleanly on screen
  const fitView = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    if (clientWidth <= 0 || clientHeight <= 0) return;

    const padX = 48;
    const padY = 36;
    const scaleX = (clientWidth - padX * 2) / track.canvasWidth;
    const scaleY = (clientHeight - padY * 2) / track.canvasHeight;
    const fitScale = Math.min(scaleX, scaleY);
    const targetZoom = Math.min(Math.max(+fitScale.toFixed(2), 0.45), 1.15);
    const targetX = Math.round((clientWidth - track.canvasWidth * targetZoom) / 2);
    const targetY = Math.round(Math.max(16, (clientHeight - track.canvasHeight * targetZoom) / 2));

    setZoom(targetZoom);
    setPan({ x: targetX, y: targetY });
  }, [track.canvasWidth, track.canvasHeight]);

  // Center the canvas at 100% (1:1) scale
  const resetTo100 = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth } = containerRef.current;
    const targetX = Math.max(20, Math.round((clientWidth - track.canvasWidth) / 2));
    setPan({ x: targetX, y: 24 });
    setZoom(1.0);
  }, [track.canvasWidth]);

  // Run fitView on mount and container resize
  useEffect(() => {
    const timer = setTimeout(() => {
      fitView();
    }, 50);

    const handleResize = () => {
      fitView();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [track.id, fitView]);

  // Mouse pan handlers
  function handleMouseDown(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest(".roadmap-interactive")) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    };
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  // Touch handlers for mobile pan
  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  function handleTouchStart(e: React.TouchEvent) {
    if ((e.target as HTMLElement).closest(".roadmap-interactive")) return;
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      };
      setIsDragging(true);
    }
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - touchStartRef.current.x,
      y: e.touches[0].clientY - touchStartRef.current.y,
    });
  }

  function handleTouchEnd() {
    setIsDragging(false);
  }

  // Zoom helpers
  function handleZoomIn() {
    setZoom((prev) => Math.min(1.8, +(prev + 0.15).toFixed(2)));
  }

  function handleZoomOut() {
    setZoom((prev) => Math.max(0.5, +(prev - 0.15).toFixed(2)));
  }

  // Node lookup map for quick edge coordinate calculation
  const nodeMap = useRef<Map<string, RoadmapNode>>(new Map());
  nodeMap.current = new Map(track.nodes.map((n) => [n.id, n]));

  // Calculate SVG curved paths with arrowheads between parents and children
  const edges: Array<{
    id: string;
    path: string;
    isCompleted: boolean;
    isActive: boolean;
  }> = [];

  track.nodes.forEach((parent) => {
    const pWidth = parent.width ?? 230;
    const pHeight = parent.height ?? 68;
    const startX = parent.x + pWidth / 2;
    const startY = parent.y + pHeight;

    parent.children.forEach((childId) => {
      const child = nodeMap.current.get(childId);
      if (!child) return;

      const cWidth = child.width ?? 230;
      const endX = child.x + cWidth / 2;
      const endY = child.y - 6; // stop just before child top edge for arrowhead

      const deltaY = Math.max(endY - startY, 40);
      const cpY1 = startY + deltaY * 0.45;
      const cpY2 = endY - deltaY * 0.45;

      const parentStats = nodeProgressMap[parent.id];
      const childStats = nodeProgressMap[child.id];
      const isCompleted = (parentStats?.isCompleted ?? false) && (childStats?.isCompleted ?? false);
      const isActive = parent.id === selectedNodeId || child.id === selectedNodeId;

      edges.push({
        id: `${parent.id}->${child.id}`,
        path: `M ${startX} ${startY} C ${startX} ${cpY1}, ${endX} ${cpY2}, ${endX} ${endY}`,
        isCompleted,
        isActive,
      });
    });
  });

  function handleWheel(e: React.WheelEvent) {
    // Zoom toward center when scrolling wheel on canvas
    if ((e.target as HTMLElement).closest(".roadmap-interactive")) return;
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.07 : -0.07;
    setZoom((prev) => Math.min(1.8, Math.max(0.4, +(prev + zoomDelta).toFixed(2))));
  }

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      className="relative h-[calc(100vh-4rem)] w-full overflow-hidden select-none cursor-grab active:cursor-grabbing bg-[#0b0e14] text-foreground"
      style={{
        backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.08) 1.2px, transparent 1.2px)`,
        backgroundSize: "24px 24px",
      }}
    >
      {/* Floating Canvas Controls (Zoom, Fit, 1:1, Reset) */}
      <div className="roadmap-interactive absolute bottom-6 left-6 z-20 flex flex-col items-center gap-1.5 rounded-2xl border border-border/70 bg-[#121622]/90 p-1.5 shadow-xl backdrop-blur-md">
        <button
          type="button"
          onClick={handleZoomIn}
          title={t("Zoom In (+)", "জুম ইন")}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-300 transition hover:bg-slate-800 hover:text-white cursor-pointer"
        >
          <Plus className="h-4 w-4" />
        </button>

        {/* Zoom level pill */}
        <span className="font-mono text-[10px] font-bold text-blue-400 select-none px-1">
          {Math.round(zoom * 100)}%
        </span>

        <button
          type="button"
          onClick={handleZoomOut}
          title={t("Zoom Out (-)", "জুম আউট")}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-300 transition hover:bg-slate-800 hover:text-white cursor-pointer"
        >
          <Minus className="h-4 w-4" />
        </button>

        <div className="h-px w-5 bg-border/60 my-0.5" />

        <button
          type="button"
          onClick={fitView}
          title={t("Fit All Stages to Screen", "পুরো রোডম্যাপ স্ক্রিনে ফিট করুন")}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-blue-400 transition hover:bg-blue-500/20 hover:text-blue-300 cursor-pointer"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={resetTo100}
          title={t("1:1 Actual Size (100%)", "আসল আকার (১০০%)")}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-300 transition hover:bg-slate-800 hover:text-white cursor-pointer"
        >
          <Scan className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={fitView}
          title={t("Reset Alignment", "রিসেট করুন")}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-white cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Floating Legend / Quick Guide */}
      <div className="roadmap-interactive pointer-events-none absolute bottom-6 right-6 z-20 hidden md:flex items-center gap-4 rounded-xl border border-border/60 bg-[#121622]/90 px-3.5 py-2 text-[11px] text-slate-400 backdrop-blur-md">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-blue-400" />
          {t("Core Path", "কোর পথ")}
        </span>
        <span className="flex items-center gap-1.5">
          <ArrowDown className="h-3 w-3 text-slate-400" />
          {t("Prerequisite Flow", "ধারাবাহিক ধাপ")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          {t("Completed", "সম্পন্ন")}
        </span>
      </div>

      {/* Transformable Canvas Layer */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
          width: `${track.canvasWidth}px`,
          height: `${track.canvasHeight}px`,
        }}
        className="relative transition-transform duration-75 ease-out"
      >
        {/* Stage Lanes / Section Banners in Background */}
        <div className="pointer-events-none absolute inset-0 z-0">
          {BD_SWE_STAGES.map((stage) => (
            <div
              key={stage.id}
              style={{
                position: "absolute",
                top: `${stage.y - 12}px`,
                left: "40px",
                width: `${track.canvasWidth - 80}px`,
                height: `${stage.height}px`,
              }}
              className="rounded-3xl border border-dashed border-slate-800/80 bg-slate-900/15 p-4"
            >
              <div className="flex items-center gap-2.5">
                <span className="rounded-md bg-blue-500/20 px-2 py-0.5 font-mono text-[10px] font-extrabold uppercase tracking-wider text-blue-400 border border-blue-500/30">
                  STAGE 0{stage.number}
                </span>
                <span className="text-xs font-bold text-slate-300">
                  {language === "bn" ? stage.titleBn : stage.titleEn}
                </span>
                <span className="hidden sm:inline-block text-[11px] text-slate-500">
                  • {language === "bn" ? stage.subtitleBn : stage.subtitleEn}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* SVG Connectors with Directional Arrowheads */}
        <svg
          className="pointer-events-none absolute inset-0 z-10 h-full w-full"
          width={track.canvasWidth}
          height={track.canvasHeight}
        >
          <defs>
            <linearGradient id="edge-gradient-active" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="edge-gradient-completed" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
            </linearGradient>

            {/* Default Arrowhead Marker */}
            <marker
              id="arrow-default"
              markerWidth="7"
              markerHeight="7"
              refX="5"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 1, 6 3.5, 0 6" fill="rgba(148, 163, 184, 0.55)" />
            </marker>

            {/* Active Highlight Arrowhead Marker */}
            <marker
              id="arrow-active"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
            >
              <polygon points="0 1, 7 4, 0 7" fill="#3b82f6" />
            </marker>

            {/* Completed Arrowhead Marker */}
            <marker
              id="arrow-completed"
              markerWidth="7"
              markerHeight="7"
              refX="5"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 1, 6 3.5, 0 6" fill="#10b981" />
            </marker>
          </defs>

          {edges.map((edge) => (
            <path
              key={edge.id}
              d={edge.path}
              fill="none"
              stroke={
                edge.isActive
                  ? "url(#edge-gradient-active)"
                  : edge.isCompleted
                  ? "url(#edge-gradient-completed)"
                  : "rgba(148, 163, 184, 0.35)"
              }
              strokeWidth={edge.isActive ? 2.5 : 1.8}
              strokeLinecap="round"
              markerEnd={`url(#${
                edge.isActive ? "arrow-active" : edge.isCompleted ? "arrow-completed" : "arrow-default"
              })`}
              className="transition-all duration-300"
            />
          ))}
        </svg>

        {/* Node Cards on Canvas */}
        <div className="relative z-20">
          {track.nodes.map((node) => {
            const width = node.width ?? 230;
            const height = node.height ?? 68;
            const isSelected = node.id === selectedNodeId;
            const stats = nodeProgressMap[node.id] ?? {
              completed: 0,
              total: node.problems.length,
              isCompleted: false,
            };
            const pct = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
            const IconComponent = (node.icon && ICON_MAP[node.icon]) || BookOpen;

            return (
              <div
                key={node.id}
                style={{
                  position: "absolute",
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  width: `${width}px`,
                  height: `${height}px`,
                }}
                onClick={() => onSelectNode(node.id)}
                className={`roadmap-interactive group flex flex-col justify-between rounded-2xl border px-3.5 py-2.5 cursor-pointer shadow-lg transition-all duration-200 select-none ${
                  isSelected
                    ? "border-blue-500 bg-[#1b233a] ring-2 ring-blue-500/50 shadow-blue-500/20 scale-[1.02]"
                    : stats.isCompleted
                    ? "border-emerald-500/50 bg-[#14231f] hover:border-emerald-400 hover:bg-[#172b26]"
                    : "border-slate-800 bg-[#141824] hover:border-blue-400/60 hover:bg-[#181f32]"
                }`}
              >
                {/* Header: Icon + Step + Title + Badge */}
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                      stats.isCompleted
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : isSelected
                        ? "bg-blue-600 text-white border-blue-500"
                        : "bg-blue-600/15 text-blue-400 border-blue-500/25 group-hover:bg-blue-600/25 transition-colors"
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        {t("Step", "ধাপ")} {String(node.stepNumber).padStart(2, "0")}
                      </span>
                      {node.badge && (
                        <span className="shrink-0 rounded bg-blue-500/15 px-1.5 py-0.2 text-[8px] font-bold uppercase tracking-wider text-blue-300 border border-blue-500/30">
                          {node.badge}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                      {language === "bn" ? node.labelBn : node.labelEn}
                    </p>
                  </div>
                </div>

                {/* Footer: Progress indicator line + counter */}
                <div className="flex items-center gap-2 pt-1 border-t border-border/40">
                  <div className="h-1 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        stats.isCompleted
                          ? "bg-emerald-400"
                          : pct > 0
                          ? "bg-blue-400"
                          : "bg-slate-700"
                      }`}
                      style={{ width: `${Math.max(pct, pct > 0 ? 8 : 0)}%` }}
                    />
                  </div>
                  {stats.total > 0 && (
                    <span className="shrink-0 font-mono text-[9px] font-bold text-slate-400">
                      {stats.completed}/{stats.total}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
