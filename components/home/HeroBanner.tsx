"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Gamepad2, Trophy, Globe, Zap } from "lucide-react";
import { ShimmerText } from "@/components/motion/ShimmerText";
import { MagneticButton } from "@/components/motion/MagneticButton";

export function HeroBanner() {
  return (
    <div className="relative pt-12 pb-16 text-center max-w-4xl mx-auto px-4 overflow-hidden">
      {/* Radiant Top Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-semibold mb-6 shadow-[0_0_20px_rgba(6,182,212,0.15)] animate-pulse">
        <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
        <span>Nền Tảng Web Arcade Toàn Cầu • Miễn Phí 100%</span>
      </div>

      {/* Main Heading */}
      <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight sm:leading-none mb-6">
        TRẢI NGHIỆM ĐẤU TRƯỜNG <br />
        <ShimmerText text="RETRO ARCADE 2.0" shimmerColor="#06b6d4" className="mt-2 text-transparent bg-clip-text" />
      </h1>

      <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed mb-8">
        Chơi mượt mà trên mọi điện thoại & máy tính toàn cầu. Từ các tựa game 1 người kinh điển như{" "}
        <strong className="text-cyan-400">Rắn Săn Mồi</strong>,{" "}
        <strong className="text-amber-400">Flappy Bird</strong> cho đến đấu trường 2 người đối kháng thời gian thực như{" "}
        <strong className="text-violet-400">Oản Tù Tì</strong> &{" "}
        <strong className="text-pink-400">Cờ Ca-rô</strong>.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
        <MagneticButton
          onClick={() => {
            document.getElementById("games")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-7 py-3 text-sm font-bold text-white shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:brightness-110 transition-all"
        >
          <Gamepad2 className="h-4 w-4 mr-2" />
          Chơi Ngay (4 Game)
        </MagneticButton>

        <Link
          href="/leaderboard"
          className="rounded-xl border border-white/10 bg-zinc-900/80 hover:bg-zinc-800 px-6 py-3 text-sm font-semibold text-zinc-200 transition-colors flex items-center gap-2"
        >
          <Trophy className="h-4 w-4 text-amber-400" />
          Bảng Vinh Danh
        </Link>
      </div>

      {/* Live Stats Highlight Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
        <div className="rounded-xl border border-white/[0.06] bg-black/40 p-3 backdrop-blur-sm">
          <div className="text-lg font-black text-cyan-400 font-mono">60 FPS</div>
          <div className="text-[11px] text-zinc-500 font-medium">Đồ Họa Canvas Neon</div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-black/40 p-3 backdrop-blur-sm">
          <div className="text-lg font-black text-violet-400 font-mono">&lt; 30ms</div>
          <div className="text-[11px] text-zinc-500 font-medium">Độ Trễ Realtime P2P</div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-black/40 p-3 backdrop-blur-sm">
          <div className="text-lg font-black text-amber-400 font-mono">100% Free</div>
          <div className="text-[11px] text-zinc-500 font-medium">Vercel & Supabase</div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-black/40 p-3 backdrop-blur-sm">
          <div className="text-lg font-black text-emerald-400 font-mono">Toàn Cầu</div>
          <div className="text-[11px] text-zinc-500 font-medium">Không Giới Hạn Thiết Bị</div>
        </div>
      </div>
    </div>
  );
}
