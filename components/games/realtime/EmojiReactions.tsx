"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { soundSynth } from "@/lib/audio/sound-synth";

interface FloatingEmoji {
  id: string;
  emoji: string;
  x: number;
}

interface EmojiReactionsProps {
  onSendEmoji: (emoji: string) => void;
  floatingEmojis: FloatingEmoji[];
}

const AVAILABLE_EMOJIS = ["🔥", "🏆", "😂", "😡", "😭", "⚡", "🎉"];

export function EmojiReactions({ onSendEmoji, floatingEmojis }: EmojiReactionsProps) {
  return (
    <div className="relative">
      {/* Floating Animated Emojis Screen Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        <AnimatePresence>
          {floatingEmojis.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 100, scale: 0.5, x: `${item.x}%` }}
              animate={{ opacity: 1, y: -400, scale: 1.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute bottom-16 text-4xl select-none filter drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
            >
              {item.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Emoji Trigger Bar */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-xl border border-white/[0.08] bg-black/40 backdrop-blur-md">
        <span className="text-[11px] font-medium text-zinc-500 pl-1">Thả biểu cảm:</span>
        <div className="flex items-center gap-1">
          {AVAILABLE_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                soundSynth.play("click");
                onSendEmoji(emoji);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/[0.08] active:scale-90 transition-transform text-lg"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
