"use client";

import React, { useEffect, useRef } from "react";

interface ConfettiCanvasProps {
  onComplete?: () => void;
  duration?: number;
}

export function ConfettiCanvas({ onComplete, duration = 4500 }: ConfettiCanvasProps) {
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
      "#059669", // Deep Emerald
      "#34D399", // Light Emerald
      "#F59E0B", // Amber Gold
      "#EAB308", // Bright Gold
      "#3B82F6", // Sapphire Blue
      "#8B5CF6", // Royal Violet
      "#06B6D4", // Electric Cyan
      "#FFFFFF", // Shimmer Diamond
    ];

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      gravity: number;
      drag: number;
      shape: "star" | "rect" | "circle";
      shimmerSpeed: number;
      shimmerPhase: number;
    }

    const particles: Particle[] = [];
    const totalParticles = 140;

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

    // Left cannon (blasts upward-right from bottom-left)
    for (let i = 0; i < totalParticles / 2; i++) {
      const angle = -Math.PI / 3 + (Math.random() - 0.5) * 0.65;
      const speed = Math.random() * 16 + 9;
      const shapes: ("star" | "rect" | "circle")[] = ["star", "rect", "circle"];
      particles.push({
        x: width * 0.12,
        y: height * 0.92,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 9 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.25,
        opacity: 1,
        gravity: 0.25,
        drag: 0.985,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        shimmerSpeed: Math.random() * 0.1 + 0.05,
        shimmerPhase: Math.random() * Math.PI * 2,
      });
    }

    // Right cannon (blasts upward-left from bottom-right)
    for (let i = 0; i < totalParticles / 2; i++) {
      const angle = (-Math.PI * 2) / 3 + (Math.random() - 0.5) * 0.65;
      const speed = Math.random() * 16 + 9;
      const shapes: ("star" | "rect" | "circle")[] = ["star", "rect", "circle"];
      particles.push({
        x: width * 0.88,
        y: height * 0.92,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 9 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.25,
        opacity: 1,
        gravity: 0.25,
        drag: 0.985,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        shimmerSpeed: Math.random() * 0.1 + 0.05,
        shimmerPhase: Math.random() * Math.PI * 2,
      });
    }

    const startTime = performance.now();

    function render(currentTime: number) {
      if (!ctx || !canvas) return;
      const elapsed = currentTime - startTime;

      ctx.clearRect(0, 0, width, height);

      let alive = false;
      for (const p of particles) {
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.shimmerPhase += p.shimmerSpeed;

        if (elapsed > 1800) {
          p.opacity = Math.max(0, p.opacity - 0.015);
        }

        if (p.opacity > 0 && p.y < height + 60) {
          alive = true;
          const shimmer = Math.sin(p.shimmerPhase) * 0.25 + 0.75;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity * shimmer;

          if (p.shape === "star") {
            drawStar(ctx, 0, 0, 5, p.size, p.size * 0.45);
          } else if (p.shape === "circle") {
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
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
