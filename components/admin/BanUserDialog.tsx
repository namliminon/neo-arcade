"use client";

import React, { useState } from "react";
import { SpringModal } from "@/components/motion/SpringModal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { UserProfile } from "@/lib/store/data-adapter";
import { ShieldAlert, AlertTriangle } from "lucide-react";

interface BanUserDialogProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBan: (userId: string, reason: string) => Promise<void>;
}

const PRESET_REASONS = [
  "Gian lận điểm số / Hack điểm",
  "Ngôn từ độc hại / Xúc phạm người khác",
  "Tạo nhiều tài khoản ảo / Spam",
  "Vi phạm quy tắc phòng đấu đối kháng",
];

export function BanUserDialog({
  user,
  isOpen,
  onClose,
  onConfirmBan,
}: BanUserDialogProps) {
  const [selectedPreset, setSelectedPreset] = useState(PRESET_REASONS[0]);
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  const effectiveReason = customReason.trim() ? customReason.trim() : selectedPreset;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await onConfirmBan(user.id, effectiveReason);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <SpringModal
      isOpen={isOpen}
      onClose={onClose}
      title="Khóa Tài Khoản Người Dùng"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              Khóa: <span className="text-rose-300 font-mono">@{user.username}</span>
            </div>
            <div className="text-xs text-zinc-400">{user.email}</div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
            Chọn Lý Do Khóa Mẫu:
          </label>
          <div className="space-y-1.5">
            {PRESET_REASONS.map((reason) => (
              <label
                key={reason}
                onClick={() => setCustomReason("")}
                className={`flex items-center gap-2.5 rounded-lg border p-2.5 text-xs cursor-pointer transition-colors ${
                  selectedPreset === reason && !customReason
                    ? "border-rose-500/50 bg-rose-500/15 text-rose-200"
                    : "border-white/[0.08] bg-black/30 text-zinc-400 hover:bg-white/[0.04]"
                }`}
              >
                <input
                  type="radio"
                  name="ban-reason"
                  checked={selectedPreset === reason && !customReason}
                  onChange={() => {
                    setSelectedPreset(reason);
                    setCustomReason("");
                  }}
                  className="accent-rose-500"
                />
                {reason}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
            Hoặc Nhập Lý Do Riêng:
          </label>
          <textarea
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            placeholder="Ghi rõ lý do khóa để người dùng nắm được..."
            rows={2}
            className="w-full rounded-xl border border-white/[0.08] bg-black/50 p-2.5 text-xs text-white placeholder-zinc-600 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>

        <div className="flex items-center gap-2 text-[11px] text-amber-400/90 bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>Người dùng này sẽ bị đăng xuất tức thì và bị từ chối mọi yêu cầu đăng nhập.</span>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/[0.1] bg-zinc-800/80 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            Hủy Bỏ
          </button>
          <MagneticButton
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 py-2.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(225,29,72,0.4)] hover:brightness-110 transition-all"
          >
            {isSubmitting ? "Đang khóa..." : "Xác Nhận Khóa"}
          </MagneticButton>
        </div>
      </div>
    </SpringModal>
  );
}
