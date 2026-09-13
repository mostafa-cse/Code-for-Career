"use client";

import React, { useEffect, useRef } from "react";

interface ConfettiCanvasProps {
  onComplete?: () => void;
  duration?: number;
}

export function ConfettiCanvas({ onComplete, duration = 6000 }: ConfettiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = window.devicePixelRatio || 1;
    const width = (canvas.width = window.innerWidth * dpr);
    const height = (canvas.height = window.innerHeight * dpr);

    const colors = [
      "#10B981", // Emerald
      "#34D399", // Light Emerald
      "#059669", // Deep Emerald
      "#6EE7B7", // Mint
      "#F59E0B", // Amber
      "#FBBF24", // Gold
      "#FCD34D", // Pale Gold
      "#3B82F6", // Sapphire
      "#60A5FA", // Sky Blue
      "#8B5CF6", // Royal Violet
      "#A78BFA", // Lavender
      "#EC4899", // Vivid Pink
      "#F43F5E", // Coral Rose
      "#06B6D4", // Electric Cyan
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
      context.moveTo(cx, cy - size * 1.4);
      context.lineTo(cx + size * 0.65, cy);
      context.lineTo(cx, cy + size * 1.4);
      context.lineTo(cx - size * 0.65, cy);
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
          size: isRibbon ? Math.random() * 6 + 5 : Math.random() * 10 + 5,
          widthMultiplier: isRibbon ? Math.random() * 3.2 + 2.4 : 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * (isRibbon ? 0.38 : 0.24),
          opacity: 1,
          gravity: isRibbon ? 0.19 : Math.random() * 0.08 + 0.22,
          drag: isRibbon ? 0.982 : 0.985,
          shape,
          shimmerSpeed: Math.random() * 0.12 + 0.06,
          shimmerPhase: Math.random() * Math.PI * 2,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: Math.random() * 0.14 + 0.06,
          spawnTime: spawnDelay,
        });
      }
    }

    // ── WAVE 1: Instant Tri-Cannon Blast (t = 0ms) ──
    // Left cannon shoots high into center-right
    addCannonWave(width * 0.05, height * 0.95, -Math.PI * 0.32, 0.7, 160, 15, 29, 0);
    // Right cannon shoots high into center-left
    addCannonWave(width * 0.95, height * 0.95, -Math.PI * 0.68, 0.7, 160, 15, 29, 0);
    // Center fountain shoots directly up to the top of screen
    addCannonWave(width * 0.5, height * 0.95, -Math.PI / 2, 0.9, 140, 16, 30, 0);

    // ── WAVE 2: Secondary Side & Center Volley (t = 280ms) ──
    addCannonWave(width * 0.15, height * 0.92, -Math.PI * 0.36, 0.6, 90, 13, 24, 280);
    addCannonWave(width * 0.85, height * 0.92, -Math.PI * 0.64, 0.6, 90, 13, 24, 280);
    addCannonWave(width * 0.5, height * 0.92, -Math.PI / 2, 1.4, 80, 14, 26, 280);

    // ── WAVE 3: Sky Cascade & Shimmer Rain (t = 650ms) ──
    addCannonWave(width * 0.3, height * 0.88, -Math.PI * 0.42, 0.8, 70, 12, 22, 650);
    addCannonWave(width * 0.7, height * 0.88, -Math.PI * 0.58, 0.8, 70, 12, 22, 650);

    // ── WAVE 4: Mid-air Sparkle Burst (t = 1100ms) ──
    addCannonWave(width * 0.5, height * 0.45, -Math.PI / 2, Math.PI * 2, 60, 5, 14, 1100);

    const startTime = performance.now();

    function render(currentTime: number) {
      if (!ctx || !canvas) return;
      const elapsed = currentTime - startTime;

      ctx.clearRect(0, 0, width, height);

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
        p.x += p.vx + Math.sin(p.wobble) * 1.3;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.wobble += p.wobbleSpeed;
        p.shimmerPhase += p.shimmerSpeed;

        if (particleElapsed > 3200) {
          p.opacity = Math.max(0, p.opacity - 0.011);
        }

        if (p.opacity > 0 && p.y < height + 90) {
          alive = true;
          const shimmer = Math.sin(p.shimmerPhase) * 0.3 + 0.7;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity * shimmer;

          if (p.shape === "star") {
            drawStar(ctx, 0, 0, 5, p.size, p.size * 0.45);
          } else if (p.shape === "diamond") {
            drawDiamond(ctx, 0, 0, p.size);
          } else if (p.shape === "circle") {
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.shape === "ribbon") {
            const rw = p.size * (p.widthMultiplier || 2.6);
            const rh = p.size * 0.65;
            ctx.fillRect(-rw / 2, -rh / 2, rw, rh);
          } else {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.75);
          }
          ctx.restore();
        }
      }

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
