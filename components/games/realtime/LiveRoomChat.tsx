"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, MessageSquare } from "lucide-react";
import { soundSynth } from "@/lib/audio/sound-synth";

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  isSelf: boolean;
  time: string;
}

interface LiveRoomChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
}

export function LiveRoomChat({ messages, onSendMessage }: LiveRoomChatProps) {
  const [inputText, setInputText] = useState("");
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    soundSynth.play("click");
    onSendMessage(inputText.trim());
    setInputText("");
  };

  return (
    <div className="flex flex-col h-64 rounded-2xl border border-white/[0.08] bg-[#121217]/90 backdrop-blur-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] px-3.5 py-2 bg-white/[0.02]">
        <MessageSquare className="h-3.5 w-3.5 text-cyan-400" />
        <span className="text-xs font-bold text-white">Khung Trò Chuyện Phòng</span>
      </div>

      {/* Message List */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[11px] text-zinc-500 italic">
            Chưa có tin nhắn nào. Hãy gửi lời chào đối thủ!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isSelf ? "items-end" : "items-start"}`}
            >
              <span className="text-[10px] text-zinc-500 font-mono mb-0.5">
                {msg.sender} • {msg.time}
              </span>
              <div
                className={`max-w-[80%] rounded-xl px-2.5 py-1.5 text-xs font-medium break-words ${
                  msg.isSelf
                    ? "bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-br-none shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                    : "bg-zinc-800 text-zinc-200 rounded-bl-none border border-white/10"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-2 border-t border-white/[0.08] flex gap-1.5 bg-black/30">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Nhập tin nhắn..."
          maxLength={100}
          className="flex-1 rounded-xl border border-white/[0.08] bg-black/50 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none"
        />
        <button
          type="submit"
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30 transition-colors"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}
