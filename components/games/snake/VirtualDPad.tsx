"use client";

import React from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Direction } from "./snake-math";
import { soundSynth } from "@/lib/audio/sound-synth";

interface VirtualDPadProps {
  onDirectionChange: (dir: Direction) => void;
  currentDirection: Direction;
}

export function VirtualDPad({ onDirectionChange, currentDirection }: VirtualDPadProps) {
  const handlePress = (dir: Direction) => {
    soundSynth.play("click");
    onDirectionChange(dir);
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 select-none touch-none">
      <button
        type="button"
        onClick={() => handlePress("UP")}
        className={`flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 active:bg-cyan-500/30 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)] ${
          currentDirection === "UP" ? "border-cyan-400 bg-cyan-500/25" : ""
        }`}
      >
        <ChevronUp className="h-6 w-6" />
      </button>

      <div className="flex items-center gap-6 my-1.5">
        <button
          type="button"
          onClick={() => handlePress("LEFT")}
          className={`flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 active:bg-cyan-500/30 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)] ${
            currentDirection === "LEFT" ? "border-cyan-400 bg-cyan-500/25" : ""
          }`}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div className="h-8 w-8 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-[10px] text-zinc-600 font-mono">
          🕹️
        </div>

        <button
          type="button"
          onClick={() => handlePress("RIGHT")}
          className={`flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 active:bg-cyan-500/30 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)] ${
            currentDirection === "RIGHT" ? "border-cyan-400 bg-cyan-500/25" : ""
          }`}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => handlePress("DOWN")}
        className={`flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 active:bg-cyan-500/30 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)] ${
          currentDirection === "DOWN" ? "border-cyan-400 bg-cyan-500/25" : ""
        }`}
      >
        <ChevronDown className="h-6 w-6" />
      </button>
    </div>
  );
}
