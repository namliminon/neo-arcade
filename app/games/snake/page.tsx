"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Info } from "lucide-react";
import { SnakeGame } from "@/components/games/snake/SnakeGame";
import { AuthModal } from "@/components/auth/AuthModal";

export default function SnakeGamePage() {
  return (
    <div className="min-h-screen pb-16 pt-6 px-4">
      <AuthModal />

      {/* Header */}
      <div className="max-w-2xl mx-auto mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Về Sảnh Game
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/leaderboard?game=snake"
            className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-all"
          >
            <Trophy className="h-3.5 w-3.5" />
            Bảng Xếp Hạng Rắn
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto text-center mb-6">
        <h1 className="text-3xl font-black text-white tracking-tight">Rắn Săn Mồi Neon</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Ăn táo phát sáng, tăng tốc độ và phá kỷ lục toàn cầu để nhận thưởng xu!
        </p>
      </div>

      <SnakeGame />
    </div>
  );
}
