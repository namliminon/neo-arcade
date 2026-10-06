"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { HeroBanner } from "@/components/home/HeroBanner";
import { GameGrid } from "@/components/home/GameGrid";
import { FloatingDock } from "@/components/layout/FloatingDock";
import { Footer } from "@/components/layout/Footer";
import { AuthModal } from "@/components/auth/AuthModal";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      <AuthModal />
      <Navbar />

      <main className="flex-1 pb-16">
        <HeroBanner />
        <GameGrid />
      </main>

      <FloatingDock />
      <Footer />
    </div>
  );
}
