"use client";

import React, { useState, useEffect, useRef } from "react";
import { RpsMove, RpsResult, determineRpsWinner, RPS_MOVE_ICONS } from "./rps-rules";
import { RoomLobby } from "../realtime/RoomLobby";
import { LiveRoomChat, ChatMessage } from "../realtime/LiveRoomChat";
import { EmojiReactions } from "../realtime/EmojiReactions";
import { soundSynth } from "@/lib/audio/sound-synth";
import { useAuth } from "@/lib/store/auth-context";
import { dataAdapter } from "@/lib/store/data-adapter";
import { Trophy, Swords, RotateCcw, Copy, Check, ArrowLeft } from "lucide-react";
import { MagneticButton } from "@/components/motion/MagneticButton";

interface FloatingEmoji {
  id: string;
  emoji: string;
  x: number;
}

export function RpsGame() {
  const { user, addCoins } = useAuth();

  // Mode: "lobby" | "local" | "online"
  const [mode, setMode] = useState<"lobby" | "local" | "online">("lobby");
  const [roomPin, setRoomPin] = useState("");
  const [copiedPin, setCopiedPin] = useState(false);

  // Game state
  const [p1Move, setP1Move] = useState<RpsMove | null>(null);
  const [p2Move, setP2Move] = useState<RpsMove | null>(null);
  const [roundResult, setRoundResult] = useState<RpsResult | null>(null);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [turn, setTurn] = useState<"p1" | "p2">("p1"); // for local turn

  // Online Realtime
  const [isHost, setIsHost] = useState(false);
  const [opponentJoined, setOpponentJoined] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const channelRef = useRef<BroadcastChannel | null>(null);

  // Copy PIN helper
  const handleCopyPin = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(roomPin);
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2000);
    }
  };

  // Setup Realtime Broadcast channel
  useEffect(() => {
    if (mode !== "online" || !roomPin) return;

    const channelName = `neo_arcade_rps_${roomPin}`;
    const channel = new BroadcastChannel(channelName);
    channelRef.current = channel;

    channel.onmessage = (event) => {
      const data = event.data;
      if (!data) return;

      if (data.type === "JOIN") {
        setOpponentJoined(true);
        soundSynth.play("jump");
        channel.postMessage({ type: "ACK_JOIN" });
      } else if (data.type === "ACK_JOIN") {
        setOpponentJoined(true);
      } else if (data.type === "MOVE") {
        setP2Move(data.move);
      } else if (data.type === "CHAT") {
        setChatMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}`,
            sender: data.sender,
            text: data.text,
            isSelf: false,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } else if (data.type === "EMOJI") {
        triggerFloatingEmoji(data.emoji);
      } else if (data.type === "RESET") {
        resetRound();
      }
    };

    if (!isHost) {
      channel.postMessage({ type: "JOIN" });
    }

    return () => {
      channel.close();
    };
  }, [mode, roomPin, isHost]);

  // Round resolution
  useEffect(() => {
    if (p1Move && p2Move) {
      soundSynth.play("clash");
      const res = determineRpsWinner(p1Move, p2Move);
      setRoundResult(res);

      if (res === "p1") {
        setP1Score((s) => s + 1);
        soundSynth.play("win");
        if (user) {
          addCoins(2);
          dataAdapter.submitScore(user.id, user.username, "rps", p1Score + 1);
        }
      } else if (res === "p2") {
        setP2Score((s) => s + 1);
        soundSynth.play("lose");
      }
    }
  }, [p1Move, p2Move]);

  const triggerFloatingEmoji = (emoji: string) => {
    const newEmoji: FloatingEmoji = {
      id: `emoji-${Date.now()}-${Math.random()}`,
      emoji,
      x: Math.floor(Math.random() * 70) + 15,
    };
    setFloatingEmojis((prev) => [...prev, newEmoji]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((e) => e.id !== newEmoji.id));
    }, 2200);
  };

  const handleSendEmoji = (emoji: string) => {
    triggerFloatingEmoji(emoji);
    channelRef.current?.postMessage({ type: "EMOJI", emoji });
  };

  const handleSendMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: user?.username || "Tôi",
      text,
      isSelf: true,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages((prev) => [...prev, newMsg]);
    channelRef.current?.postMessage({
      type: "CHAT",
      sender: user?.username || "Đối thủ",
      text,
    });
  };

  const handleSelectMove = (move: RpsMove) => {
    soundSynth.play("click");
    if (mode === "local") {
      if (turn === "p1") {
        setP1Move(move);
        setTurn("p2");
      } else {
        setP2Move(move);
      }
    } else {
      // Online mode
      setP1Move(move);
      channelRef.current?.postMessage({ type: "MOVE", move });
    }
  };

  const resetRound = () => {
    setP1Move(null);
    setP2Move(null);
    setRoundResult(null);
    setTurn("p1");
    channelRef.current?.postMessage({ type: "RESET" });
  };

  // Start online host
  const handleCreateRoom = () => {
    const code = `RPS-${Math.floor(1000 + Math.random() * 9000)}`;
    setRoomPin(code);
    setIsHost(true);
    setOpponentJoined(false);
    setMode("online");
  };

  // Join online room
  const handleJoinRoom = (pin: string) => {
    setRoomPin(pin);
    setIsHost(false);
    setOpponentJoined(true);
    setMode("online");
  };

  if (mode === "lobby") {
    return (
      <RoomLobby
        gameTitle="Oản Tù Tì Đấu Trường"
        onSelectLocal={() => {
          setMode("local");
          setP1Score(0);
          setP2Score(0);
          resetRound();
        }}
        onCreateOnlineRoom={handleCreateRoom}
        onJoinOnlineRoom={handleJoinRoom}
      />
    );
  }

  return (
    <div className="max-w-xl mx-auto w-full space-y-4">
      {/* Floating Emoji Layer */}
      <EmojiReactions onSendEmoji={handleSendEmoji} floatingEmojis={floatingEmojis} />

      {/* Header Bar */}
      <div className="flex items-center justify-between p-3 rounded-2xl border border-white/[0.08] bg-[#121217]/90 backdrop-blur-md">
        <button
          type="button"
          onClick={() => {
            soundSynth.play("click");
            setMode("lobby");
          }}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Đổi Chế Độ
        </button>

        <div className="text-xs font-semibold text-zinc-300">
          {mode === "local" ? "🕹️ 2 Người Cùng Máy" : `🌐 Phòng: ${roomPin}`}
        </div>

        {mode === "online" && (
          <button
            type="button"
            onClick={handleCopyPin}
            className="flex items-center gap-1 text-[11px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded-lg border border-cyan-500/20"
          >
            {copiedPin ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            {copiedPin ? "Đã copy!" : "Copy PIN"}
          </button>
        )}
      </div>

      {/* Scoreboard */}
      <div className="grid grid-cols-3 items-center rounded-2xl border border-white/[0.08] bg-[#121217]/90 p-4 text-center">
        <div>
          <div className="text-xs font-bold text-cyan-400">
            {mode === "local" ? "Người Chơi 1" : user?.username || "Bạn"}
          </div>
          <div className="text-3xl font-black text-white font-mono mt-1">{p1Score}</div>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30">
            <Swords className="h-5 w-5" />
          </div>
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 mt-1 font-bold">VS</span>
        </div>

        <div>
          <div className="text-xs font-bold text-violet-400">
            {mode === "local" ? "Người Chơi 2" : opponentJoined ? "Đối Thủ" : "Đang Đợi..."}
          </div>
          <div className="text-3xl font-black text-white font-mono mt-1">{p2Score}</div>
        </div>
      </div>

      {/* Arena Center */}
      <div className="rounded-2xl border border-white/[0.12] bg-[#0c0d12] p-8 text-center relative overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.1)]">
        {roundResult ? (
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-widest text-zinc-400">Kết Quả Ván Đấu</div>
            <div className="flex items-center justify-center gap-8 my-4">
              <div className="flex flex-col items-center">
                <span className="text-5xl">{p1Move && RPS_MOVE_ICONS[p1Move].emoji}</span>
                <span className="text-xs font-semibold text-cyan-400 mt-2">{p1Move && RPS_MOVE_ICONS[p1Move].label}</span>
              </div>
              <span className="text-2xl font-black text-zinc-600">VS</span>
              <div className="flex flex-col items-center">
                <span className="text-5xl">{p2Move && RPS_MOVE_ICONS[p2Move].emoji}</span>
                <span className="text-xs font-semibold text-violet-400 mt-2">{p2Move && RPS_MOVE_ICONS[p2Move].label}</span>
              </div>
            </div>

            <div className="text-2xl font-black">
              {roundResult === "draw" ? (
                <span className="text-amber-400">HÒA NHAU!</span>
              ) : roundResult === "p1" ? (
                <span className="text-cyan-400">{mode === "local" ? "NGƯỜI CHƠI 1 THẮNG! 🎉" : "BẠN CHIẾN THẮNG! 🏆"}</span>
              ) : (
                <span className="text-violet-400">{mode === "local" ? "NGƯỜI CHƠI 2 THẮNG! 🎉" : "ĐỐI THỦ THẮNG! 💥"}</span>
              )}
            </div>

            <MagneticButton
              onClick={resetRound}
              className="mt-4 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-6 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:opacity-95"
            >
              <RotateCcw className="h-4 w-4 mr-1.5" />
              Đấu Ván Mới
            </MagneticButton>
          </div>
        ) : (
          <div>
            <div className="text-xs font-semibold text-zinc-400 mb-2">
              {mode === "local"
                ? turn === "p1"
                  ? "👉 Lượt Người Chơi 1 Chọn (P2 quay mặt đi):"
                  : "👉 Lượt Người Chơi 2 Chọn:"
                : p1Move
                ? "⏳ Đã chọn! Đang đợi đối thủ ra quyết định..."
                : "👉 Hãy chọn Kéo, Búa hoặc Bao:"}
            </div>

            {/* Move Buttons */}
            {(!p1Move || (mode === "local" && !p2Move)) && (
              <div className="flex items-center justify-center gap-4 mt-6">
                {(["rock", "paper", "scissors"] as RpsMove[]).map((move) => (
                  <MagneticButton
                    key={move}
                    type="button"
                    onClick={() => handleSelectMove(move)}
                    className="flex flex-col items-center justify-center h-24 w-24 rounded-2xl border border-white/10 bg-white/[0.04] hover:border-cyan-500/50 hover:bg-cyan-500/10 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                  >
                    <span className="text-4xl">{RPS_MOVE_ICONS[move].emoji}</span>
                    <span className="text-xs font-bold text-white mt-2">{RPS_MOVE_ICONS[move].label}</span>
                  </MagneticButton>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Online Chat */}
      {mode === "online" && (
        <LiveRoomChat messages={chatMessages} onSendMessage={handleSendMessage} />
      )}
    </div>
  );
}
