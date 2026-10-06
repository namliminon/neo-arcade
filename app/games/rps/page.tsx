"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Trophy } from "lucide-react";
import { RpsGame } from "@/components/games/rps/RpsGame";
import { AuthModal } from "@/components/auth/AuthModal";

export default function RpsGamePage() {
  return (
    <div className="min-h-screen pb-16 pt-6 px-4">
      <AuthModal />

      {/* Header */}
      <div className="max-w-xl mx-auto mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Về Sảnh Game
        </Link>

        <Link
          href="/leaderboard?game=rps"
          className="flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-300 hover:bg-violet-500/20 transition-all"
        >
          <Trophy className="h-3.5 w-3.5" />
          BXH Oản Tù Tì
        </Link>
      </div>

      <div className="max-w-xl mx-auto text-center mb-6">
        <h1 className="text-3xl font-black text-white tracking-tight">Oản Tù Tì Đấu Trường</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Chơi đối kháng 2 người trên cùng máy hoặc tạo phòng đấu Online thời gian thực!
        </p>
      </div>

      <RpsGame />
    </div>
  );
}
