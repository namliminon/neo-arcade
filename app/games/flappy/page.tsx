"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Trophy } from "lucide-react";
import { FlappyGame } from "@/components/games/flappy/FlappyGame";
import { AuthModal } from "@/components/auth/AuthModal";

export default function FlappyGamePage() {
  return (
    <div className="min-h-screen pb-16 pt-6 px-4">
      <AuthModal />

      {/* Header */}
      <div className="max-w-md mx-auto mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Về Sảnh Game
        </Link>

        <Link
          href="/leaderboard?game=flappy"
          className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all"
        >
          <Trophy className="h-3.5 w-3.5" />
          BXH Flappy
        </Link>
      </div>

      <div className="max-w-md mx-auto text-center mb-6">
        <h1 className="text-3xl font-black text-white tracking-tight">Cyber Flappy Bird</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Chinh phục các cột laser neon và ghi tên lên bảng vinh danh!
        </p>
      </div>

      <FlappyGame />
    </div>
  );
}
