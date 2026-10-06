"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Direction, Point, moveSnakeHead, checkSnakeSelfCollision, isOppositeDirection } from "./snake-math";
import { VirtualDPad } from "./VirtualDPad";
import { soundSynth } from "@/lib/audio/sound-synth";
import { useAuth } from "@/lib/store/auth-context";
import { dataAdapter } from "@/lib/store/data-adapter";
import { Play, RotateCcw, Trophy, Award, Sparkles, Lock } from "lucide-react";
import { MagneticButton } from "@/components/motion/MagneticButton";

const GRID_SIZE = 20;

export function SnakeGame() {
  const { user, addCoins, openAuthModal } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [snake, setSnake] = useState<Point[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ]);
  const [direction, setDirection] = useState<Direction>("UP");
  const nextDirectionRef = useRef<Direction>("UP");

  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [goldenFood, setGoldenFood] = useState<Point | null>(null);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some((seg) => seg.x === newFood.x && seg.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const startGame = () => {
    const initialSnake: Point[] = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ];
    setSnake(initialSnake);
    setDirection("UP");
    nextDirectionRef.current = "UP";
    setScore(0);
    setCoinsEarned(0);
    setFood(generateFood(initialSnake));
    setGoldenFood(null);
    setGameState("playing");
    soundSynth.play("jump");
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") {
        if (e.code === "Space" || e.code === "Enter") {
          e.preventDefault();
          startGame();
        }
        return;
      }

      let newDir: Direction | null = null;
      if (e.code === "ArrowUp" || e.key === "w" || e.key === "W") newDir = "UP";
      if (e.code === "ArrowDown" || e.key === "s" || e.key === "S") newDir = "DOWN";
      if (e.code === "ArrowLeft" || e.key === "a" || e.key === "A") newDir = "LEFT";
      if (e.code === "ArrowRight" || e.key === "d" || e.key === "D") newDir = "RIGHT";

      if (newDir && !isOppositeDirection(newDir, direction)) {
        e.preventDefault();
        nextDirectionRef.current = newDir;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, gameState]);

  const handleDirectionChange = (newDir: Direction) => {
    if (!isOppositeDirection(newDir, direction)) {
      nextDirectionRef.current = newDir;
    }
  };

  // Game Loop
  useEffect(() => {
    if (gameState !== "playing") return;

    // Speed increases dynamically
    const baseSpeed = Math.max(70, 140 - Math.floor(score / 50) * 8);

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const currentDir = nextDirectionRef.current;
        setDirection(currentDir);
        const head = prevSnake[0];
        const nextHead = moveSnakeHead(head, currentDir);

        // Wall collision or self collision
        if (
          nextHead.x < 0 ||
          nextHead.x >= GRID_SIZE ||
          nextHead.y < 0 ||
          nextHead.y >= GRID_SIZE ||
          checkSnakeSelfCollision(nextHead, prevSnake)
        ) {
          soundSynth.play("lose");
          setGameState("gameover");

          // Save high score only if logged in
          setScore((finalScore) => {
            if (finalScore > highScore) setHighScore(finalScore);
            if (user) {
              const displayName = user.nickname || user.username;
              dataAdapter.submitScore(user.id, displayName, "snake", finalScore);
            }
            return finalScore;
          });
          return prevSnake;
        }

        const newSnake = [nextHead, ...prevSnake];

        // Check Food
        if (nextHead.x === food.x && nextHead.y === food.y) {
          soundSynth.play("eat");
          setScore((s) => s + 10);
          setCoinsEarned((c) => c + 1);
          addCoins(1);
          setFood(generateFood(newSnake));

          // 25% chance to spawn golden food
          if (Math.random() < 0.25 && !goldenFood) {
            setGoldenFood(generateFood(newSnake));
          }
          return newSnake;
        }

        // Check Golden Food
        if (goldenFood && nextHead.x === goldenFood.x && nextHead.y === goldenFood.y) {
          soundSynth.play("coin");
          setScore((s) => s + 50);
          setCoinsEarned((c) => c + 5);
          addCoins(5);
          setGoldenFood(null);
          return newSnake;
        }

        newSnake.pop();
        return newSnake;
      });
    }, baseSpeed);

    return () => clearInterval(interval);
  }, [gameState, score, food, goldenFood, highScore, user, addCoins, generateFood]);

  // Render Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const tile = size / GRID_SIZE;

    // Clear background
    ctx.fillStyle = "#0c0d12";
    ctx.fillRect(0, 0, size, size);

    // Subtle grid dots
    ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        ctx.fillRect(x * tile + tile / 2 - 1, y * tile + tile / 2 - 1, 2, 2);
      }
    }

    // Draw Normal Food (Neon Green Apple)
    ctx.shadowBlur = 12;
    ctx.shadowColor = "#10b981";
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(food.x * tile + tile / 2, food.y * tile + tile / 2, tile / 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Draw Golden Food
    if (goldenFood) {
      ctx.shadowBlur = 18;
      ctx.shadowColor = "#f59e0b";
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(goldenFood.x * tile + tile / 2, goldenFood.y * tile + tile / 2, tile / 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Snake
    snake.forEach((seg, index) => {
      if (index === 0) {
        // Head
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#06b6d4";
        ctx.fillStyle = "#22d3ee";
        ctx.beginPath();
        ctx.roundRect(seg.x * tile + 1, seg.y * tile + 1, tile - 2, tile - 2, 6);
        ctx.fill();

        // Eyes
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#09090b";
        ctx.beginPath();
        ctx.arc(seg.x * tile + tile * 0.35, seg.y * tile + tile * 0.35, 2, 0, Math.PI * 2);
        ctx.arc(seg.x * tile + tile * 0.65, seg.y * tile + tile * 0.35, 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Body with gradient falloff
        const alpha = Math.max(0.4, 1 - index / snake.length);
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(168, 85, 247, ${alpha})`;
        ctx.fillStyle = index % 2 === 0 ? "#a855f7" : "#06b6d4";
        ctx.beginPath();
        ctx.roundRect(seg.x * tile + 2, seg.y * tile + 2, tile - 4, tile - 4, 4);
        ctx.fill();
      }
    });

    ctx.shadowBlur = 0;
  }, [snake, food, goldenFood]);

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto w-full">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between p-3.5 mb-3 rounded-2xl border border-white/[0.08] bg-[#121217]/90 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-cyan-400" />
          <span className="text-xs text-zinc-400 font-medium">Điểm:</span>
          <span className="text-lg font-black text-white font-mono">{score}</span>
        </div>

        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-amber-400" />
          <span className="text-xs text-zinc-400 font-medium">Kỷ lục:</span>
          <span className="text-lg font-black text-amber-400 font-mono">{highScore}</span>
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
          <Sparkles className="h-3 w-3 text-amber-400" />
          +{coinsEarned} Xu
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative rounded-2xl border border-white/[0.12] bg-[#0c0d12] shadow-[0_0_40px_rgba(6,182,212,0.15)] overflow-hidden">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] block"
        />

        {/* Start / Gameover Overlay */}
        {gameState !== "playing" && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            {gameState === "gameover" ? (
              <>
                <div className="text-3xl font-black text-rose-500 mb-1 tracking-wider animate-bounce">
                  GAME OVER
                </div>
                <p className="text-xs text-zinc-400 mb-3">
                  Bạn đạt được <span className="text-cyan-300 font-bold">{score}</span> điểm và kiếm được{" "}
                  <span className="text-amber-300 font-bold">+{coinsEarned} xu</span>!
                </p>

                {user ? (
                  <div className="mb-4 inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                    <Trophy className="h-3.5 w-3.5" />
                    <span>Đã ghi danh nickname <b>{user.nickname || user.username}</b> lên BXH!</span>
                  </div>
                ) : (
                  <div className="mb-4 max-w-xs flex flex-col items-center gap-1 rounded-xl bg-amber-500/10 border border-amber-500/30 p-2.5 text-[11px] text-amber-300">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Lock className="h-3.5 w-3.5 text-amber-400" />
                      Chưa đăng nhập: Điểm không được lên BXH
                    </div>
                    <button
                      type="button"
                      onClick={() => openAuthModal("register")}
                      className="underline text-amber-200 hover:text-white font-semibold cursor-pointer"
                    >
                      Đăng nhập / Đặt nickname để leo Top
                    </button>
                  </div>
                )}
                <MagneticButton
                  onClick={startGame}
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-6 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:opacity-95"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Chơi Lại (Phím Cách)
                </MagneticButton>
              </>
            ) : (
              <>
                <div className="text-2xl font-black text-white mb-2 flex items-center gap-2">
                  🐍 Rắn Săn Mồi Retro
                </div>
                <p className="text-xs text-zinc-400 mb-6 max-w-xs">
                  Điều khiển bằng mũi tên hoặc phím W/A/S/D trên máy tính, hoặc cụm D-Pad bên dưới trên điện thoại.
                </p>
                <MagneticButton
                  onClick={startGame}
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-8 py-3 text-sm font-black text-white shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-105"
                >
                  <Play className="h-4 w-4 mr-2 fill-current" />
                  Bắt Đầu Chơi
                </MagneticButton>
              </>
            )}
          </div>
        )}
      </div>

      {/* Mobile Virtual D-Pad */}
      <div className="mt-3 md:hidden">
        <VirtualDPad
          onDirectionChange={handleDirectionChange}
          currentDirection={direction}
        />
      </div>

      {/* Desktop Helper */}
      <div className="hidden md:flex items-center gap-3 mt-4 text-[11px] text-zinc-500">
        <span>🎮 Phím mũi tên / WASD để đổi hướng</span>
        <span>•</span>
        <span>🍎 Táo xanh +10đ</span>
        <span>•</span>
        <span>⭐ Táo vàng +50đ & +5 xu</span>
      </div>
    </div>
  );
}
