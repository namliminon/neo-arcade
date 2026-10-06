"use client";

import React, { useState } from "react";
import { Copy, Check, Users, Globe, KeyRound, Play } from "lucide-react";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { soundSynth } from "@/lib/audio/sound-synth";

interface RoomLobbyProps {
  gameTitle: string;
  onSelectLocal: () => void;
  onCreateOnlineRoom: () => void;
  onJoinOnlineRoom: (pin: string) => void;
}

export function RoomLobby({
  gameTitle,
  onSelectLocal,
  onCreateOnlineRoom,
  onJoinOnlineRoom,
}: RoomLobbyProps) {
  const [pinInput, setPinInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim().length < 4) {
      setErrorMsg("Vui lòng nhập mã phòng hợp lệ.");
      return;
    }
    setErrorMsg("");
    soundSynth.play("click");
    onJoinOnlineRoom(pinInput.trim().toUpperCase());
  };

  return (
    <div className="max-w-lg mx-auto w-full space-y-4">
      {/* Local Pass & Play Option */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#121217]/90 p-5 backdrop-blur-md transition-all hover:border-violet-500/40">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400 border border-violet-500/30">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Chế Độ Chơi Chung 1 Máy (Offline Local)</h3>
            <p className="text-xs text-zinc-400">2 người chơi thay phiên trên cùng điện thoại hoặc bàn phím PC</p>
          </div>
        </div>
        <MagneticButton
          type="button"
          onClick={() => {
            soundSynth.play("click");
            onSelectLocal();
          }}
          className="w-full mt-3 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 py-2.5 text-xs font-bold text-violet-300 transition-colors"
        >
          <Play className="h-3.5 w-3.5 mr-1.5 fill-current" />
          Bắt Đầu Chơi Trên Cùng 1 Máy
        </MagneticButton>
      </div>

      {/* Online Realtime Matchmaking Option */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#121217]/90 p-5 backdrop-blur-md transition-all hover:border-cyan-500/40">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Chế Độ Đấu Online Realtime (Qua Mã PIN)</h3>
            <p className="text-xs text-zinc-400">Tạo phòng và gửi mã PIN cho bạn bè ở bất kỳ quốc gia nào</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {/* Create Room */}
          <button
            type="button"
            onClick={() => {
              soundSynth.play("jump");
              onCreateOnlineRoom();
            }}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 active:scale-95 transition-all text-center"
          >
            <span className="text-xs font-black text-cyan-300">✨ Tạo Phòng Mới</span>
            <span className="text-[10px] text-zinc-400 mt-1">Lấy mã PIN gửi bạn bè</span>
          </button>

          {/* Join Room */}
          <form onSubmit={handleJoin} className="flex flex-col gap-2">
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.toUpperCase())}
                placeholder="Nhập mã PIN phòng..."
                maxLength={8}
                className="w-full rounded-xl border border-white/[0.08] bg-black/50 pl-8 pr-2 py-2 text-xs font-mono font-bold text-white uppercase placeholder-zinc-600 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            {errorMsg && <div className="text-[10px] text-rose-400">{errorMsg}</div>}
            <button
              type="submit"
              className="rounded-xl border border-white/10 bg-zinc-800 hover:bg-zinc-700 py-1.5 text-xs font-semibold text-white transition-colors"
            >
              Vào Phòng
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
