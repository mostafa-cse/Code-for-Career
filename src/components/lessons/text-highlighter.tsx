"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import {
  Highlighter,
  Trash2,
  Copy,
  Check,
  X,
  ChevronRight,
  Palette,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

export type HighlightColor = "yellow" | "green" | "blue" | "purple" | "orange";

export interface TextHighlight {
  id: string;
  color: HighlightColor;
  text: string;
  prefix: string;
  suffix: string;
  createdAt: number;
}

export interface HighlightColorConfig {
  id: HighlightColor;
  labelEn: string;
  labelBn: string;
  dotBg: string;
  borderClass: string;
  markClass: string;
}

export const HIGHLIGHT_COLORS: HighlightColorConfig[] = [
  {
    id: "yellow",
    labelEn: "Yellow",
    labelBn: "হলুদ",
    dotBg: "bg-amber-400",
    borderClass: "hover:ring-amber-400",
    markClass:
      "bg-amber-300/40 dark:bg-amber-400/25 border-b-2 border-amber-400/80 dark:border-amber-400/70 text-inherit rounded-xs px-0.5 transition-all cursor-pointer hover:bg-amber-300/60 dark:hover:bg-amber-400/35",
  },
  {
    id: "green",
    labelEn: "Emerald",
    labelBn: "সবুজ",
    dotBg: "bg-emerald-400",
    borderClass: "hover:ring-emerald-400",
    markClass:
      "bg-emerald-300/40 dark:bg-emerald-400/25 border-b-2 border-emerald-500/80 dark:border-emerald-400/70 text-inherit rounded-xs px-0.5 transition-all cursor-pointer hover:bg-emerald-300/60 dark:hover:bg-emerald-400/35",
  },
  {
    id: "blue",
    labelEn: "Sky Blue",
    labelBn: "নীল",
    dotBg: "bg-sky-400",
    borderClass: "hover:ring-sky-400",
    markClass:
      "bg-sky-300/40 dark:bg-sky-400/25 border-b-2 border-sky-400/80 dark:border-sky-400/70 text-inherit rounded-xs px-0.5 transition-all cursor-pointer hover:bg-sky-300/60 dark:hover:bg-sky-400/35",
  },
  {
    id: "purple",
    labelEn: "Violet",
    labelBn: "বেগুনি",
    dotBg: "bg-purple-400",
    borderClass: "hover:ring-purple-400",
    markClass:
      "bg-purple-300/40 dark:bg-purple-400/25 border-b-2 border-purple-400/80 dark:border-purple-400/70 text-inherit rounded-xs px-0.5 transition-all cursor-pointer hover:bg-purple-300/60 dark:hover:bg-purple-400/35",
  },
  {
    id: "orange",
    labelEn: "Coral Orange",
    labelBn: "কমলা",
    dotBg: "bg-orange-400",
    borderClass: "hover:ring-orange-400",
    markClass:
      "bg-orange-300/40 dark:bg-orange-400/25 border-b-2 border-orange-400/80 dark:border-orange-400/70 text-inherit rounded-xs px-0.5 transition-all cursor-pointer hover:bg-orange-300/60 dark:hover:bg-orange-400/35",
  },
];

function getHighlightClass(color: HighlightColor): string {
  const config = HIGHLIGHT_COLORS.find((c) => c.id === color);
  return config?.markClass || HIGHLIGHT_COLORS[0].markClass;
}

// Safely wrap text nodes inside a DOM Range without throwing on element boundaries
function wrapRangeWithMarks(
  range: Range,
  markId: string,
  color: HighlightColor
): HTMLElement[] {
  const marks: HTMLElement[] = [];
  if (range.collapsed) return marks;

  const root = range.commonAncestorContainer;
  const treeWalker = document.createTreeWalker(
    root.nodeType === Node.TEXT_NODE ? root.parentNode! : root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (!node.textContent || node.textContent.length === 0) {
          return NodeFilter.FILTER_REJECT;
        }
        const nodeRange = document.createRange();
        nodeRange.selectNodeContents(node);
        const isAfterStart =
          range.compareBoundaryPoints(Range.START_TO_END, nodeRange) > 0;
        const isBeforeEnd =
          range.compareBoundaryPoints(Range.END_TO_START, nodeRange) < 0;
        return isAfterStart && isBeforeEnd
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    }
  );

  const textNodes: Text[] = [];
  if (root.nodeType === Node.TEXT_NODE) {
    textNodes.push(root as Text);
  } else {
    let curr = treeWalker.nextNode();
    while (curr) {
      textNodes.push(curr as Text);
      curr = treeWalker.nextNode();
    }
  }

  textNodes.forEach((textNode) => {
    let start = 0;
    let end = textNode.length;

    if (textNode === range.startContainer) {
      start = range.startOffset;
    }
    if (textNode === range.endContainer) {
      end = range.endOffset;
    }

    if (start >= end) return;

    let targetNode = textNode;
    if (start > 0) {
      targetNode = textNode.splitText(start);
      end -= start;
    }
    if (end < targetNode.length) {
      targetNode.splitText(end);
    }

    const mark = document.createElement("mark");
    mark.setAttribute("data-highlight-id", markId);
    mark.setAttribute("data-highlight-color", color);
    mark.className = getHighlightClass(color);

    targetNode.parentNode?.replaceChild(mark, targetNode);
    mark.appendChild(targetNode);
    marks.push(mark);
  });

  return marks;
}

