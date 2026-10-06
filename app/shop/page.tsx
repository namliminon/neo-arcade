"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Sparkles } from "lucide-react";
import { ShopItemCard, ShopItem } from "@/components/shop/ShopItemCard";
import { AnimatedTabs } from "@/components/motion/AnimatedTabs";
import { useAuth } from "@/lib/store/auth-context";
import { dataAdapter } from "@/lib/store/data-adapter";
import { AuthModal } from "@/components/auth/AuthModal";

const SHOP_ITEMS: ShopItem[] = [
  {
    id: "skin-snake-emerald",
    name: "Lục Bảo Neon",
    category: "snake",
    price: 40,
    preview: "🟩🐍",
    description: "Thân rắn xanh ngọc lục bảo phát sáng rực rỡ trong bóng tối.",
    color: "#10b981",
  },
  {
    id: "skin-snake-violet",
    name: "Cyber Violet",
    category: "snake",
    price: 60,
    preview: "🟪🐍",
    description: "Vệt ánh sáng tím huyền ảo phong cách cyberpunk synthwave.",
    color: "#a855f7",
  },
  {
    id: "skin-snake-gold",
    name: "Hoàng Kim Đế Vương",
    category: "snake",
    price: 100,
    preview: "👑🐍",
    description: "Toàn thân nạm vàng óng ánh và hiệu ứng hào quang lấp lánh.",
    color: "#f59e0b",
  },
  {
    id: "skin-flappy-lightning",
    name: "Chim Sấm Sét",
    category: "flappy",
    price: 50,
    preview: "⚡🦅",
    description: "Tia sét neon bao quanh thân chim mỗi lần vỗ cánh bay.",
    color: "#06b6d4",
  },
  {
    id: "skin-flappy-phoenix",
    name: "Phượng Hoàng Lửa",
    category: "flappy",
    price: 90,
    preview: "🔥🐦",
    description: "Đôi cánh rực lửa thần thoại thắp sáng bầu trời đêm arcade.",
    color: "#ef4444",
  },
  {
    id: "avatar-frame-cyber",
    name: "Khung Neon Cyber",
    category: "avatar",
    price: 75,
    preview: "💠🖼️",
    description: "Khung viền avatar hiệu ứng border beam xoay tròn liên tục.",
    color: "#06b6d4",
  },
];

const CATEGORY_TABS = [
  { id: "all", label: "Tất Cả Vật Phẩm" },
  { id: "snake", label: "Skin Rắn" },
  { id: "flappy", label: "Skin Chim" },
  { id: "avatar", label: "Khung Avatar" },
];

export function ShopPage() {
  const { user, coins, refreshUser, openAuthModal } = useAuth();
  const [selectedCat, setSelectedCat] = useState("all");
  const [ownedItemIds, setOwnedItemIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchInventory = async () => {
      if (user) {
        const inv = await dataAdapter.getUserInventory(user.id);
        setOwnedItemIds(inv.map((i) => i.item_id));
      } else {
        setOwnedItemIds([]);
      }
    };
    fetchInventory();
  }, [user]);

  const handleBuy = async (item: ShopItem) => {
    if (!user) {
      openAuthModal("login");
      return;
    }

    const res = await dataAdapter.buyShopItem(user.id, item.id, item.price);
    if (res.success) {
      setOwnedItemIds((prev) => [...prev, item.id]);
      refreshUser();
    }
  };

  const filteredItems = SHOP_ITEMS.filter((item) =>
    selectedCat === "all" ? true : item.category === selectedCat
  );

  return (
    <div className="min-h-screen pb-20 pt-8 px-4">
      <AuthModal />

      {/* Header */}
      <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Về Sảnh Game
        </Link>

        <div className="flex items-center gap-2">
          <div className="text-xs font-black text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-400" />
            Số dư: <span className="font-mono text-sm">{coins}</span> 🪙
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold mb-3">
          <ShoppingBag className="h-3.5 w-3.5" />
          Cửa Hàng Skin & Vật Phẩm Độc Quyền
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Shop Đổi Thưởng Neo-Arcade
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-md mx-auto">
          Dùng xu kiếm được từ các chiến thắng trong game để trang hoàng giao diện chơi độc nhất vô nhị.
        </p>

        {/* Categories */}
        <div className="flex justify-center mt-6">
          <AnimatedTabs
            tabs={CATEGORY_TABS}
            activeTab={selectedCat}
            onChange={setSelectedCat}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <ShopItemCard
            key={item.id}
            item={item}
            isOwned={ownedItemIds.includes(item.id)}
            canAfford={coins >= item.price}
            onBuy={handleBuy}
          />
        ))}
      </div>
    </div>
  );
}

export default ShopPage;
