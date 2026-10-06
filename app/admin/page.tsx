"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/store/auth-context";
import { dataAdapter, UserProfile } from "@/lib/store/data-adapter";
import { AdminStatCards } from "@/components/admin/AdminStatCards";
import { UserManagementTable } from "@/components/admin/UserManagementTable";
import { AuthModal } from "@/components/auth/AuthModal";
import { Shield, ShieldAlert, ArrowLeft, RefreshCw, Sparkles } from "lucide-react";
import Link from "next/link";
import { soundSynth } from "@/lib/audio/sound-synth";

export default function AdminPage() {
  const { user, role, openAuthModal } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    const list = await dataAdapter.getAllUsers();
    setUsers(list);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleBanUser = async (userId: string, reason: string) => {
    await dataAdapter.setUserBanStatus(userId, true, reason);
    soundSynth.play("clash");
    await loadUsers();
  };

  const handleUnbanUser = async (userId: string) => {
    await dataAdapter.setUserBanStatus(userId, false);
    soundSynth.play("coin");
    await loadUsers();
  };

  // RBAC Access Guard
  if (role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AuthModal />
        <div className="max-w-md w-full rounded-2xl border border-rose-500/30 bg-[#121217] p-8 text-center shadow-[0_0_50px_rgba(225,29,72,0.15)]">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="h-9 w-9" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Quyền Truy Cập Bị Từ Chối</h2>
          <p className="text-sm text-zinc-400 mb-6">
            Khu vực này chỉ dành riêng cho tài khoản Quản trị viên (Admin). Bạn cần đăng nhập bằng tài khoản có quyền Admin để tiếp tục.
          </p>
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 text-sm font-bold text-black hover:opacity-90 transition-opacity"
            >
              <Sparkles className="h-4 w-4" />
              Đăng Nhập Tài Khoản Admin Demo
            </button>
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-zinc-800 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay Về Trang Chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <AuthModal />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#09090b]/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Về Arcade
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Shield className="h-4 w-4" />
            </div>
            <h1 className="text-base font-black tracking-wide text-white">Bảng Quản Trị Hệ Thống</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadUsers}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-800/80 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </button>
          <div className="text-xs font-semibold text-amber-300 font-mono">
            Admin: @{user?.username}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-white tracking-tight">Trung Tâm Điều Hành & Kiểm Duyệt</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Quản lý tài khoản, theo dõi số liệu và xử lý khóa vi phạm theo thời gian thực.
          </p>
        </div>

        <AdminStatCards users={users} />

        <UserManagementTable
          users={users}
          currentUserId={user?.id || ""}
          onBanUser={handleBanUser}
          onUnbanUser={handleUnbanUser}
        />
      </main>
    </div>
  );
}
