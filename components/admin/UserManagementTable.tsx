"use client";

import React, { useState } from "react";
import { UserProfile } from "@/lib/store/data-adapter";
import { BanUserDialog } from "./BanUserDialog";
import { Search, Shield, ShieldAlert, CheckCircle, Lock, Unlock } from "lucide-react";
import { soundSynth } from "@/lib/audio/sound-synth";

interface UserManagementTableProps {
  users: UserProfile[];
  currentUserId: string;
  onBanUser: (userId: string, reason: string) => Promise<void>;
  onUnbanUser: (userId: string) => Promise<void>;
}

export function UserManagementTable({
  users,
  currentUserId,
  onBanUser,
  onUnbanUser,
}: UserManagementTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [targetUserToBan, setTargetUserToBan] = useState<UserProfile | null>(null);

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#121217]/90 backdrop-blur-md overflow-hidden">
      {/* Search Header */}
      <div className="p-4 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white">Danh Sách Tài Khoản</h3>
          <p className="text-xs text-zinc-400">Xem thông tin và quản lý quyền truy cập người dùng</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên hoặc email..."
            className="w-full rounded-xl border border-white/[0.08] bg-black/40 pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-white/[0.06] bg-white/[0.02] text-zinc-400 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4">Người Dùng</th>
              <th className="py-3 px-4">Vai Trò</th>
              <th className="py-3 px-4">Xu & Cấp Độ</th>
              <th className="py-3 px-4">Trạng Thái</th>
              <th className="py-3 px-4">Lý Do Khóa (Nếu Có)</th>
              <th className="py-3 px-4 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filteredUsers.map((user) => {
              const isSelf = user.id === currentUserId;
              return (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  {/* User info */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
                        alt={user.username}
                        className="h-8 w-8 rounded-full border border-white/10 bg-zinc-800 object-cover"
                      />
                      <div>
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          {user.username}
                          {isSelf && (
                            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded font-normal">
                              Bạn
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3 px-4">
                    {user.role === "admin" ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[11px] font-bold text-amber-300">
                        <Shield className="h-3 w-3" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-300">
                        User
                      </span>
                    )}
                  </td>

                  {/* Coins & Level */}
                  <td className="py-3 px-4">
                    <div className="font-medium text-amber-300">{user.coins} 🪙</div>
                    <div className="text-[11px] text-zinc-400">Lv.{user.level || 1}</div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    {user.is_banned ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-[11px] font-bold text-rose-300">
                        <ShieldAlert className="h-3 w-3" />
                        Đã Khóa
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
                        <CheckCircle className="h-3 w-3" />
                        Hoạt Động
                      </span>
                    )}
                  </td>

                  {/* Ban Reason */}
                  <td className="py-3 px-4 max-w-[200px] truncate text-zinc-400">
                    {user.is_banned ? (
                      <span className="text-rose-300/90 italic" title={user.ban_reason}>
                        {user.ban_reason || "Chưa ghi lý do"}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    {isSelf ? (
                      <span className="text-[11px] text-zinc-500 italic">Không thể tự khóa</span>
                    ) : user.is_banned ? (
                      <button
                        type="button"
                        onClick={() => {
                          soundSynth.play("click");
                          onUnbanUser(user.id);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all"
                      >
                        <Unlock className="h-3.5 w-3.5" />
                        Mở Khóa
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          soundSynth.play("click");
                          setTargetUserToBan(user);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-500/40 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-all"
                      >
                        <Lock className="h-3.5 w-3.5" />
                        Khóa TK
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <BanUserDialog
        user={targetUserToBan}
        isOpen={Boolean(targetUserToBan)}
        onClose={() => setTargetUserToBan(null)}
        onConfirmBan={onBanUser}
      />
    </div>
  );
}
