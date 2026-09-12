"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Plus, Minus, Maximize2 } from "lucide-react";
import type { RoadmapTrack, RoadmapNode } from "@/lib/roadmap-data";
import { useLanguage } from "@/components/providers/language-provider";

interface RoadmapCanvasProps {
  track: RoadmapTrack;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  nodeProgressMap: Record<string, { completed: number; total: number; isCompleted: boolean }>;
}

export function RoadmapCanvas({
  track,
  selectedNodeId,
  onSelectNode,
  nodeProgressMap,
}: RoadmapCanvasProps) {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  // Transform state for pan and zoom
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 40 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Center the canvas on initial mount or track change
  const resetView = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    // calculate initial pan to center the graph
    const initialX = Math.max(0, (containerWidth - track.canvasWidth) / 2);
    setPan({ x: initialX, y: 40 });
    setZoom(1);
  }, [track.canvasWidth]);

  useEffect(() => {
    resetView();
  }, [track.id, resetView]);

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

  // Calculate SVG curved paths between parents and children
  const edges: Array<{
    id: string;
    path: string;
    isCompleted: boolean;
    isActive: boolean;
  }> = [];

  track.nodes.forEach((parent) => {
    const pWidth = parent.width ?? 180;
    const pHeight = parent.height ?? 50;
    const startX = parent.x + pWidth / 2;
    const startY = parent.y + pHeight;

    parent.children.forEach((childId) => {
      const child = nodeMap.current.get(childId);
      if (!child) return;

      const cWidth = child.width ?? 180;
      const endX = child.x + cWidth / 2;
      const endY = child.y;

      const deltaY = Math.max(endY - startY, 40);
      const cpY1 = startY + deltaY * 0.5;
      const cpY2 = endY - deltaY * 0.5;

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
      className={`relative h-[calc(100vh-4rem)] w-full overflow-hidden select-none cursor-grab active:cursor-grabbing bg-dot-matrix bg-[#0f1117] text-foreground`}
      style={{
        backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.12) 1.2px, transparent 1.2px)`,
        backgroundSize: "24px 24px",
      }}
    >
      {/* Floating Canvas Controls (Zoom & Reset) */}
      <div className="roadmap-interactive absolute bottom-6 left-6 z-20 flex flex-col items-center gap-1.5 rounded-xl border border-border/70 bg-card/90 p-1.5 shadow-lg backdrop-blur-md">
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom In"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom Out"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="h-px w-5 bg-border my-0.5" />
        <button
          type="button"
          onClick={resetView}
          title="Reset View"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
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
        {/* SVG Connectors */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          width={track.canvasWidth}
          height={track.canvasHeight}
        >
          <defs>
            <linearGradient id="edge-gradient-active" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="edge-gradient-completed" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
            </linearGradient>
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
              strokeWidth={edge.isActive ? 2.5 : 2}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          ))}
        </svg>

        {/* Node Buttons (Interactive Pills) */}
        {track.nodes.map((node) => {
          const width = node.width ?? 180;
          const height = node.height ?? 50;
          const isSelected = node.id === selectedNodeId;
          const stats = nodeProgressMap[node.id] ?? {
            completed: 0,
            total: node.problems.length,
            isCompleted: false,
          };
          const pct = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

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
              className={`roadmap-interactive group flex flex-col justify-between rounded-xl border px-3.5 py-2.5 cursor-pointer shadow-md transition-all duration-200 select-none ${
                isSelected
                  ? "border-blue-500 bg-[#1e2235] ring-2 ring-blue-500/50 shadow-blue-500/10"
                  : stats.isCompleted
                  ? "border-emerald-500/50 bg-[#182623] hover:border-emerald-400 hover:bg-[#1b2c28]"
                  : "border-[#2b3245] bg-[#161a26] hover:border-foreground/40 hover:bg-[#1c2233]"
              }`}
            >
              {/* Top Row: Title + Optional Badge */}
              <div className="flex items-center justify-between gap-1.5">
                <span className="truncate text-xs font-bold tracking-tight text-white group-hover:text-blue-300 transition-colors">
                  {language === "bn" ? node.labelBn : node.labelEn}
                </span>
                {node.badge && (
                  <span className="shrink-0 rounded bg-blue-500/20 px-1 py-0.5 text-[9px] font-semibold text-blue-300 uppercase tracking-wider border border-blue-500/30">
                    {node.badge}
                  </span>
                )}
              </div>

              {/* Bottom Row: Progress indicator line */}
              <div className="mt-1.5 flex items-center gap-2">
                <div className="h-1 w-full overflow-hidden rounded-full bg-slate-700/60">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      stats.isCompleted
                        ? "bg-emerald-400"
                        : pct > 0
                        ? "bg-blue-400"
                        : "bg-slate-600"
                    }`}
                    style={{ width: `${Math.max(pct, pct > 0 ? 8 : 0)}%` }}
                  />
                </div>
                {stats.total > 0 && (
                  <span className="shrink-0 font-mono text-[10px] text-slate-400">
                    {stats.completed}/{stats.total}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
