"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Target, Award, Sparkles } from "lucide-react";
import { QuestCard, QuestItem } from "@/components/quests/QuestCard";
import { useAuth } from "@/lib/store/auth-context";
import { AuthModal } from "@/components/auth/AuthModal";

const INITIAL_QUESTS: QuestItem[] = [
  {
    id: "q-1",
    title: "🐍 Thợ Săn Mồi Điêu Luyện",
    description: "Ăn ít nhất 15 quả táo trong game Rắn Săn Mồi",
    rewardCoins: 20,
    rewardExp: 50,
    isCompleted: true,
    isClaimed: false,
    progress: 15,
    target: 15,
  },
  {
    id: "q-2",
    title: "🐥 Đôi Cánh Thép",
    description: "Bay vượt qua 10 cột laser trong Cyber Flappy Bird",
    rewardCoins: 25,
    rewardExp: 60,
    isCompleted: false,
    isClaimed: false,
    progress: 6,
    target: 10,
  },
  {
    id: "q-3",
    title: "✌️ Chiến Tướng Oản Tù Tì",
    description: "Chiến thắng 2 ván đấu Oản Tù Tì với đối thủ",
    rewardCoins: 30,
    rewardExp: 75,
    isCompleted: true,
    isClaimed: false,
    progress: 2,
    target: 2,
  },
  {
    id: "q-4",
    title: "❌ Bậc Thầy Cờ Ca-rô",
    description: "Nối 3 ô chiến thắng trong Cờ Ca-rô Neon",
    rewardCoins: 35,
    rewardExp: 80,
    isCompleted: false,
    isClaimed: false,
    progress: 0,
    target: 1,
  },
  {
    id: "q-5",
    title: "⭐ Điểm Danh Mỗi Ngày",
    description: "Đăng nhập vào sảnh game Neo-Arcade hôm nay",
    rewardCoins: 10,
    rewardExp: 25,
    isCompleted: true,
    isClaimed: true,
    progress: 1,
    target: 1,
  },
];

const BADGES = [
  { name: "Tân Binh Arcade", icon: "🎮", desc: "Tham gia nền tảng Neo-Arcade", unlocked: true },
  { name: "Thần Tốc Neon", icon: "⚡", desc: "Đạt 1,000 điểm trong Rắn Săn Mồi", unlocked: true },
  { name: "Vua Không Trọng Lực", icon: "👑", desc: "Vượt 50 ống trong Flappy Bird", unlocked: false },
  { name: "Bất Bại Đối Kháng", icon: "🔥", desc: "Thắng 10 trận 2 người online", unlocked: false },
];

export default function QuestsPage() {
  const { user, addCoins, level } = useAuth();
  const [quests, setQuests] = useState<QuestItem[]>(INITIAL_QUESTS);

  const handleClaim = (questId: string) => {
    const q = quests.find((item) => item.id === questId);
    if (!q) return;

    addCoins(q.rewardCoins);
    setQuests((prev) =>
      prev.map((item) => (item.id === questId ? { ...item, isClaimed: true } : item))
    );
  };

  return (
    <div className="min-h-screen pb-20 pt-8 px-4">
      <AuthModal />

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Về Sảnh Game
        </Link>

        <div className="flex items-center gap-2">
          <div className="text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Cấp độ: Lv.{level || 1}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-semibold mb-3">
          <Target className="h-3.5 w-3.5" />
          Nhiệm Vụ Hàng Ngày & Huy Hiệu
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Hệ Thống Thử Thách & Cày Cấp
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-md mx-auto">
          Hoàn thành các thử thách mỗi ngày để tích lũy xu mua sắm và thăng cấp huy hiệu danh giá.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Daily Quests Grid */}
        <div>
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Target className="h-4 w-4 text-cyan-400" />
            Nhiệm Vụ Hôm Nay
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quests.map((q) => (
              <QuestCard key={q.id} quest={q} onClaim={handleClaim} />
            ))}
          </div>
        </div>

        {/* Badges Showcase */}
        <div>
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-400" />
            Huy Hiệu Thành Tựu
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BADGES.map((b) => (
              <div
                key={b.name}
                className={`rounded-2xl border p-4 text-center backdrop-blur-md transition-all ${
                  b.unlocked
                    ? "border-amber-500/30 bg-amber-500/10 text-white"
                    : "border-white/[0.06] bg-black/30 text-zinc-600 grayscale opacity-60"
                }`}
              >
                <div className="text-3xl mb-2">{b.icon}</div>
                <div className="text-xs font-bold truncate">{b.name}</div>
                <div className="text-[10px] text-zinc-400 mt-1 line-clamp-2">{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
