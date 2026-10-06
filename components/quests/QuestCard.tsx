"use client";

import React from "react";
import { CheckCircle2, Sparkles, Trophy } from "lucide-react";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { soundSynth } from "@/lib/audio/sound-synth";

export interface QuestItem {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  rewardExp: number;
  isCompleted: boolean;
  isClaimed: boolean;
  progress: number;
  target: number;
}

interface QuestCardProps {
  quest: QuestItem;
  onClaim: (questId: string) => void;
}

export function QuestCard({ quest, onClaim }: QuestCardProps) {
  const percent = Math.min(100, Math.floor((quest.progress / quest.target) * 100));

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#121217]/90 p-4 backdrop-blur-md flex flex-col justify-between transition-all hover:border-cyan-500/30">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h4 className="text-sm font-bold text-white">{quest.title}</h4>
            <p className="text-xs text-zinc-400 mt-0.5">{quest.description}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-lg text-amber-300 font-bold text-xs">
            <Sparkles className="h-3 w-3" />
            +{quest.rewardCoins} Xu
          </div>
        </div>

        {/* Progress bar */}
        <div className="my-3">
          <div className="flex justify-between text-[11px] text-zinc-500 mb-1">
            <span>Tiến độ</span>
            <span className="font-mono">{quest.progress}/{quest.target}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-black/40 overflow-hidden border border-white/[0.06]">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      <div>
        {quest.isClaimed ? (
          <div className="flex items-center justify-center gap-1.5 rounded-xl bg-zinc-800/60 py-2 text-xs font-semibold text-zinc-500 border border-white/5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Đã Nhận Thưởng
          </div>
        ) : quest.isCompleted ? (
          <MagneticButton
            onClick={() => {
              soundSynth.play("coin");
              onClaim(quest.id);
            }}
            className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-2 text-xs font-bold text-black shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:opacity-95"
          >
            🎁 Nhận Ngay +{quest.rewardCoins} Xu
          </MagneticButton>
        ) : (
          <div className="flex items-center justify-center py-2 text-xs font-medium text-zinc-500 border border-dashed border-white/10 rounded-xl">
            Chưa Hoàn Thành
          </div>
        )}
      </div>
    </div>
  );
}
