"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Trophy } from "lucide-react";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { AuthModal } from "@/components/auth/AuthModal";

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen pb-20 pt-8 px-4">
      <AuthModal />

      {/* Header */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Về Sảnh Game
        </Link>
      </div>

      <div className="max-w-3xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold mb-3">
          <Trophy className="h-3.5 w-3.5" />
          Đại Lộ Danh Vọng Toàn Cầu
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Bảng Xếp Hạng Kỷ Lục
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-md mx-auto">
          Tôn vinh các cao thủ có điểm số kỷ lục trong từng tựa game của đấu trường Neo-Arcade.
        </p>
      </div>

      <LeaderboardTable />
    </div>
  );
}
