"use client";

import React from "react";
import { Users, UserCheck, ShieldBan, Trophy } from "lucide-react";
import { UserProfile } from "@/lib/store/data-adapter";

interface AdminStatCardsProps {
  users: UserProfile[];
}

export function AdminStatCards({ users }: AdminStatCardsProps) {
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => !u.is_banned).length;
  const bannedUsers = users.filter((u) => u.is_banned).length;
  const totalCoins = users.reduce((acc, u) => acc + (u.coins || 0), 0);

  const stats = [
    {
      label: "Tổng Người Dùng",
      value: totalUsers,
      icon: Users,
      color: "text-cyan-400",
      border: "border-cyan-500/30",
      bg: "bg-cyan-500/10",
    },
    {
      label: "Đang Hoạt Động",
      value: activeUsers,
      icon: UserCheck,
      color: "text-emerald-400",
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Tài Khoản Bị Khóa",
      value: bannedUsers,
      icon: ShieldBan,
      color: "text-rose-400",
      border: "border-rose-500/30",
      bg: "bg-rose-500/10",
    },
    {
      label: "Tổng Xu Lưu Thông",
      value: totalCoins.toLocaleString(),
      icon: Trophy,
      color: "text-amber-400",
      border: "border-amber-500/30",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`rounded-2xl border ${stat.border} ${stat.bg} p-4 backdrop-blur-md transition-all hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-zinc-400">{stat.label}</span>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div className={`text-2xl font-black tracking-tight ${stat.color}`}>
              {stat.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
