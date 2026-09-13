"use client";

import React, { useEffect, useRef } from "react";

interface ConfettiCanvasProps {
  onComplete?: () => void;
  duration?: number;
}

export function ConfettiCanvas({ onComplete, duration = 6500 }: ConfettiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssWidth = window.innerWidth;
    const cssHeight = window.innerHeight;

    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;

    const colors = [
      "#10B981", // Emerald
      "#34D399", // Light Emerald / Mint
      "#059669", // Deep Emerald
      "#6EE7B7", // Pale Mint
      "#F59E0B", // Amber Gold
      "#FBBF24", // Sun Gold
      "#FCD34D", // Pale Gold
      "#3B82F6", // Sapphire Blue
      "#60A5FA", // Sky Blue
      "#8B5CF6", // Royal Violet
      "#A78BFA", // Lavender
      "#EC4899", // Vivid Pink
      "#F43F5E", // Rose Coral
      "#06B6D4", // Electric Cyan
      "#67E8F9", // Bright Cyan
      "#FFFFFF", // Shimmer Diamond White
    ];

    type ShapeType = "star" | "rect" | "circle" | "ribbon" | "diamond";

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      widthMultiplier?: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      gravity: number;
      drag: number;
      shape: ShapeType;
      shimmerSpeed: number;
      shimmerPhase: number;
      wobble: number;
      wobbleSpeed: number;
      spawnTime: number;
    }

    const particles: Particle[] = [];

    // Helper: draw 5-point star
    function drawStar(
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number
    ) {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      context.beginPath();
      context.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        context.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        context.lineTo(x, y);
        rot += step;
      }
      context.lineTo(cx, cy - outerRadius);
      context.closePath();
      context.fill();
    }

    // Helper: draw 4-point diamond sparkle
    function drawDiamond(
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      size: number
    ) {
      context.beginPath();
      context.moveTo(cx, cy - size * 1.5);
      context.lineTo(cx + size * 0.7, cy);
      context.lineTo(cx, cy + size * 1.5);
      context.lineTo(cx - size * 0.7, cy);
      context.closePath();
      context.fill();
    }

    const shapes: ShapeType[] = ["star", "rect", "circle", "ribbon", "diamond"];

    function addCannonWave(
      originX: number,
      originY: number,
      baseAngle: number,
      spread: number,
      count: number,
      minSpeed: number,
      maxSpeed: number,
      spawnDelay: number = 0
    ) {
      for (let i = 0; i < count; i++) {
        const angle = baseAngle + (Math.random() - 0.5) * spread;
        const speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const isRibbon = shape === "ribbon";

        particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: isRibbon ? Math.random() * 8 + 7 : Math.random() * 12 + 6,
          widthMultiplier: isRibbon ? Math.random() * 3.5 + 2.5 : 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * (isRibbon ? 0.35 : 0.22),
          opacity: 1,
          gravity: isRibbon ? 0.22 : Math.random() * 0.08 + 0.26,
          drag: isRibbon ? 0.985 : 0.988,
          shape,
          shimmerSpeed: Math.random() * 0.12 + 0.06,
          shimmerPhase: Math.random() * Math.PI * 2,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: Math.random() * 0.14 + 0.06,
          spawnTime: spawnDelay,
        });
      }
    }

    function addSkyRain(count: number, spawnDelay: number) {
      for (let i = 0; i < count; i++) {
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const isRibbon = shape === "ribbon";

        particles.push({
          x: Math.random() * cssWidth,
          y: -Math.random() * 150 - 30,
          vx: (Math.random() - 0.5) * 8,
          vy: Math.random() * 5 + 3,
          size: isRibbon ? Math.random() * 8 + 6 : Math.random() * 11 + 5,
          widthMultiplier: isRibbon ? Math.random() * 3.6 + 2.4 : 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.28,
          opacity: 1,
          gravity: isRibbon ? 0.14 : 0.18,
          drag: 0.99,
          shape,
          shimmerSpeed: Math.random() * 0.12 + 0.06,
          shimmerPhase: Math.random() * Math.PI * 2,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: Math.random() * 0.14 + 0.05,
          spawnTime: spawnDelay,
        });
      }
    }

    // ── WAVE 1: Massive Sky-High Cannons (Blasts all the way to top of viewport) ──
    // Left Cannon blasts upward-right across the entire ceiling
    addCannonWave(cssWidth * 0.03, cssHeight * 0.96, -Math.PI * 0.32, 0.75, 220, 26, 46, 0);
    // Right Cannon blasts upward-left across the entire ceiling
    addCannonWave(cssWidth * 0.97, cssHeight * 0.96, -Math.PI * 0.68, 0.75, 220, 26, 46, 0);
    // Center Fountain blasts straight up through the middle
    addCannonWave(cssWidth * 0.5, cssHeight * 0.96, -Math.PI / 2, 0.95, 200, 28, 48, 0);

    // ── WAVE 2: Horizontal Mid-Screen Cross-Wind Blasters (t = 220ms) ──
    // Left edge cross-blast
    addCannonWave(0, cssHeight * 0.45, -Math.PI * 0.12, 0.75, 140, 22, 42, 220);
    // Right edge cross-blast
    addCannonWave(cssWidth, cssHeight * 0.45, -Math.PI * 0.88, 0.75, 140, 22, 42, 220);

    // ── WAVE 3: Ceiling Cascade Across Entire Page (t = 400ms) ──
    addSkyRain(280, 400);

    // ── WAVE 4: Second Ceiling Cascade (t = 800ms) ──
    addSkyRain(280, 800);

    // ── WAVE 5: Mid-Air 360° Starburst Celebration (t = 1200ms) ──
    addCannonWave(cssWidth * 0.5, cssHeight * 0.32, -Math.PI / 2, Math.PI * 2, 160, 8, 24, 1200);

    const startTime = performance.now();

    function render(currentTime: number) {
      if (!ctx || !canvas) return;
      const elapsed = currentTime - startTime;

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      const globalWind = Math.sin(elapsed * 0.0018) * 2.2;

      let alive = false;
      for (const p of particles) {
        if (elapsed < p.spawnTime) {
          alive = true;
          continue;
        }

        const particleElapsed = elapsed - p.spawnTime;

        p.vx *= p.drag;
        p.vy *= p.drag;
        p.vy += p.gravity;
        p.x += p.vx + Math.sin(p.wobble) * 1.6 + globalWind;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.wobble += p.wobbleSpeed;
        p.shimmerPhase += p.shimmerSpeed;

        if (particleElapsed > 3600) {
          p.opacity = Math.max(0, p.opacity - 0.012);
        }

        if (p.opacity > 0 && p.y < cssHeight + 100 && p.x > -150 && p.x < cssWidth + 150) {
          alive = true;
          const shimmer = Math.sin(p.shimmerPhase) * 0.3 + 0.7;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity * shimmer;

          // 3D tumble perspective
          const tumble = Math.abs(Math.cos(p.rotation * 1.3)) * 0.7 + 0.3;

          if (p.shape === "star") {
            drawStar(ctx, 0, 0, 5, p.size, p.size * 0.45);
          } else if (p.shape === "diamond") {
            drawDiamond(ctx, 0, 0, p.size);
          } else if (p.shape === "circle") {
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.shape === "ribbon") {
            const rw = p.size * (p.widthMultiplier || 3.0) * tumble;
            const rh = p.size * 0.7;
            ctx.fillRect(-rw / 2, -rh / 2, rw, rh);
          } else {
            const rw = p.size * tumble;
            ctx.fillRect(-rw / 2, -p.size / 2, rw, p.size * 0.8);
          }
          ctx.restore();
        }
      }

      ctx.restore();

      if (alive && elapsed < duration) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        if (onComplete) onComplete();
      }
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [duration, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      style={{ width: "100vw", height: "100vh" }}
      aria-hidden="true"
    />
  );
}
