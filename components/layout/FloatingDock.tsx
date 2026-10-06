"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, Trophy, Target, ShoppingBag, Shield, Home } from "lucide-react";
import { useAuth } from "@/lib/store/auth-context";
import { soundSynth } from "@/lib/audio/sound-synth";

export function FloatingDock() {
  const pathname = usePathname();
  const { role } = useAuth();

  const links = [
    { href: "/", label: "Sảnh", icon: Home },
    { href: "/leaderboard", label: "BXH", icon: Trophy },
    { href: "/quests", label: "Nhiệm vụ", icon: Target },
    { href: "/shop", label: "Shop", icon: ShoppingBag },
  ];

  if (role === "admin") {
    links.push({ href: "/admin", label: "Admin", icon: Shield });
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 md:hidden">
      <div className="flex items-center gap-1 p-2 rounded-2xl border border-white/[0.12] bg-[#121217]/90 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => soundSynth.play("click")}
              className={`flex flex-col items-center justify-center h-12 w-14 rounded-xl transition-all ${
                isActive
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[10px] font-semibold mt-0.5">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
