"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { soundSynth } from "@/lib/audio/sound-synth";
import { useAuth } from "@/lib/store/auth-context";
import { dataAdapter } from "@/lib/store/data-adapter";
import { Trophy, Award, Sparkles, Play, RotateCcw, Lock } from "lucide-react";
import { MagneticButton } from "@/components/motion/MagneticButton";

interface Pipe {
  x: number;
  topHeight: number;
  bottomY: number;
  passed: boolean;
}

const CANVAS_WIDTH = 360;
const CANVAS_HEIGHT = 500;
const GRAVITY = 0.32;
const JUMP_FORCE = -6.2;
const PIPE_WIDTH = 52;
const PIPE_GAP = 125;
const PIPE_SPEED = 2.2;

export function FlappyGame() {
  const { user, addCoins, openAuthModal } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");

  const birdRef = useRef({
    y: CANVAS_HEIGHT / 2,
    velocity: 0,
    radius: 14,
  });

  const pipesRef = useRef<Pipe[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const scoreRef = useRef(0);

  const flap = useCallback(() => {
    if (gameState === "idle") {
      startGame();
      return;
    }
    if (gameState === "playing") {
      birdRef.current.velocity = JUMP_FORCE;
      soundSynth.play("jump");
    }
  }, [gameState]);

  const startGame = () => {
    birdRef.current = {
      y: CANVAS_HEIGHT / 2,
      velocity: JUMP_FORCE,
      radius: 14,
    };
    pipesRef.current = [
      {
        x: CANVAS_WIDTH + 50,
        topHeight: Math.floor(Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 120)) + 60,
        bottomY: 0,
        passed: false,
      },
    ];
    pipesRef.current[0].bottomY = pipesRef.current[0].topHeight + PIPE_GAP;

    setScore(0);
    scoreRef.current = 0;
    setCoinsEarned(0);
    setGameState("playing");
    soundSynth.play("jump");
  };

  // Keyboard Space to Flap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        flap();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [flap]);

  // Main Canvas Physics & Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastPipeSpawn = Date.now();

    const loop = () => {
      // 1. Clear background
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Starfield dots
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      for (let i = 0; i < 25; i++) {
        const sx = ((i * 37 + (Date.now() / 80)) % CANVAS_WIDTH);
        const sy = (i * 23) % CANVAS_HEIGHT;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      if (gameState === "playing") {
        // Physics update
        const bird = birdRef.current;
        bird.velocity += GRAVITY;
        bird.y += bird.velocity;

        // Ground / Ceiling collision
        if (bird.y + bird.radius >= CANVAS_HEIGHT - 20 || bird.y - bird.radius <= 0) {
          endGame();
          return;
        }

        // Spawn pipes
        if (Date.now() - lastPipeSpawn > 1800) {
          const topH = Math.floor(Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 120)) + 60;
          pipesRef.current.push({
            x: CANVAS_WIDTH,
            topHeight: topH,
            bottomY: topH + PIPE_GAP,
            passed: false,
          });
          lastPipeSpawn = Date.now();
        }

        // Update pipes & Check collisions
        for (let i = pipesRef.current.length - 1; i >= 0; i--) {
          const pipe = pipesRef.current[i];
          pipe.x -= PIPE_SPEED;

          // Check score pass
          if (!pipe.passed && pipe.x + PIPE_WIDTH < bird.y) {
            pipe.passed = true;
            scoreRef.current += 1;
            setScore(scoreRef.current);
            soundSynth.play("coin");

            // Award coin every 2 pipes
            if (scoreRef.current % 2 === 0) {
              setCoinsEarned((c) => c + 1);
              addCoins(1);
            }
          }

          // AABB Collision with top & bottom pipes
          const birdX = 80;
          if (
            birdX + bird.radius > pipe.x &&
            birdX - bird.radius < pipe.x + PIPE_WIDTH
          ) {
            if (
              bird.y - bird.radius < pipe.topHeight ||
              bird.y + bird.radius > pipe.bottomY
            ) {
              endGame();
              return;
            }
          }

          // Remove off-screen pipes
          if (pipe.x + PIPE_WIDTH < -10) {
            pipesRef.current.splice(i, 1);
          }
        }
      }

      // 2. Draw Pipes
      pipesRef.current.forEach((pipe) => {
        // Neon green pipe glow
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#10b981";

        // Top pipe
        const topGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
        topGrad.addColorStop(0, "#059669");
        topGrad.addColorStop(1, "#10b981");
        ctx.fillStyle = topGrad;
        ctx.beginPath();
        ctx.roundRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight, [0, 0, 8, 8]);
        ctx.fill();

        // Bottom pipe
        const botGrad = ctx.createLinearGradient(pipe.x, pipe.bottomY, pipe.x + PIPE_WIDTH, pipe.bottomY);
        botGrad.addColorStop(0, "#059669");
        botGrad.addColorStop(1, "#10b981");
        ctx.fillStyle = botGrad;
        ctx.beginPath();
        ctx.roundRect(
          pipe.x,
          pipe.bottomY,
          PIPE_WIDTH,
          CANVAS_HEIGHT - pipe.bottomY - 20,
          [8, 8, 0, 0]
        );
        ctx.fill();

        ctx.shadowBlur = 0;
      });

      // 3. Draw Cyber Bird
      const bird = birdRef.current;
      const birdX = 80;

      ctx.save();
      ctx.translate(birdX, bird.y);
      const angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, bird.velocity * 0.08));
      ctx.rotate(angle);

      // Glowing body
      ctx.shadowBlur = 16;
      ctx.shadowColor = "#f59e0b";
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(0, 0, bird.radius, 0, Math.PI * 2);
      ctx.fill();

      // Wing
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.ellipse(-4, 2, 7, 4, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();

      // Beak
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.moveTo(bird.radius - 2, -3);
      ctx.lineTo(bird.radius + 8, 2);
      ctx.lineTo(bird.radius - 2, 6);
      ctx.fill();

      // Eye
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(4, -4, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(6, -4, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 4. Draw Neon Ground
      ctx.fillStyle = "#18181b";
      ctx.fillRect(0, CANVAS_HEIGHT - 20, CANVAS_WIDTH, 20);
      ctx.fillStyle = "#06b6d4";
      ctx.fillRect(0, CANVAS_HEIGHT - 20, CANVAS_WIDTH, 2);

      if (gameState === "playing") {
        animationFrameRef.current = requestAnimationFrame(loop);
      }
    };

    const endGame = () => {
      soundSynth.play("lose");
      setGameState("gameover");
      const finalScore = scoreRef.current;
      if (finalScore > highScore) setHighScore(finalScore);
      if (user) {
        const displayName = user.nickname || user.username;
        dataAdapter.submitScore(user.id, displayName, "flappy", finalScore);
      }
    };

    if (gameState === "playing") {
      animationFrameRef.current = requestAnimationFrame(loop);
    } else {
      loop();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, highScore, user, addCoins]);

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto w-full">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between p-3.5 mb-3 rounded-2xl border border-white/[0.08] bg-[#121217]/90 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <Trophy className="h-4 w-4 text-cyan-400" />
          <span className="text-xs text-zinc-400">Điểm:</span>
          <span className="text-lg font-black text-white font-mono">{score}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Award className="h-4 w-4 text-amber-400" />
          <span className="text-xs text-zinc-400">Kỷ lục:</span>
          <span className="text-lg font-black text-amber-400 font-mono">{highScore}</span>
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
          <Sparkles className="h-3 w-3 text-amber-400" />
          +{coinsEarned}
        </div>
      </div>

      {/* Canvas Area */}
      <div
        onClick={flap}
        className="relative cursor-pointer select-none rounded-2xl border border-white/[0.12] bg-[#0a0a0f] shadow-[0_0_40px_rgba(245,158,11,0.15)] overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="w-[320px] h-[444px] sm:w-[360px] sm:h-[500px] block"
        />

        {gameState !== "playing" && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            {gameState === "gameover" ? (
              <>
                <div className="text-3xl font-black text-rose-500 mb-1 tracking-wider animate-bounce">
                  GAME OVER
                </div>
                <p className="text-xs text-zinc-400 mb-3">
                  Bạn bay qua <span className="text-amber-300 font-bold">{score}</span> ống và kiếm được{" "}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        openAuthModal("register");
                      }}
                      className="underline text-amber-200 hover:text-white font-semibold cursor-pointer"
                    >
                      Đăng nhập / Đặt nickname để leo Top
                    </button>
                  </div>
                )}
                <MagneticButton
                  onClick={(e) => {
                    e.stopPropagation();
                    startGame();
                  }}
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-2.5 text-sm font-bold text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:opacity-95"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Chơi Lại (Phím Cách)
                </MagneticButton>
              </>
            ) : (
              <>
                <div className="text-2xl font-black text-white mb-2 flex items-center gap-2">
                  🐥 Cyber Flappy Bird
                </div>
                <p className="text-xs text-zinc-400 mb-6 max-w-xs">
                  Chạm vào màn hình hoặc bấm phím Cách để vỗ cánh bay qua các chướng ngại vật laser.
                </p>
                <MagneticButton
                  onClick={(e) => {
                    e.stopPropagation();
                    startGame();
                  }}
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-3 text-sm font-black text-black shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:scale-105"
                >
                  <Play className="h-4 w-4 mr-2 fill-current" />
                  Bắt Đầu Bay
                </MagneticButton>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 text-[11px] text-zinc-500 text-center">
        💡 Nhấn phím Cách, click chuột hoặc chạm ngón tay vào màn hình để bay
      </div>
    </div>
  );
}
