# Neo-Arcade Gaming Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, responsive, cross-platform Neo-Arcade web gaming hub with authentication, admin user-banning with reasons, 4 games (Snake, Flappy Bird, Rock Paper Scissors, Tic-Tac-Toe) supporting single-player and 2-player local/online modes, 5 engaging features (Leaderboard, Quests, Shop, Realtime Room Chat/Emoji, 8-bit Audio Synthesizer), motion-primitives animations, zero-friction local fallback, and free worldwide deployment via Vercel and Supabase.

**Architecture:** A Next.js App Router application combining Tailwind CSS and Framer Motion for high-end micro-interactions. A unified data-adapter layer toggles seamlessly between Supabase Cloud (Postgres, Auth, Realtime) and Local Fallback (localStorage, BroadcastChannel). Games are rendered with hardware-accelerated HTML5 Canvas and React state machines.

**Tech Stack:** Next.js (App Router, React 19/18, TypeScript), Tailwind CSS, Framer Motion, Lucide React, Web Audio API, Supabase JS Client.

**Spec:** `docs/superpowers/specs/2026-10-06-neo-arcade-platform-design.md`

## Global Constraints

- **Platform Target:** Responsive for mobile touch (virtual controls), tablet, and desktop keyboard/mouse.
- **Hosting / Cost Model:** 100% Free production tier (Vercel CDN + Supabase Free Tier).
- **Default Test Admin:** Email `admin@arcade.dev`, Password `Admin@123456`.
- **Theme Palette:** Neo-Arcade Dark Mode (`#09090b` obsidian background, Cyan `#06b6d4`, Violet `#a855f7`, Amber `#f59e0b`).
- **Zero-Friction Fallback:** Must run fully and interactively without errors even if no Supabase environment variables are provided.
- **Motion Primitives Inspired:** Smooth physics animations modeled after `ibelick/motion-primitives` (Spotlight, Tabs, Magnetic buttons, Shimmer, Border beams).

## Review Focus

1. **Banned User Session Eviction:** A banned user attempting to login or continuing an active session must be immediately blocked, showing a clear modal with the ban reason.
2. **Offline / Fallback Resilience:** When `NEXT_PUBLIC_SUPABASE_URL` is unset, the app must not crash, smoothly using local mock storage and browser BroadcastChannel.
3. **Mobile Touch Controls:** Snake and Flappy Bird must be comfortably playable on touchscreens with virtual controls and gesture prevention (no unwanted screen bouncing).
4. **Room PIN Synchronization:** Online multiplayer games in Rock Paper Scissors and Tic-Tac-Toe must sync moves and chat messages accurately between two browser windows.
5. **Sound Synthesizer Mute State:** Audio toggle in header must be respected everywhere without unhandled audio context exceptions or audio autoplay policy blocks.

---

### Task 1: Project Scaffolding & Neo-Arcade Design System

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Create: `app/globals.css`
- Create: `app/layout.tsx`
- Test: `tests/setup.test.ts`

**Interfaces:**
- Produces: Base Next.js app structure, Tailwind utility classes (`neon-glow`, `glass-card`), Root Layout with meta tags and font setup.

- [ ] **Step 1: Write verification test for package configuration**
```typescript
// tests/setup.test.ts
import { describe, it, expect } from 'vitest';
import packageJson from '../package.json';

describe('Project Setup', () => {
  it('includes required core dependencies', () => {
    expect(packageJson.dependencies).toHaveProperty('next');
    expect(packageJson.dependencies).toHaveProperty('framer-motion');
    expect(packageJson.dependencies).toHaveProperty('lucide-react');
    expect(packageJson.dependencies).toHaveProperty('@supabase/supabase-js');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/setup.test.ts`
Expected: FAIL (package.json not yet initialized)

- [ ] **Step 3: Initialize Next.js project with Tailwind CSS, Framer Motion, Lucide React, and Supabase**
Create `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, and `app/globals.css` with dark arcade design tokens.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/setup.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add package.json tsconfig.json tailwind.config.ts postcss.config.mjs app/globals.css app/layout.tsx tests/setup.test.ts
git commit -m "chore: scaffold nextjs project with neo-arcade styling and dependencies"
```

