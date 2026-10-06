"use client";

import React from "react";

interface ShimmerTextProps {
  text: string;
  className?: string;
  shimmerColor?: string;
}

export function ShimmerText({
  text,
  className = "",
  shimmerColor = "#ffffff",
}: ShimmerTextProps) {
  return (
    <span
      className={`inline-block bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer font-bold ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.7) 0%, ${shimmerColor} 50%, rgba(255,255,255,0.7) 100%)`,
      }}
    >
      {text}
    </span>
  );
}
