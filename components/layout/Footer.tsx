import React from "react";
import Link from "next/link";
import { Gamepad2, Heart, Globe, Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#09090b] py-12 px-4 sm:px-8 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Gamepad2 className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-wide">NEO-ARCADE PLATFORM</div>
            <div className="text-xs text-zinc-500">Mạng lưới trò chơi web arcade toàn cầu không giới hạn</div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-zinc-400">
          <Link href="/leaderboard" className="hover:text-cyan-300 transition-colors">
            Bảng Xếp Hạng
          </Link>
          <Link href="/quests" className="hover:text-cyan-300 transition-colors">
            Nhiệm Vụ
          </Link>
          <Link href="/shop" className="hover:text-cyan-300 transition-colors">
            Cửa Hàng
          </Link>
          <Link href="/admin" className="hover:text-amber-300 transition-colors flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Quản Trị
          </Link>
        </div>

        <div className="text-xs text-zinc-500 text-center md:text-right">
          <span>Triển khai 100% miễn phí trên Vercel & Supabase</span>
        </div>
      </div>
    </footer>
  );
}