---

### Task 2: Motion Primitives & Web Audio Sound Synthesizer

**Files:**
- Create: `components/motion/SpotlightCard.tsx`
- Create: `components/motion/AnimatedTabs.tsx`
- Create: `components/motion/MagneticButton.tsx`
- Create: `components/motion/ShimmerText.tsx`
- Create: `components/motion/BorderBeam.tsx`
- Create: `components/motion/SpringModal.tsx`
- Create: `lib/audio/sound-synth.ts`
- Test: `tests/sound-synth.test.ts`

**Interfaces:**
- Produces: 
  - `soundSynth.play(sound: 'jump' | 'eat' | 'clash' | 'win' | 'lose' | 'click' | 'coin'): void`
  - `soundSynth.toggleMute(): boolean`
  - `SpotlightCard`: React component with mouse cursor spotlight glow.
  - `AnimatedTabs`: Framer Motion animated tab bar.
  - `MagneticButton`: Magnetic physics button with haptic hover.
  - `SpringModal`: Smooth scale-in backdrop-blur dialog.

- [ ] **Step 1: Write test for Web Audio sound synthesizer state management**
```typescript
// tests/sound-synth.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { soundSynth } from '../lib/audio/sound-synth';

describe('Sound Synthesizer', () => {
  beforeEach(() => {
    soundSynth.setMuted(false);
  });

  it('toggles mute state correctly', () => {
    expect(soundSynth.isMuted()).toBe(false);
    const muted = soundSynth.toggleMute();
    expect(muted).toBe(true);
    expect(soundSynth.isMuted()).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/sound-synth.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement Web Audio synthesizer & Motion Primitives components**
Implement `lib/audio/sound-synth.ts` using oscillator nodes (square, triangle, sine) with fallbacks for SSR and audio policy resume, plus the motion primitives components.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/sound-synth.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add components/motion/ lib/audio/ tests/sound-synth.test.ts
git commit -m "feat: add motion primitives components and procedural 8-bit sound synth"
```

---

### Task 3: Data Layer, Authentication & Ban Interceptor

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/store/data-adapter.ts`
- Create: `lib/store/auth-context.tsx`
- Create: `components/auth/AuthModal.tsx`
- Test: `tests/data-adapter.test.ts`

**Interfaces:**
- Consumes: `soundSynth` from Task 2.
- Produces:
  - `dataAdapter.login(email, password)`
  - `dataAdapter.register(username, email, password)`
  - `dataAdapter.logout()`
  - `dataAdapter.getCurrentUser()`
  - `dataAdapter.getAllUsers()`
  - `dataAdapter.setUserBanStatus(userId, isBanned, reason)`
  - `AuthContext`: Provides `user`, `role`, `isBanned`, `banReason`, `coins`, `login`, `logout`.

- [ ] **Step 1: Write test for data adapter authentication and ban handling**
```typescript
// tests/data-adapter.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { dataAdapter } from '../lib/store/data-adapter';

