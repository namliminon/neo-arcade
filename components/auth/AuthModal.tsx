"use client";

import React, { useState } from "react";
import { SpringModal } from "@/components/motion/SpringModal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { useAuth } from "@/lib/store/auth-context";
import { LogIn, UserPlus, ShieldAlert, Sparkles, User, Lock, Mail } from "lucide-react";
import { soundSynth } from "@/lib/audio/sound-synth";

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    login,
    register,
    banModalNotice,
    dismissBanNotice,
  } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (mode === "login") {
      const res = await login(email, password);
      if (res.error) {
        setErrorMsg(res.error);
      }
    } else {
      if (!username.trim()) {
        setErrorMsg("Vui lòng nhập tên người dùng.");
        setLoading(false);
        return;
      }
      const res = await register(username, email, password);
      if (res.error) {
        setErrorMsg(res.error);
      }
    }
    setLoading(false);
  };

  const handleQuickLogin = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    login(quickEmail, quickPass);
  };

  return (
    <>
      {/* Ban Warning Dialog */}
      <SpringModal
        isOpen={Boolean(banModalNotice)}
        onClose={dismissBanNotice}
        title="Thông Báo Khóa Tài Khoản"
      >
        <div className="text-center py-2">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h4 className="text-lg font-bold text-rose-300 mb-2">Tài Khoản Đang Bị Khóa</h4>
          <p className="text-sm text-zinc-300 mb-4 bg-rose-950/30 border border-rose-900/50 p-3 rounded-xl">
            {banModalNotice}
          </p>
          <p className="text-xs text-zinc-500 mb-6">
            Mọi quyền truy cập đã bị vô hiệu hóa bởi Quản trị viên. Hãy liên hệ hỗ trợ nếu đây là sự nhầm lẫn.
          </p>
          <MagneticButton
            type="button"
            onClick={dismissBanNotice}
            className="w-full rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 font-medium transition-colors border border-white/10"
          >
            Đã hiểu
          </MagneticButton>
        </div>
      </SpringModal>

      {/* Login & Register Modal */}
      <SpringModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        title={mode === "login" ? "Đăng Nhập Neo-Arcade" : "Tạo Tài Khoản Mới"}
      >
        <div className="flex gap-2 p-1 mb-5 rounded-xl bg-black/40 border border-white/[0.08]">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMsg("");
              soundSynth.play("click");
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
              mode === "login"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <LogIn className="h-4 w-4" />
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setErrorMsg("");
              soundSynth.play("click");
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
              mode === "register"
                ? "bg-violet-500/20 text-violet-300 border border-violet-500/30 shadow-[0_0_12px_rgba(168,85,247,0.2)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <UserPlus className="h-4 w-4" />
            Đăng ký
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Tên người dùng</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ví dụ: ArcadeKing"
                  required
                  className="w-full rounded-xl border border-white/[0.08] bg-black/50 pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full rounded-xl border border-white/[0.08] bg-black/50 pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full rounded-xl border border-white/[0.08] bg-black/50 pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <MagneticButton
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:opacity-95 transition-opacity"
          >
            {loading ? "Đang xử lý..." : mode === "login" ? "Đăng Nhập" : "Tạo Tài Khoản (+100 Xu)"}
          </MagneticButton>
        </form>

        {/* 1-Click Quick Demo Buttons */}
        <div className="mt-5 border-t border-white/[0.08] pt-4">
          <p className="text-[11px] font-medium text-zinc-500 text-center mb-2 flex items-center justify-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-400" />
            Tài khoản dùng thử 1-Click:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("admin@arcade.dev", "Admin@123456")}
              className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-2 text-left hover:border-amber-500/40 transition-colors"
            >
              <div className="text-xs font-bold text-amber-300">👑 Admin Demo</div>
              <div className="text-[10px] text-zinc-400 truncate">admin@arcade.dev</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("ninja@arcade.dev", "Pass1234")}
              className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-2 text-left hover:border-cyan-500/40 transition-colors"
            >
              <div className="text-xs font-bold text-cyan-300">🎮 User Demo</div>
              <div className="text-[10px] text-zinc-400 truncate">ninja@arcade.dev</div>
            </button>
          </div>
        </div>
      </SpringModal>
    </>
  );
}
