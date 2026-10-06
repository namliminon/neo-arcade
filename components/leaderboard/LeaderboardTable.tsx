"use client";

import React, { useState, useEffect } from "react";
import { dataAdapter, ScoreRecord } from "@/lib/store/data-adapter";
import { AnimatedTabs } from "@/components/motion/AnimatedTabs";
import { BorderBeam } from "@/components/motion/BorderBeam";
import { Trophy, Medal, Crown, Flame, Gamepad2, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/store/auth-context";

const GAME_TABS = [
  { id: "all", label: "Tất Cả Game" },
  { id: "snake", label: "🐍 Rắn Săn Mồi" },
  { id: "flappy", label: "🐥 Flappy Bird" },
  { id: "rps", label: "✌️ Oản Tù Tì" },
  { id: "tictactoe", label: "❌ Cờ Ca-rô" },
];

export function LeaderboardTable({ initialGame = "all" }: { initialGame?: string }) {
  const { user, openAuthModal } = useAuth();
  const [selectedGame, setSelectedGame] = useState(initialGame);
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      setLoading(false);
      const gameType = selectedGame === "all" ? undefined : (selectedGame as "snake" | "flappy" | "rps" | "tictactoe");
      const list = await dataAdapter.getLeaderboard(gameType);
      setScores(list);
    };
    fetchScores();
  }, [selectedGame]);

  const top3 = scores.slice(0, 3);
  const rest = scores.slice(3);

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex justify-center">
        <AnimatedTabs
          tabs={GAME_TABS}
          activeTab={selectedGame}
          onChange={setSelectedGame}
        />
      </div>

      {/* Auth Rule Notice Banner */}
      <div className="max-w-3xl mx-auto w-full">
        {user ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl border border-emerald-500/25 bg-emerald-950/20 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="text-xs text-zinc-300">
                Bạn đang chơi với nickname:{" "}
                <span className="font-bold text-emerald-400">@{user.nickname || user.username}</span>.
                Mọi kỷ lục đạt được sẽ tự động vinh danh bạn trên Bảng Xếp Hạng!
              </div>
            </div>
            <div className="text-[11px] font-mono text-emerald-400/80 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 whitespace-nowrap">
              Đã xác thực ✓
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl border border-amber-500/25 bg-amber-950/20 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Lock className="h-4 w-4" />
              </div>
              <div className="text-xs text-zinc-300">
                <span className="font-bold text-amber-300">Cơ chế ghi danh:</span> Chỉ người chơi đã đăng nhập tài khoản mới được lưu điểm lên Bảng Xếp Hạng.
              </div>
            </div>
            <button
              type="button"
              onClick={() => openAuthModal("register")}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 px-3.5 py-1.5 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:opacity-95 transition-all whitespace-nowrap cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 fill-black" />
              Đăng Ký Nickname Để Leo Top
            </button>
          </div>
        )}
      </div>

      {/* Top 3 Podium */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto items-end">
          {/* Rank 2 (Silver) */}
          {top3[1] && (
            <div className="relative rounded-2xl border border-zinc-400/30 bg-zinc-900/80 p-5 text-center backdrop-blur-md order-2 md:order-1 h-56 flex flex-col justify-between shadow-[0_0_30px_rgba(161,161,170,0.15)]">
              <div>
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-400/20 text-zinc-300 font-bold border border-zinc-400/30">
                  #2
                </div>
                <div className="font-bold text-white text-base truncate">@{top3[1].username}</div>
                <div className="text-[11px] text-zinc-400 uppercase tracking-wider">{top3[1].game_type}</div>
              </div>
              <div className="text-2xl font-black text-zinc-200 font-mono">
                {top3[1].score.toLocaleString()} <span className="text-xs text-zinc-400">pts</span>
              </div>
            </div>
          )}

          {/* Rank 1 (Gold Champion) */}
          {top3[0] && (
            <div className="relative rounded-2xl border border-amber-500/50 bg-amber-950/20 p-6 text-center backdrop-blur-md order-1 md:order-2 h-64 flex flex-col justify-between shadow-[0_0_40px_rgba(245,158,11,0.25)]">
              <BorderBeam size={180} duration={6} colorFrom="#f59e0b" colorTo="#fbbf24" />
              <div>
                <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <Crown className="h-6 w-6" />
                </div>
                <div className="text-xs font-bold text-amber-400 tracking-widest uppercase">Quán Quân</div>
                <div className="font-black text-white text-lg truncate mt-0.5">@{top3[0].username}</div>
                <div className="text-[11px] text-zinc-400 uppercase tracking-wider">{top3[0].game_type}</div>
              </div>
              <div className="text-3xl font-black text-amber-300 font-mono">
                {top3[0].score.toLocaleString()} <span className="text-xs text-amber-400">pts</span>
              </div>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {top3[2] && (
            <div className="relative rounded-2xl border border-amber-800/40 bg-zinc-900/80 p-5 text-center backdrop-blur-md order-3 h-52 flex flex-col justify-between shadow-[0_0_30px_rgba(217,119,6,0.15)]">
              <div>
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-amber-700/20 text-amber-600 font-bold border border-amber-700/30">
                  #3
                </div>
                <div className="font-bold text-white text-base truncate">@{top3[2].username}</div>
                <div className="text-[11px] text-zinc-400 uppercase tracking-wider">{top3[2].game_type}</div>
              </div>
              <div className="text-2xl font-black text-amber-500/90 font-mono">
                {top3[2].score.toLocaleString()} <span className="text-xs text-zinc-400">pts</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Rest of the Table */}
      <div className="max-w-3xl mx-auto rounded-2xl border border-white/[0.08] bg-[#121217]/90 backdrop-blur-md overflow-hidden">
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Bảng Xếp Hạng Chi Tiết</h3>
          </div>
          <span className="text-xs text-zinc-400">{scores.length} kỷ lục được ghi nhận</span>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {scores.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              Chưa có kỷ lục nào. Hãy là người đầu tiên chơi và phá đảo!
            </div>
          ) : (
            scores.map((rec, idx) => (
              <div
                key={rec.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`font-mono text-xs font-bold w-6 text-center ${
                      idx === 0
                        ? "text-amber-400"
                        : idx === 1
                        ? "text-zinc-300"
                        : idx === 2
                        ? "text-amber-600"
                        : "text-zinc-500"
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-white">@{rec.username}</div>
                    <div className="text-[10px] text-zinc-500 uppercase">{rec.game_type}</div>
                  </div>
                </div>

                <div className="text-sm font-black font-mono text-cyan-300">
                  {rec.score.toLocaleString()} <span className="text-[10px] text-zinc-500 font-normal">pts</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
