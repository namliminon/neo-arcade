"use client";

import React, { useState, useEffect, useRef } from "react";
import { RpsMove, RpsResult, determineRpsWinner, RPS_MOVE_ICONS } from "./rps-rules";
import { RoomLobby } from "../realtime/RoomLobby";
import { LiveRoomChat, ChatMessage } from "../realtime/LiveRoomChat";
import { EmojiReactions } from "../realtime/EmojiReactions";
import { soundSynth } from "@/lib/audio/sound-synth";
import { useAuth } from "@/lib/store/auth-context";
import { dataAdapter } from "@/lib/store/data-adapter";
import { Trophy, Swords, RotateCcw, Copy, Check, ArrowLeft, Radio } from "lucide-react";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { createRoomChannel, RoomChannelHandler } from "@/lib/realtime/room-channel";

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
  const [opponentName, setOpponentName] = useState<string>("Đang đợi...");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const channelRef = useRef<RoomChannelHandler | null>(null);

  // Copy PIN helper
  const handleCopyPin = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(roomPin);
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2000);
    }
  };

  // Setup Realtime Cloud / Broadcast channel
  useEffect(() => {
    if (mode !== "online" || !roomPin) return;

    const channel = createRoomChannel(`rps_${roomPin}`);
    channelRef.current = channel;

    const myName = user?.nickname || user?.username || (isHost ? "Chủ phòng" : "Khách");

    channel.on("JOIN", (payload: any) => {
      setOpponentJoined(true);
      if (payload?.username) setOpponentName(payload.username);
      soundSynth.play("jump");
      channel.send("ACK_JOIN", { username: myName });
    });

    channel.on("ACK_JOIN", (payload: any) => {
      setOpponentJoined(true);
      if (payload?.username) setOpponentName(payload.username);
    });

    channel.on("MOVE", (payload: any) => {
      if (!payload) return;
      if (payload.role === "host") {
        setP1Move(payload.move);
      } else if (payload.role === "guest") {
        setP2Move(payload.move);
      }
    });

    channel.on("CHAT", (payload: any) => {
      if (!payload) return;
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-${Math.random()}`,
          sender: payload.sender || "Đối thủ",
          text: payload.text,
          isSelf: false,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    });

    channel.on("EMOJI", (payload: any) => {
      if (payload?.emoji) {
        triggerFloatingEmoji(payload.emoji);
      }
    });

    channel.on("RESET", () => {
      setP1Move(null);
      setP2Move(null);
      setRoundResult(null);
      setTurn("p1");
    });

    // If joining as guest, periodically broadcast JOIN until acknowledged
    let retryInterval: NodeJS.Timeout | null = null;
    if (!isHost) {
      let attempts = 0;
      retryInterval = setInterval(() => {
        attempts++;
        channel.send("JOIN", { username: myName });
        if (attempts > 12) {
          if (retryInterval) clearInterval(retryInterval);
        }
      }, 1200);
      channel.send("JOIN", { username: myName });
    }

    return () => {
      if (retryInterval) clearInterval(retryInterval);
      channel.close();
    };
  }, [mode, roomPin, isHost, user]);

  // Round resolution
  useEffect(() => {
    if (p1Move && p2Move) {
      soundSynth.play("clash");
      const res = determineRpsWinner(p1Move, p2Move);
      setRoundResult(res);

      if (res === "p1") {
        setP1Score((s) => s + 1);
        if (mode === "local" || isHost) {
          soundSynth.play("win");
          if (user) {
            addCoins(2);
            dataAdapter.submitScore(user.id, user.nickname || user.username, "rps", p1Score + 1);
          }
        } else {
          soundSynth.play("lose");
        }
      } else if (res === "p2") {
        setP2Score((s) => s + 1);
        if (mode === "local" || !isHost) {
          soundSynth.play("win");
          if (user) {
            addCoins(2);
            dataAdapter.submitScore(user.id, user.nickname || user.username, "rps", p2Score + 1);
          }
        } else {
          soundSynth.play("lose");
        }
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
    channelRef.current?.send("EMOJI", { emoji });
  };

  const handleSendMessage = (text: string) => {
    const sender = user?.nickname || user?.username || (isHost ? "Chủ phòng" : "Khách");
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: `${sender} (Tôi)`,
      text,
      isSelf: true,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages((prev) => [...prev, newMsg]);
    channelRef.current?.send("CHAT", {
      sender,
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
      if (isHost) {
        setP1Move(move);
        channelRef.current?.send("MOVE", { role: "host", move });
      } else {
        setP2Move(move);
        channelRef.current?.send("MOVE", { role: "guest", move });
      }
    }
  };

  const resetRound = () => {
    setP1Move(null);
    setP2Move(null);
    setRoundResult(null);
    setTurn("p1");
    if (mode === "online") {
      channelRef.current?.send("RESET", {});
    }
  };

  // Start online host
  const handleCreateRoom = () => {
    const code = `RPS-${Math.floor(1000 + Math.random() * 9000)}`;
    setRoomPin(code);
    setIsHost(true);
    setOpponentJoined(false);
    setOpponentName("Đang đợi người vào...");
    setP1Score(0);
    setP2Score(0);
    resetRound();
    setMode("online");
  };

  // Join online room
  const handleJoinRoom = (pin: string) => {
    setRoomPin(pin);
    setIsHost(false);
    setOpponentJoined(false);
    setOpponentName("Đang kết nối chủ phòng...");
    setP1Score(0);
    setP2Score(0);
    resetRound();
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

  // Determine what moves are selected for display
  const myCurrentMove = mode === "local" ? null : isHost ? p1Move : p2Move;
  const oppCurrentMove = mode === "local" ? null : isHost ? p2Move : p1Move;
  const myPlayerLabel = isHost
    ? user?.nickname || user?.username || "Chủ Phòng (P1)"
    : user?.nickname || user?.username || "Bạn (P2)";

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

        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
          {mode === "local" ? (
            "🕹️ 2 Người Cùng Máy"
          ) : (
            <div className="flex items-center gap-1.5">
              <Radio className={`h-3 w-3 ${opponentJoined ? "text-emerald-400 animate-pulse" : "text-amber-400"}`} />
              <span>Phòng: <span className="font-mono text-cyan-300 font-bold">{roomPin}</span></span>
            </div>
          )}
        </div>

        {mode === "online" && (
          <button
            type="button"
            onClick={handleCopyPin}
            className="flex items-center gap-1 text-[11px] font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
          >
            {copiedPin ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            {copiedPin ? "Đã copy!" : "Copy PIN"}
          </button>
        )}
      </div>

      {/* Scoreboard */}
      <div className="grid grid-cols-3 items-center rounded-2xl border border-white/[0.08] bg-[#121217]/90 p-4 text-center">
        <div>
          <div className="text-xs font-bold text-cyan-400 truncate px-1">
            {mode === "local" ? "Người Chơi 1" : isHost ? myPlayerLabel : opponentName}
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
          <div className="text-xs font-bold text-violet-400 truncate px-1">
            {mode === "local"
              ? "Người Chơi 2"
              : isHost
              ? opponentJoined
                ? opponentName
                : "Đang Đợi..."
              : myPlayerLabel}
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
              ) : (roundResult === "p1" && (mode === "local" || isHost)) ||
                (roundResult === "p2" && mode === "online" && !isHost) ? (
                <span className="text-cyan-400">BẠN CHIẾN THẮNG! 🏆 (+2 Coins)</span>
              ) : (
                <span className="text-violet-400">ĐỐI THỦ THẮNG! 💥</span>
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
            {mode === "online" && !opponentJoined && (
              <div className="mb-4 inline-flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs text-amber-300">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                Đang chờ đối thủ nhập mã phòng <span className="font-mono font-bold text-white">{roomPin}</span> để vào trận...
              </div>
            )}

            <div className="text-xs font-semibold text-zinc-400 mb-2">
              {mode === "local"
                ? turn === "p1"
                  ? "👉 Lượt Người Chơi 1 Chọn (P2 quay mặt đi):"
                  : "👉 Lượt Người Chơi 2 Chọn:"
                : myCurrentMove
                ? oppCurrentMove
                  ? "Đang tính kết quả..."
                  : "⏳ Bạn đã chọn! Đang chờ đối thủ ra quyết định..."
                : oppCurrentMove
                ? "⚡ Đối thủ ĐÃ CHỌN! Đến lượt bạn hãy chọn ngay:"
                : "👉 Hãy chọn Kéo, Búa hoặc Bao:"}
            </div>

            {/* Move Buttons */}
            {((mode === "local" && (!p1Move || !p2Move)) || (mode === "online" && !myCurrentMove)) && (
              <div className="flex items-center justify-center gap-4 mt-6">
                {(["rock", "paper", "scissors"] as RpsMove[]).map((move) => (
                  <MagneticButton
                    key={move}
                    type="button"
                    onClick={() => handleSelectMove(move)}
                    className="flex flex-col items-center justify-center h-24 w-24 rounded-2xl border border-white/10 bg-white/[0.04] hover:border-cyan-500/50 hover:bg-cyan-500/10 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-pointer"
                  >
                    <span className="text-4xl">{RPS_MOVE_ICONS[move].emoji}</span>
                    <span className="text-xs font-bold text-white mt-2">{RPS_MOVE_ICONS[move].label}</span>
                  </MagneticButton>
                ))}
              </div>
            )}

            {mode === "online" && myCurrentMove && !oppCurrentMove && (
              <div className="mt-6 flex flex-col items-center gap-2">
                <span className="text-4xl">{RPS_MOVE_ICONS[myCurrentMove].emoji}</span>
                <span className="text-xs text-zinc-500">Lựa chọn của bạn đã được khóa lại bí mật</span>
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