// Find character range in container matching text-quote
function findRangeForTextQuote(
  container: HTMLElement,
  highlight: TextHighlight
): Range | null {
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    null
  );
  const textNodes: { node: Text; start: number; end: number }[] = [];
  let fullText = "";
  let curr = walker.nextNode();
  while (curr) {
    const text = curr.textContent || "";
    if (text.length > 0) {
      textNodes.push({
        node: curr as Text,
        start: fullText.length,
        end: fullText.length + text.length,
      });
      fullText += text;
    }
    curr = walker.nextNode();
  }

  let matchIndex = -1;
  const targetText = highlight.text;

  // Try matching prefix + text + suffix
  if (highlight.prefix && highlight.suffix) {
    const query = highlight.prefix + targetText + highlight.suffix;
    const idx = fullText.indexOf(query);
    if (idx !== -1) {
      matchIndex = idx + highlight.prefix.length;
    }
  }

  // Try prefix + text
  if (matchIndex === -1 && highlight.prefix) {
    const idx = fullText.indexOf(highlight.prefix + targetText);
    if (idx !== -1) {
      matchIndex = idx + highlight.prefix.length;
    }
  }

  // Try text + suffix
  if (matchIndex === -1 && highlight.suffix) {
    const idx = fullText.indexOf(targetText + highlight.suffix);
    if (idx !== -1) {
      matchIndex = idx;
    }
  }

  // Fallback direct match
  if (matchIndex === -1) {
    matchIndex = fullText.indexOf(targetText);
  }

  if (matchIndex === -1) return null;

  const matchEnd = matchIndex + targetText.length;

  let startNodeInfo: { node: Text; start: number; end: number } | null = null;
  let endNodeInfo: { node: Text; start: number; end: number } | null = null;

  for (const info of textNodes) {
    if (!startNodeInfo && matchIndex >= info.start && matchIndex < info.end) {
      startNodeInfo = info;
    }
    if (!endNodeInfo && matchEnd > info.start && matchEnd <= info.end) {
      endNodeInfo = info;
    }
  }

  if (!startNodeInfo || !endNodeInfo) return null;

  const range = document.createRange();
  range.setStart(startNodeInfo.node, matchIndex - startNodeInfo.start);
  range.setEnd(endNodeInfo.node, matchEnd - endNodeInfo.start);
  return range;
}

interface FloatingPopoverState {
  isOpen: boolean;
  x: number;
  y: number;
  placement: "top" | "bottom";
  mode: "new_selection" | "existing_mark";
  existingId?: string;
  currentColor?: HighlightColor;
  range?: Range;
}

interface LessonContentHighlighterProps {
  children: ReactNode;
  subjectSlug: string;
  lessonSlug: string;
  displayLang: "en" | "bn";
  isDrawerOpen?: boolean;
  onCloseDrawer?: () => void;
  onHighlightsCountChange?: (count: number) => void;
}

