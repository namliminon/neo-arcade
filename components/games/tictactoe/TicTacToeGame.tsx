"use client";

import React, { useState, useEffect, useRef } from "react";
import { BoardState, WinResult, checkTicTacToeWinner } from "./tictactoe-rules";
import { RoomLobby } from "../realtime/RoomLobby";
import { LiveRoomChat, ChatMessage } from "../realtime/LiveRoomChat";
import { EmojiReactions } from "../realtime/EmojiReactions";
import { soundSynth } from "@/lib/audio/sound-synth";
import { useAuth } from "@/lib/store/auth-context";
import { dataAdapter } from "@/lib/store/data-adapter";
import { RotateCcw, Copy, Check, ArrowLeft, Trophy } from "lucide-react";
import { MagneticButton } from "@/components/motion/MagneticButton";

interface FloatingEmoji {
  id: string;
  emoji: string;
  x: number;
}

export function TicTacToeGame() {
  const { user, addCoins } = useAuth();

  const [mode, setMode] = useState<"lobby" | "local" | "online">("lobby");
  const [roomPin, setRoomPin] = useState("");
  const [copiedPin, setCopiedPin] = useState(false);

  // Game board
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [winResult, setWinResult] = useState<WinResult | null>(null);
  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);

  // Online
  const [mySymbol, setMySymbol] = useState<"X" | "O">("X");
  const [opponentJoined, setOpponentJoined] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const channelRef = useRef<BroadcastChannel | null>(null);

  const handleCopyPin = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(roomPin);
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2000);
    }
  };

  // Realtime channel
  useEffect(() => {
    if (mode !== "online" || !roomPin) return;

    const channel = new BroadcastChannel(`neo_arcade_ttt_${roomPin}`);
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
        handleMove(data.index, data.symbol, false);
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
        resetBoard(false);
      }
    };

    if (mySymbol === "O") {
      channel.postMessage({ type: "JOIN" });
    }

    return () => {
      channel.close();
    };
  }, [mode, roomPin, mySymbol]);

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

  const handleMove = (index: number, symbol: "X" | "O", broadcast: boolean = true) => {
    if (board[index] || winResult) return;
    if (mode === "online" && symbol !== mySymbol && broadcast) return;

    soundSynth.play("click");
    const newBoard = [...board];
    newBoard[index] = symbol;
    setBoard(newBoard);

    if (broadcast && mode === "online") {
      channelRef.current?.postMessage({ type: "MOVE", index, symbol });
    }

    const result = checkTicTacToeWinner(newBoard);
    if (result) {
      setWinResult(result);
      if (result.winner === "X") {
        setXScore((s) => s + 1);
        soundSynth.play("win");
        if (user && (mode === "local" || mySymbol === "X")) {
          addCoins(3);
          dataAdapter.submitScore(user.id, user.username, "tictactoe", xScore + 1);
        }
      } else if (result.winner === "O") {
        setOScore((s) => s + 1);
        soundSynth.play("win");
        if (user && mySymbol === "O") {
          addCoins(3);
          dataAdapter.submitScore(user.id, user.username, "tictactoe", oScore + 1);
        }
      } else {
        soundSynth.play("lose");
      }
    } else {
      setTurn(symbol === "X" ? "O" : "X");
    }
  };

  const resetBoard = (broadcast: boolean = true) => {
    setBoard(Array(9).fill(null));
    setTurn("X");
    setWinResult(null);
    if (broadcast && mode === "online") {
      channelRef.current?.postMessage({ type: "RESET" });
    }
  };

  const handleCreateRoom = () => {
    const code = `TTT-${Math.floor(1000 + Math.random() * 9000)}`;
    setRoomPin(code);
    setMySymbol("X");
    setOpponentJoined(false);
    setMode("online");
  };

  const handleJoinRoom = (pin: string) => {
    setRoomPin(pin);
    setMySymbol("O");
    setOpponentJoined(true);
    setMode("online");
  };

  if (mode === "lobby") {
    return (
      <RoomLobby
        gameTitle="Cờ Ca-rô Neon (Tic-Tac-Toe)"
        onSelectLocal={() => {
          setMode("local");
          setXScore(0);
          setOScore(0);
          resetBoard(false);
        }}
        onCreateOnlineRoom={handleCreateRoom}
        onJoinOnlineRoom={handleJoinRoom}
      />
    );
  }

  const isMyTurn = mode === "local" || turn === mySymbol;

  return (
    <div className="max-w-md mx-auto w-full space-y-4">
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
          {mode === "local" ? "🕹️ 2 Người Cùng Máy" : `🌐 Bạn là '${mySymbol}' • Phòng: ${roomPin}`}
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
      <div className="grid grid-cols-2 items-center rounded-2xl border border-white/[0.08] bg-[#121217]/90 p-4 text-center">
        <div className={`p-2 rounded-xl transition-all ${turn === "X" && !winResult ? "bg-cyan-500/10 border border-cyan-500/30" : ""}`}>
          <div className="text-xs font-bold text-cyan-400">Quân X</div>
          <div className="text-2xl font-black text-white font-mono mt-0.5">{xScore}</div>
        </div>
        <div className={`p-2 rounded-xl transition-all ${turn === "O" && !winResult ? "bg-pink-500/10 border border-pink-500/30" : ""}`}>
          <div className="text-xs font-bold text-pink-400">Quân O</div>
          <div className="text-2xl font-black text-white font-mono mt-0.5">{oScore}</div>
        </div>
      </div>

      {/* Status banner */}
      <div className="text-center text-xs font-medium">
        {winResult ? (
          winResult.winner === "draw" ? (
            <span className="text-amber-400 font-bold text-sm">HÒA CỜ! 🤝</span>
          ) : (
            <span className="text-emerald-400 font-bold text-sm">
              🏆 QUÂN {winResult.winner} CHIẾN THẮNG!
            </span>
          )
        ) : (
          <span className="text-zinc-400">
            Lượt đi:{" "}
            <span className={`font-bold ${turn === "X" ? "text-cyan-400" : "text-pink-400"}`}>
              Quân {turn}
            </span>{" "}
            {mode === "online" && (isMyTurn ? "(Lượt của bạn)" : "(Đối thủ đang suy nghĩ...)")}
          </span>
        )}
      </div>

      {/* 3x3 Grid */}
      <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl border border-white/[0.12] bg-[#0c0d12] shadow-[0_0_40px_rgba(6,182,212,0.1)]">
        {board.map((cell, idx) => {
          const isWinningCell = winResult?.line?.includes(idx);
          return (
            <button
              key={idx}
              type="button"
              disabled={Boolean(cell) || Boolean(winResult) || !isMyTurn}
              onClick={() => handleMove(idx, turn)}
              className={`h-24 sm:h-28 rounded-xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center text-5xl font-black select-none transition-all ${
                !cell && isMyTurn && !winResult ? "hover:bg-white/[0.06] hover:border-cyan-500/30 active:scale-95" : ""
              } ${
                isWinningCell
                  ? cell === "X"
                    ? "border-cyan-400 bg-cyan-500/25 shadow-[0_0_25px_rgba(6,182,212,0.6)] animate-pulse"
                    : "border-pink-400 bg-pink-500/25 shadow-[0_0_25px_rgba(236,72,153,0.6)] animate-pulse"
                  : ""
              }`}
            >
              {cell === "X" && (
                <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]">X</span>
              )}
              {cell === "O" && (
                <span className="text-pink-500 drop-shadow-[0_0_12px_rgba(236,72,153,0.8)]">O</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Reset button */}
      {winResult && (
        <div className="text-center">
          <MagneticButton
            onClick={() => resetBoard(true)}
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-6 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:opacity-95"
          >
            <RotateCcw className="h-4 w-4 mr-1.5" />
            Chơi Ván Mới
          </MagneticButton>
        </div>
      )}

      {/* Online Chat */}
      {mode === "online" && (
        <LiveRoomChat messages={chatMessages} onSendMessage={handleSendMessage} />
      )}
    </div>
  );
}
