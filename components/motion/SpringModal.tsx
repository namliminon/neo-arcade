"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { soundSynth } from "@/lib/audio/sound-synth";

interface SpringModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function SpringModal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-md",
}: SpringModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              soundSynth.play("click");
              onClose();
            }}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className={`relative z-10 w-full ${maxWidth} overflow-hidden rounded-2xl border border-white/[0.12] bg-[#121217] p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)]`}
          >
            {title && (
              <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-3">
                <h3 className="text-lg font-bold tracking-wide text-white">{title}</h3>
                <button
                  type="button"
                  onClick={() => {
                    soundSynth.play("click");
                    onClose();
                  }}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/[0.06] hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