describe('Data Adapter & Auth System', () => {
  beforeEach(() => {
    dataAdapter.resetMockState();
  });

  it('allows default admin login', async () => {
    const res = await dataAdapter.login('admin@arcade.dev', 'Admin@123456');
    expect(res.user?.role).toBe('admin');
  });

  it('prevents banned user from logging in with a ban reason', async () => {
    // Register user
    const reg = await dataAdapter.register('testuser', 'test@user.com', 'Pass1234');
    expect(reg.user).toBeDefined();

    // Admin bans user with reason
    await dataAdapter.setUserBanStatus(reg.user!.id, true, 'Gian lận điểm số');

    // Login must fail
    const loginRes = await dataAdapter.login('test@user.com', 'Pass1234');
    expect(loginRes.error).toContain('Tài khoản của bạn đã bị khóa');
    expect(loginRes.banReason).toBe('Gian lận điểm số');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/data-adapter.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement data adapter with local fallback and Supabase integration**
Implement `lib/store/data-adapter.ts` checking for `NEXT_PUBLIC_SUPABASE_URL` and defaulting cleanly to browser localStorage, with default seeded admin `admin@arcade.dev`. Implement `AuthContext` and `AuthModal`.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/data-adapter.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add lib/supabase/ lib/store/ components/auth/ tests/data-adapter.test.ts
git commit -m "feat: implement auth system, data adapter, and user ban moderation logic"
```

---

### Task 4: Admin Portal with Ban Reason Management (`/admin`)

**Files:**
- Create: `app/admin/page.tsx`
- Create: `components/admin/UserManagementTable.tsx`
- Create: `components/admin/BanUserDialog.tsx`
- Create: `components/admin/AdminStatCards.tsx`
- Test: `tests/admin-portal.test.ts`

**Interfaces:**
- Consumes: `dataAdapter`, `AuthContext`, `SpringModal`, `soundSynth`.
- Produces: Complete admin dashboard UI allowing instant ban/unban with custom reasons, search filter, and stats.

- [ ] **Step 1: Write test for admin user moderation actions**
```typescript
// tests/admin-portal.test.ts
import { describe, it, expect } from 'vitest';
import { dataAdapter } from '../lib/store/data-adapter';

describe('Admin Management Operations', () => {
  it('updates ban status and ban reason on user', async () => {
    const user = await dataAdapter.register('player1', 'p1@arcade.dev', 'Pass1234');
    const updated = await dataAdapter.setUserBanStatus(user.user!.id, true, 'Ngôn từ xúc phạm');
    expect(updated.is_banned).toBe(true);
    expect(updated.ban_reason).toBe('Ngôn từ xúc phạm');

    const unbanned = await dataAdapter.setUserBanStatus(user.user!.id, false);
    expect(unbanned.is_banned).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/admin-portal.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement Admin Portal components & protection**
Create `/admin` page checking `role === 'admin'`. Build stats cards, user management table with search, and ban modal allowing predefined or custom reason input.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/admin-portal.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add app/admin/ components/admin/ tests/admin-portal.test.ts
git commit -m "feat: create admin moderation portal with user ban dialog and KPI stats"
```

---

### Task 5: Single Player Games: Retro Neon Snake & Cyber Flappy Bird

**Files:**
- Create: `components/games/snake/SnakeGame.tsx`
- Create: `components/games/snake/VirtualDPad.tsx`
- Create: `app/games/snake/page.tsx`
- Create: `components/games/flappy/FlappyGame.tsx`
- Create: `app/games/flappy/page.tsx`
- Test: `tests/snake-logic.test.ts`
- Test: `tests/flappy-logic.test.ts`

**Interfaces:**
- Consumes: `soundSynth`, `dataAdapter.submitScore`, `dataAdapter.addCoins`, `SpotlightCard`.
- Produces:
  - Playable 60 FPS Canvas Snake with speed increase, golden food, keyboard/virtual D-pad.
  - Playable Canvas Flappy Bird with pipe physics, medals, and touch taps.

- [ ] **Step 1: Write test for Snake collision and food eating logic**
```typescript
// tests/snake-logic.test.ts
import { describe, it, expect } from 'vitest';
import { checkSnakeSelfCollision, moveSnakeHead } from '../components/games/snake/snake-math';

describe('Snake Logic', () => {
  it('moves head correctly in directions', () => {
    expect(moveSnakeHead({ x: 10, y: 10 }, 'UP')).toEqual({ x: 10, y: 9 });
    expect(moveSnakeHead({ x: 10, y: 10 }, 'RIGHT')).toEqual({ x: 11, y: 10 });
  });

  it('detects self collision', () => {
    const snake = [{ x: 5, y: 5 }, { x: 5, y: 6 }, { x: 6, y: 6 }, { x: 6, y: 5 }];
    expect(checkSnakeSelfCollision({ x: 5, y: 6 }, snake)).toBe(true);
    expect(checkSnakeSelfCollision({ x: 4, y: 4 }, snake)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/snake-logic.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement Snake math, Canvas components, Flappy Bird, and pages**
Create `snake-math.ts`, `SnakeGame.tsx`, `VirtualDPad.tsx`, `FlappyGame.tsx` with full responsive touch support and high-score recording.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/snake-logic.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add components/games/snake/ components/games/flappy/ app/games/snake/ app/games/flappy/ tests/snake-logic.test.ts
git commit -m "feat: implement neon snake and cyber flappy bird with mobile touch support"
```

---

### Task 6: Multiplayer Games: Rock Paper Scissors & Neon Tic-Tac-Toe (Local & Online Realtime)

**Files:**
- Create: `components/games/rps/RpsGame.tsx`
- Create: `app/games/rps/page.tsx`
- Create: `components/games/tictactoe/TicTacToeGame.tsx`
- Create: `app/games/tictactoe/page.tsx`
- Create: `components/games/realtime/RoomLobby.tsx`
- Create: `components/games/realtime/LiveRoomChat.tsx`
- Create: `components/games/realtime/EmojiReactions.tsx`
- Test: `tests/rps-rules.test.ts`
- Test: `tests/tictactoe-rules.test.ts`

**Interfaces:**
- Consumes: `soundSynth`, `dataAdapter`, `AnimatedTabs`, `MagneticButton`.
- Produces:
  - Rock Paper Scissors with Local 2-Player (keyboard/touch blind selection) and Online Realtime Room.
  - Tic-Tac-Toe with Local Pass & Play and Online Realtime Room.
  - Live In-Room Chat and Floating Emoji Reactions.

- [ ] **Step 1: Write test for RPS outcome and TicTacToe win conditions**
```typescript
// tests/rps-rules.test.ts
import { describe, it, expect } from 'vitest';
import { determineRpsWinner } from '../components/games/rps/rps-rules';

describe('RPS Winner Rules', () => {
  it('resolves rock, paper, scissors matchups', () => {
    expect(determineRpsWinner('rock', 'scissors')).toBe('p1');
    expect(determineRpsWinner('scissors', 'paper')).toBe('p1');
    expect(determineRpsWinner('paper', 'rock')).toBe('p1');
    expect(determineRpsWinner('rock', 'rock')).toBe('draw');
    expect(determineRpsWinner('rock', 'paper')).toBe('p2');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/rps-rules.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement RPS and Tic-Tac-Toe with local & online modes, chat & emojis**
Implement `rps-rules.ts`, `tictactoe-rules.ts`, game components, room lobby with PIN generation/joining, and live emoji reactions.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/rps-rules.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add components/games/rps/ components/games/tictactoe/ components/games/realtime/ app/games/rps/ app/games/tictactoe/ tests/rps-rules.test.ts
git commit -m "feat: implement 2-player RPS and TicTacToe with local and realtime online rooms"
```

---

### Task 7: Ecosystem Features: Leaderboards, Quests/Badges, and Cosmetic Shop

**Files:**
- Create: `app/leaderboard/page.tsx`
- Create: `components/leaderboard/LeaderboardTable.tsx`
- Create: `app/quests/page.tsx`
- Create: `components/quests/QuestCard.tsx`
- Create: `app/shop/page.tsx`
- Create: `components/shop/ShopItemCard.tsx`
- Test: `tests/shop-inventory.test.ts`

**Interfaces:**
- Consumes: `dataAdapter`, `AuthContext`, `soundSynth`, `SpotlightCard`, `BorderBeam`, `ShimmerText`.
- Produces:
  - `/leaderboard`: Filterable high-score board with podium styling.
  - `/quests`: Daily quest tracker with claimable coins and EXP.
  - `/shop`: Coin exchange for snake skins, bird skins, and avatar frames.

- [ ] **Step 1: Write test for shop item purchase and inventory tracking**
```typescript
// tests/shop-inventory.test.ts
import { describe, it, expect } from 'vitest';
import { dataAdapter } from '../lib/store/data-adapter';

describe('Shop & Inventory System', () => {
  it('deducts coins and equips item upon purchase', async () => {
    const user = await dataAdapter.register('buyer', 'b@arcade.dev', 'Pass1234');
    const startCoins = user.user!.coins;

    const purchase = await dataAdapter.buyShopItem(user.user!.id, 'skin-snake-cyber', 50);
    expect(purchase.success).toBe(true);
    expect(purchase.remainingCoins).toBe(startCoins - 50);

    const inventory = await dataAdapter.getUserInventory(user.user!.id);
    expect(inventory).toContainEqual(expect.objectContaining({ item_id: 'skin-snake-cyber' }));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/shop-inventory.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement Leaderboard, Quests, and Shop pages with full logic**
Implement UI components and data methods for leaderboard queries, quest progress, and shop purchases.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/shop-inventory.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add app/leaderboard/ app/quests/ app/shop/ components/leaderboard/ components/quests/ components/shop/ tests/shop-inventory.test.ts
git commit -m "feat: implement global leaderboards, daily quests, and cosmetic skin shop"
```

---

### Task 8: Navigation, Home Page Hero & Game Grid Assembly

**Files:**
- Create: `components/layout/Navbar.tsx`
- Create: `components/layout/FloatingDock.tsx`
- Create: `components/layout/Footer.tsx`
- Create: `components/home/HeroBanner.tsx`
- Create: `components/home/GameGrid.tsx`
- Create: `app/page.tsx`
- Test: `tests/homepage.test.ts`

**Interfaces:**
- Consumes: All components from Tasks 2-7.
- Produces: Polished home page with motion-primitives spotlight cards, quick launch dock, audio mute switch, live user status, and responsive navigation.

- [ ] **Step 1: Write test for game catalog listing on homepage**
```typescript
// tests/homepage.test.ts
import { describe, it, expect } from 'vitest';
import { GAMES_CATALOG } from '../lib/constants/games';

describe('Game Catalog', () => {
  it('lists all 4 required arcade games with modes', () => {
    const ids = GAMES_CATALOG.map(g => g.id);
    expect(ids).toContain('snake');
    expect(ids).toContain('flappy');
    expect(ids).toContain('rps');
    expect(ids).toContain('tictactoe');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/homepage.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement homepage, floating dock, navbar, and catalog constants**
Assemble `GAMES_CATALOG`, `Navbar.tsx`, `FloatingDock.tsx`, `HeroBanner.tsx`, `GameGrid.tsx`, and `app/page.tsx`.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/homepage.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add components/layout/ components/home/ lib/constants/ app/page.tsx tests/homepage.test.ts
git commit -m "feat: assemble neo-arcade homepage, animated navigation, and game grid"
```

---

### Task 9: Supabase Schema, Deployment Guide & End-to-End Build Verification

**Files:**
- Create: `supabase_schema.sql`
- Create: `DEPLOYMENT_GUIDE.md`
- Create: `README.md`
- Test: `tests/build-verification.test.ts`

**Interfaces:**
- Produces: 
  - Complete, 1-click executable `supabase_schema.sql` script with RLS policies and admin seed.
  - Detailed step-by-step Vietnamese guide `DEPLOYMENT_GUIDE.md` for 100% free hosting on Vercel + Supabase.
  - Production build verification (`npm run build`).

- [ ] **Step 1: Write test validating deployment guide and SQL schema file presence**
```typescript
// tests/build-verification.test.ts
import { describe, it, expect } from 'vitest';
import fs from 'fs';

describe('Production Artifacts', () => {
  it('verifies SQL schema and deployment guide exist', () => {
    expect(fs.existsSync('supabase_schema.sql')).toBe(true);
    expect(fs.existsSync('DEPLOYMENT_GUIDE.md')).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/build-verification.test.ts`
Expected: FAIL

- [ ] **Step 3: Create `supabase_schema.sql`, `DEPLOYMENT_GUIDE.md`, and verify `npm run build`**
Write clean, error-free SQL schema with admin seed and detailed documentation with screenshots/links for Vercel and Supabase deployment.

- [ ] **Step 4: Run test and project build**
Run: `npx vitest run && npm run build`
Expected: All tests pass, build succeeds with zero errors.

- [ ] **Step 5: Commit**
```bash
git add supabase_schema.sql DEPLOYMENT_GUIDE.md README.md tests/build-verification.test.ts
git commit -m "docs: add supabase sql schema, deployment guide, and complete build verification"
```
