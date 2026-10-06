import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neo-Arcade | Modern Global Web Gaming Hub",
  description: "Cross-platform retro arcade gaming platform featuring multiplayer online games, leaderboards, quests, and motion animations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className="antialiased min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