export function LessonContentHighlighter({
  children,
  subjectSlug,
  lessonSlug,
  displayLang,
  isDrawerOpen = false,
  onCloseDrawer,
  onHighlightsCountChange,
}: LessonContentHighlighterProps) {
  const { user, openAuthModal } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const storageKey = `c4c_hl_${subjectSlug}_${lessonSlug}_${displayLang}`;

  const [highlights, setHighlights] = useState<TextHighlight[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(`c4c_hl_${subjectSlug}_${lessonSlug}_${displayLang}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [popover, setPopover] = useState<FloatingPopoverState>({
    isOpen: false,
    x: 0,
    y: 0,
    placement: "top",
    mode: "new_selection",
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync state if storageKey changes (e.g. language toggle or different lesson)
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw) as TextHighlight[];
          setHighlights(Array.isArray(parsed) ? parsed : []);
        } else {
          setHighlights([]);
        }
      } catch {
        setHighlights([]);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [storageKey]);

  // Notify parent of highlights count
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      onHighlightsCountChange?.(highlights.length);
    });
    return () => cancelAnimationFrame(raf);
  }, [highlights.length, onHighlightsCountChange]);

  // Render and apply marks in the DOM container whenever highlights change
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // First remove existing marks to prevent nested wraps
    const existingMarks = container.querySelectorAll("mark[data-highlight-id]");
    existingMarks.forEach((m) => {
      const parent = m.parentNode;
      while (m.firstChild) {
        parent?.insertBefore(m.firstChild, m);
      }
      parent?.removeChild(m);
      parent?.normalize();
    });

    if (highlights.length === 0) return;

    // Apply each highlight cleanly
    highlights.forEach((hl) => {
      try {
        const range = findRangeForTextQuote(container, hl);
        if (range) {
          wrapRangeWithMarks(range, hl.id, hl.color);
        }
      } catch {
        // Silently skip if range cannot be positioned
      }
    });
  }, [highlights, displayLang]);

  // Save highlights helper
  const persistHighlights = useCallback(
    (newHighlights: TextHighlight[]) => {
      setHighlights(newHighlights);
      try {
        localStorage.setItem(storageKey, JSON.stringify(newHighlights));
      } catch {
        // localStorage quota or private mode
      }
    },
    [storageKey]
  );

  // Position popover calculation
  const positionPopover = useCallback(
    (
      rect: DOMRect,
      mode: "new_selection" | "existing_mark",
      existingId?: string,
      color?: HighlightColor,
      range?: Range
    ) => {
      const popoverWidth = 240;
      const popoverHeight = 44;

      const viewportWidth = window.innerWidth;
      let x = rect.left + rect.width / 2;
      x = Math.max(popoverWidth / 2 + 10, Math.min(x, viewportWidth - popoverWidth / 2 - 10));

      let y = rect.top - popoverHeight - 10;
      let placement: "top" | "bottom" = "top";

      if (rect.top < popoverHeight + 60) {
        y = rect.bottom + 10;
        placement = "bottom";
      }

      setPopover({
        isOpen: true,
        x,
        y: y + window.scrollY,
        placement,
        mode,
        existingId,
        currentColor: color,
        range,
      });
    },
    []
  );

  // Handle text selection
  const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !containerRef.current) {
      return;
    }

    const text = selection.toString().trim();
    if (text.length === 0) return;

    const range = selection.getRangeAt(0);

    if (!containerRef.current.contains(range.commonAncestorContainer)) {
      return;
    }

    const ancestor =
      range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
        ? (range.commonAncestorContainer as HTMLElement)
        : range.commonAncestorContainer.parentElement;

    if (ancestor?.closest("button") || ancestor?.closest("input")) {
      return;
    }

    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;

    positionPopover(rect, "new_selection", undefined, undefined, range.cloneRange());
  }, [positionPopover]);

  // Handle clicking on existing marks or outside dismiss
  useEffect(() => {
    const handleMouseUp = () => {
      setTimeout(handleSelection, 50);
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const mark = target.closest("mark[data-highlight-id]");
      if (mark) {
        const id = mark.getAttribute("data-highlight-id");
        const color = mark.getAttribute("data-highlight-color") as HighlightColor;
        if (id) {
          const rect = mark.getBoundingClientRect();
          positionPopover(rect, "existing_mark", id, color);
          return;
        }
      }

      if (target.closest("[data-highlight-popover]")) {
        return;
      }

      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setPopover((prev) => (prev.isOpen ? { ...prev, isOpen: false } : prev));
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("click", handleClick);
    }

    return () => {
      container?.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("click", handleClick);
    };
  }, [handleSelection, positionPopover]);

  // Apply highlight from color swatch click
  const applyColor = useCallback(
    (color: HighlightColor) => {
      if (!user) {
        setPopover((prev) => ({ ...prev, isOpen: false }));
        openAuthModal(
          displayLang === "bn"
            ? "পড়ার অংশ হাইলাইট এবং নোট সংরক্ষণ করতে সাইন ইন প্রয়োজন।"
            : "Sign in to highlight text and save study notes across all your devices."
        );
        return;
      }

      if (popover.mode === "new_selection" && popover.range && containerRef.current) {
        const range = popover.range;
        const text = range.toString().trim();
        if (!text) return;

        const fullText = containerRef.current.textContent || "";
        const preRange = document.createRange();
        preRange.selectNodeContents(containerRef.current);
        preRange.setEnd(range.startContainer, range.startOffset);
        const startOffset = preRange.toString().length;

        const prefix = fullText.slice(Math.max(0, startOffset - 25), startOffset);
        const suffix = fullText.slice(startOffset + text.length, startOffset + text.length + 25);

        const newId = `hl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        wrapRangeWithMarks(range, newId, color);

        const newHl: TextHighlight = {
          id: newId,
          color,
          text,
          prefix,
          suffix,
          createdAt: Date.now(),
        };

        const updated = [...highlights, newHl];
        persistHighlights(updated);

        window.getSelection()?.removeAllRanges();
        setPopover((prev) => ({ ...prev, isOpen: false }));
      } else if (popover.mode === "existing_mark" && popover.existingId) {
        const targetId = popover.existingId;
        const updated = highlights.map((h) =>
          h.id === targetId ? { ...h, color } : h
        );
        persistHighlights(updated);

        if (containerRef.current) {
          const marks = containerRef.current.querySelectorAll(
            `mark[data-highlight-id="${targetId}"]`
          );
          marks.forEach((m) => {
            m.setAttribute("data-highlight-color", color);
            m.className = getHighlightClass(color);
          });
        }

        setPopover((prev) => ({ ...prev, isOpen: false }));
      }
    },
    [user, openAuthModal, displayLang, popover, highlights, persistHighlights]
  );

  // Remove single highlight
  const removeHighlight = useCallback(
    (id: string) => {
      if (!user) {
        setPopover((prev) => ({ ...prev, isOpen: false }));
        openAuthModal();
        return;
      }

      const updated = highlights.filter((h) => h.id !== id);
      persistHighlights(updated);

      if (containerRef.current) {
        const marks = containerRef.current.querySelectorAll(
          `mark[data-highlight-id="${id}"]`
        );
        marks.forEach((m) => {
          const parent = m.parentNode;
          while (m.firstChild) {
            parent?.insertBefore(m.firstChild, m);
          }
          parent?.removeChild(m);
          parent?.normalize();
        });
      }

      setPopover((prev) => ({ ...prev, isOpen: false }));
    },
    [user, openAuthModal, highlights, persistHighlights]
  );

  // Clear all highlights in current lesson
  const clearAllHighlights = useCallback(() => {
    if (!user) {
      openAuthModal();
      return;
    }

    persistHighlights([]);
    if (containerRef.current) {
      const marks = containerRef.current.querySelectorAll(
        "mark[data-highlight-id]"
      );
      marks.forEach((m) => {
        const parent = m.parentNode;
        while (m.firstChild) {
          parent?.insertBefore(m.firstChild, m);
        }
        parent?.removeChild(m);
        parent?.normalize();
      });
    }
  }, [user, openAuthModal, persistHighlights]);

  // Jump to highlight in content
  const jumpToHighlight = useCallback((id: string) => {
    if (!containerRef.current) return;
    const mark = containerRef.current.querySelector(
      `mark[data-highlight-id="${id}"]`
    );
    if (mark) {
      mark.scrollIntoView({ behavior: "smooth", block: "center" });
      mark.classList.add("ring-4", "ring-emerald-400", "ring-offset-2", "animate-pulse");
      setTimeout(() => {
        mark.classList.remove("ring-4", "ring-emerald-400", "ring-offset-2", "animate-pulse");
      }, 2200);
    }
  }, []);

  // Copy highlight text to clipboard
  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const isBn = displayLang === "bn";

  return (
    <div className="relative">
      {/* ── Main Content Container ── */}
      <div ref={containerRef} className="selection:bg-emerald-500/20 selection:text-foreground">
        {children}
      </div>

      {/* ── Floating Selection / Mark Popover Toolbar ── */}
      {popover.isOpen && (
        <div
          data-highlight-popover="true"
          style={{
            position: "absolute",
            top: `${popover.y}px`,
            left: `${popover.x}px`,
            transform: "translateX(-50%)",
          }}
          className="z-50 pointer-events-auto animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center gap-1.5 rounded-full border border-border/80 bg-slate-900/95 text-slate-100 p-1.5 shadow-2xl backdrop-blur-md">
            {/* Color Swatches */}
            <div className="flex items-center gap-1 px-1">
              {HIGHLIGHT_COLORS.map((c) => {
                const isActive = popover.currentColor === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => applyColor(c.id)}
                    title={isBn ? c.labelBn : c.labelEn}
                    className={`relative flex h-6 w-6 items-center justify-center rounded-full transition-all duration-150 cursor-pointer ${
                      c.dotBg
                    } ${c.borderClass} hover:scale-115 active:scale-95 ${
                      isActive ? "ring-2 ring-white scale-110 shadow-sm" : ""
                    }`}
                  >
                    {isActive && (
                      <Check className="h-3.5 w-3.5 text-slate-950 font-bold stroke-[3]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Separator if existing mark */}
            {popover.mode === "existing_mark" && popover.existingId && (
              <>
                <div className="h-4 w-px bg-slate-700 mx-0.5" />

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeHighlight(popover.existingId!)}
                  title={isBn ? "মার্ক মুছুন" : "Remove Highlight"}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Highlights Drawer / Modal ── */}
      {isDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex justify-end bg-background/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div
            className="w-full max-w-md h-full bg-card border-l border-border shadow-2xl flex flex-col p-6 overflow-hidden animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <Highlighter className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {isBn ? "চিহ্নিত নোট ও হাইলাইটস" : "Marked Highlights"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {highlights.length}{" "}
                    {isBn ? "টি অংশ মার্ক করা হয়েছে" : "highlights saved"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onCloseDrawer}
                className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Highlights List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {highlights.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center p-6 space-y-3">
                  <div className="h-12 w-12 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground">
                    <Palette className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      {isBn ? "কোনো হাইলাইট নেই" : "No highlights yet"}
                    </p>
                    <p className="text-xs text-muted-foreground max-w-xs">
                      {isBn
                        ? "পড়ার সময় যেকোনো শব্দ বা বাক্য সিলেক্ট করে ৫টি ভিন্ন রঙের হাইলাইটার ব্যবহার করুন।"
                        : "Select any word, line, or sub-section while reading to highlight it with 5 custom colors."}
                    </p>
                  </div>
                </div>
              ) : (
                highlights.map((hl) => {
                  const colorConfig =
                    HIGHLIGHT_COLORS.find((c) => c.id === hl.color) ||
                    HIGHLIGHT_COLORS[0];
                  return (
                    <div
                      key={hl.id}
                      className="group rounded-xl border border-border/80 bg-background/50 hover:bg-muted/40 p-3.5 space-y-2 transition-all"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${colorConfig.dotBg}`}
                          />
                          <span className="font-medium text-foreground text-[11px]">
                            {isBn ? colorConfig.labelBn : colorConfig.labelEn}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleCopyText(hl.id, hl.text)}
                            title={isBn ? "কপি করুন" : "Copy text"}
                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            {copiedId === hl.id ? (
                              <Check className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeHighlight(hl.id)}
                            title={isBn ? "মুছুন" : "Remove"}
                            className="p-1 rounded hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Quoted Text Preview */}
                      <p
                        onClick={() => {
                          jumpToHighlight(hl.id);
                          onCloseDrawer?.();
                        }}
                        className={`text-xs text-foreground/90 font-sans leading-relaxed line-clamp-3 p-2 rounded-lg cursor-pointer transition-colors ${colorConfig.markClass}`}
                      >
                        &ldquo;{hl.text}&rdquo;
                      </p>

                      <div className="flex justify-between items-center text-[10px] text-muted-foreground/70 pt-1">
                        <span>{new Date(hl.createdAt).toLocaleDateString()}</span>
                        <button
                          type="button"
                          onClick={() => {
                            jumpToHighlight(hl.id);
                            onCloseDrawer?.();
                          }}
                          className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium hover:underline cursor-pointer"
                        >
                          <span>{isBn ? "পাঠ্যে যান" : "Jump to text"}</span>
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Drawer Footer */}
            {highlights.length > 0 && (
              <div className="pt-4 border-t border-border flex items-center justify-between">
                <button
                  type="button"
                  onClick={clearAllHighlights}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-medium cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>{isBn ? "সব হাইলাইট মুছুন" : "Clear All Highlights"}</span>
                </button>
                <button
                  type="button"
                  onClick={onCloseDrawer}
                  className="rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted/80 cursor-pointer"
                >
                  {isBn ? "বন্ধ করুন" : "Close"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
