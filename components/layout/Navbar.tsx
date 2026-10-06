"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/store/auth-context";
import { soundSynth } from "@/lib/audio/sound-synth";
import {
  Volume2,
  VolumeX,
  Shield,
  Trophy,
  Target,
  ShoppingBag,
  Sparkles,
  LogIn,
  LogOut,
  Gamepad2,
} from "lucide-react";
import { ShimmerText } from "@/components/motion/ShimmerText";

export function Navbar() {
  const { user, role, coins, level, logout, openAuthModal } = useAuth();
  const [isMuted, setIsMuted] = useState(soundSynth.isMuted());

  const handleToggleSound = () => {
    const muted = soundSynth.toggleMute();
    setIsMuted(muted);
    if (!muted) soundSynth.play("click");
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#09090b]/80 backdrop-blur-md px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 text-white shadow-[0_0_18px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform">
            <Gamepad2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-base font-black tracking-wider text-white">
              <ShimmerText text="NEO-ARCADE" shimmerColor="#06b6d4" />
            </div>
            <div className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase -mt-0.5">
              GLOBAL GAMING HUB
            </div>
          </div>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <Link
            href="/#games"
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            Trò Chơi
          </Link>
          <Link
            href="/leaderboard"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            Bảng Xếp Hạng
          </Link>
          <Link
            href="/quests"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <Target className="h-3.5 w-3.5 text-cyan-400" />
            Nhiệm Vụ
          </Link>
          <Link
            href="/shop"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <ShoppingBag className="h-3.5 w-3.5 text-violet-400" />
            Cửa Hàng
          </Link>
          {role === "admin" && (
            <Link
              href="/admin"
              className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
            >
              <Shield className="h-3.5 w-3.5" />
              Admin
            </Link>
          )}
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2.5">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-black/40 text-zinc-400 hover:text-white hover:border-cyan-500/30 transition-colors"
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4 text-cyan-400" />}
          </button>

          {/* User profile / login */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-black/50 border border-white/[0.08]">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <span>{coins}</span>
                  <span className="text-[10px]">🪙</span>
                </div>
                <div className="h-3 w-px bg-white/10" />
                <div className="text-[11px] text-zinc-400 font-mono">Lv.{level}</div>
              </div>

              <div className="flex items-center gap-2 pl-1">
                <img
                  src={user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
                  alt={user.username}
                  className="h-8 w-8 rounded-full border border-cyan-500/40 bg-zinc-800 object-cover"
                />
                <button
                  type="button"
                  onClick={logout}
                  title="Đăng xuất"
                  className="rounded-lg p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-white/[0.04] transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-3.5 py-2 text-xs font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:opacity-95 transition-opacity"
            >
              <LogIn className="h-3.5 w-3.5" />
              Đăng Nhập
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
