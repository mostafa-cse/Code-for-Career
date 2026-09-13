"use client";

import React, { useState, useEffect } from "react";

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  className?: string;
  sizeClassName?: string;
  shape?: "circle" | "rounded";
  textClassName?: string;
}

export function UserAvatar({
  src,
  name,
  className = "",
  sizeClassName = "h-10 w-10",
  shape = "rounded",
  textClassName = "",
}: UserAvatarProps) {
  const [hasError, setHasError] = useState(false);

  // Reset error if src changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const initials = (name || "?")
    .trim()
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-2xl";

  if (src && !hasError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onError={() => setHasError(true)}
        className={`${sizeClassName} ${shapeClass} object-cover ${className}`}
      />
    );
  }

  // Fallback Monogram Avatar with luxury gradient
  return (
    <div
      className={`flex ${sizeClassName} ${shapeClass} items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white font-black shadow-xs select-none ${textClassName} ${className}`}
      aria-label={name || "User Avatar"}
    >
      <span>{initials}</span>
    </div>
  );
}
