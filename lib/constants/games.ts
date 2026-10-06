export interface GameMeta {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  players: string;
  category: "single" | "multi";
  color: string;
  glowColor: string;
  href: string;
  badge: string;
  tags: string[];
  icon: string;
}

export const GAMES_CATALOG: GameMeta[] = [
  {
    id: "snake",
    title: "Rắn Săn Mồi Retro",
    subtitle: "Neon Snake 60 FPS",
    description: "Ăn táo phát sáng, tránh va chạm và ghi điểm kỷ lục để thăng hạng thế giới.",
    players: "1 Người Chơi",
    category: "single",
    color: "from-cyan-500/20 to-emerald-500/10",
    glowColor: "rgba(6, 182, 212, 0.35)",
    href: "/games/snake",
    badge: "Kinh Điển",
    tags: ["Tốc độ", "Phản xạ", "Bảng điểm"],
    icon: "🐍",
  },
  {
    id: "flappy",
    title: "Cyber Flappy Bird",
    subtitle: "Cơ Chế Vật Lý Siêu Mượt",
    description: "Vỗ cánh bay qua các cột laser chết chóc trong thành phố neon tương lai.",
    players: "1 Người Chơi",
    category: "single",
    color: "from-amber-500/20 to-red-500/10",
    glowColor: "rgba(245, 158, 11, 0.35)",
    href: "/games/flappy",
    badge: "Gây Nghiện",
    tags: ["Thử thách", "Vật lý", "Huy chương"],
    icon: "🐥",
  },
  {
    id: "rps",
    title: "Oản Tù Tì Đấu Trường",
    subtitle: "Rock Paper Scissors Arena",
    description: "Đấu trí đối kháng 2 người: hỗ trợ cùng máy hoặc tạo phòng đấu Online thời gian thực.",
    players: "2 Người (Cùng Máy & Online)",
    category: "multi",
    color: "from-violet-500/20 to-pink-500/10",
    glowColor: "rgba(168, 85, 247, 0.35)",
    href: "/games/rps",
    badge: "Đối Kháng Realtime",
    tags: ["Đấu trí", "Live Chat", "Biểu cảm"],
    icon: "✌️",
  },
  {
    id: "tictactoe",
    title: "Cờ Ca-rô Neon",
    subtitle: "Gomoku / Tic-Tac-Toe",
    description: "Nối 3 ô phát sáng để hạ gục đối thủ. Tích hợp phòng đấu trực tuyến kèm thả Emoji.",
    players: "2 Người (Cùng Máy & Online)",
    category: "multi",
    color: "from-pink-500/20 to-cyan-500/10",
    glowColor: "rgba(236, 72, 153, 0.35)",
    href: "/games/tictactoe",
    badge: "Chiến Thuật",
    tags: ["Trí tuệ", "2 Người", "Realtime"],
    icon: "❌",
  },
];
