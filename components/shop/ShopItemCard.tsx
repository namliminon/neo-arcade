"use client";

import React from "react";
import { Sparkles, Check, ShoppingBag } from "lucide-react";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { soundSynth } from "@/lib/audio/sound-synth";

export interface ShopItem {
  id: string;
  name: string;
  category: "snake" | "flappy" | "avatar";
  price: number;
  preview: string;
  description: string;
  color: string;
}

interface ShopItemCardProps {
  item: ShopItem;
  isOwned: boolean;
  canAfford: boolean;
  onBuy: (item: ShopItem) => void;
}

export function ShopItemCard({ item, isOwned, canAfford, onBuy }: ShopItemCardProps) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#121217]/90 p-5 backdrop-blur-md flex flex-col justify-between transition-all hover:border-cyan-500/30">
      <div>
        {/* Item Preview Icon/Box */}
        <div
          className="h-28 w-full rounded-xl flex items-center justify-center text-4xl mb-4 border border-white/10 shadow-inner"
          style={{ backgroundColor: `${item.color}15` }}
        >
          <span className="filter drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
            {item.preview}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-white/[0.04] text-zinc-400">
            {item.category}
          </span>
        </div>

        <p className="text-xs text-zinc-400 mb-4">{item.description}</p>
      </div>

      <div>
        {isOwned ? (
          <div className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 py-2.5 text-xs font-bold text-emerald-300">
            <Check className="h-4 w-4" />
            Đã Sở Hữu
          </div>
        ) : (
          <MagneticButton
            type="button"
            disabled={!canAfford}
            onClick={() => {
              soundSynth.play("coin");
              onBuy(item);
            }}
            className={`w-full rounded-xl py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              canAfford
                ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:opacity-95"
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Mua với {item.price} 🪙
          </MagneticButton>
        )}
      </div>
    </div>
  );
}
