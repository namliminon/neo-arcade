"use client";

import React from "react";
import Link from "next/link";
import { GAMES_CATALOG } from "@/lib/constants/games";
import { SpotlightCard } from "@/components/motion/SpotlightCard";
import { Users, ArrowRight, Sparkles } from "lucide-react";
import { soundSynth } from "@/lib/audio/sound-synth";

export function GameGrid() {
  return (
    <section id="games" className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            Danh Mục Trò Chơi
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Chọn Game & Chiến Ngay
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
          Hỗ trợ điều khiển cảm ứng tối ưu cho điện thoại và bàn phím máy tính. Tự động lưu điểm vào bảng xếp hạng toàn cầu.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GAMES_CATALOG.map((game) => (
          <Link
            key={game.id}
            href={game.href}
            onClick={() => soundSynth.play("click")}
            className="group block"
          >
            <SpotlightCard
              spotlightColor={game.glowColor}
              className="p-6 h-full flex flex-col justify-between transition-all group-hover:scale-[1.01]"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl filter drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                      {game.icon}
                    </span>
                    <div>
                      <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                        {game.title}
                      </h3>
                      <div className="text-xs text-zinc-400 font-mono">{game.subtitle}</div>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.04] text-zinc-300">
                    {game.badge}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 mb-6 leading-relaxed">
                  {game.description}
                </p>
              </div>

              <div>
                {/* Mode info & Tags */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400 bg-black/40 px-2.5 py-1 rounded-lg border border-white/[0.04]">
                      <Users className="h-3.5 w-3.5 text-cyan-400" />
                      {game.players}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                    <span>Vào Game</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </Link>
        ))}
      </div>
    </section>
  );
}
