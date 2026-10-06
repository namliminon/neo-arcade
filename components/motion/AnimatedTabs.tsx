"use client";

import React from "react";
import { motion } from "framer-motion";
import { soundSynth } from "@/lib/audio/sound-synth";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface AnimatedTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  tabClassName?: string;
}

export function AnimatedTabs({
  tabs,
  activeTab,
  onChange,
  className = "",
  tabClassName = "",
}: AnimatedTabsProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-black/40 p-1.5 backdrop-blur-md ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              soundSynth.play("click");
              onChange(tab.id);
            }}
            className={`relative flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 ${
              isActive ? "text-cyan-300" : "text-zinc-400 hover:text-zinc-200"
            } ${tabClassName}`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon}
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
