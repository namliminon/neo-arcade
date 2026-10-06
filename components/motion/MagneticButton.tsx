"use client";

import React, { useRef, useState, MouseEvent } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { soundSynth } from "@/lib/audio/sound-synth";

interface MagneticButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  soundEffect?: "click" | "coin" | "jump";
}

export function MagneticButton({
  children,
  className = "",
  strength = 0.25,
  soundEffect = "click",
  onClick,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * strength, y: middleY * strength });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 20, mass: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        soundSynth.play(soundEffect);
        onClick?.(e);
      }}
      className={`relative inline-flex items-center justify-center overflow-hidden transition-shadow select-none active:scale-95 ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
