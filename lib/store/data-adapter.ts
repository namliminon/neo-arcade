import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
  role: 'user' | 'admin';
  is_banned: boolean;
  ban_reason?: string;
  coins: number;
  exp: number;
  level: number;
  created_at: string;
}

export interface ScoreRecord {
  id: string;
  user_id: string;
  username: string;
  game_type: 'snake' | 'flappy' | 'rps' | 'tictactoe';
  score: number;
  created_at: string;
}

export interface UserInventoryItem {
  id: string;
  user_id: string;
  item_id: string;
  item_type: string;
  is_equipped: boolean;
  purchased_at: string;
}

export interface AuthResponse {
  user?: UserProfile;
  error?: string;
  banReason?: string;
}

const DEFAULT_ADMIN: UserProfile = {
  id: 'admin-seed-001',
  username: 'admin',
  email: 'admin@arcade.dev',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'admin',
  is_banned: false,
  ban_reason: '',
  coins: 9999,
  exp: 4500,
  level: 10,
  created_at: new Date().toISOString(),
};

const INITIAL_USERS: UserProfile[] = [
  DEFAULT_ADMIN,
  {
    id: 'user-seed-002',
    username: 'cyber_ninja',
    email: 'ninja@arcade.dev',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    is_banned: false,
    ban_reason: '',
    coins: 350,
    exp: 820,
    level: 3,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'user-seed-003',
    username: 'neon_rider',
    email: 'rider@arcade.dev',
    avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    is_banned: false,
    ban_reason: '',
    coins: 180,
    exp: 410,
    level: 2,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: 'user-seed-004',
    username: 'cheater_bot',
    email: 'banned@arcade.dev',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    is_banned: true,
    ban_reason: 'Gian lận điểm số trong game Rắn',
    coins: 0,
    exp: 0,
    level: 1,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
];

class DataAdapter {
  private mockUsers: UserProfile[] = [...INITIAL_USERS];
  private mockPasswords: Record<string, string> = {
    'admin@arcade.dev': 'Admin@123456',
    'ninja@arcade.dev': 'Pass1234',
    'rider@arcade.dev': 'Pass1234',
    'banned@arcade.dev': 'Pass1234',
  };
  private currentMockUser: UserProfile | null = null;
  private mockScores: ScoreRecord[] = [
    { id: 'sc-1', user_id: 'user-seed-002', username: 'cyber_ninja', game_type: 'snake', score: 1420, created_at: new Date().toISOString() },
    { id: 'sc-2', user_id: 'admin-seed-001', username: 'admin', game_type: 'snake', score: 980, created_at: new Date().toISOString() },
    { id: 'sc-3', user_id: 'user-seed-003', username: 'neon_rider', game_type: 'snake', score: 650, created_at: new Date().toISOString() },
    { id: 'sc-4', user_id: 'user-seed-002', username: 'cyber_ninja', game_type: 'flappy', score: 48, created_at: new Date().toISOString() },
    { id: 'sc-5', user_id: 'admin-seed-001', username: 'admin', game_type: 'flappy', score: 35, created_at: new Date().toISOString() },
    { id: 'sc-6', user_id: 'user-seed-003', username: 'neon_rider', game_type: 'rps', score: 12, created_at: new Date().toISOString() },
    { id: 'sc-7', user_id: 'user-seed-002', username: 'cyber_ninja', game_type: 'tictactoe', score: 15, created_at: new Date().toISOString() },
  ];
  private mockInventory: UserInventoryItem[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const savedUsers = localStorage.getItem('neo_arcade_users');
      if (savedUsers) {
        this.mockUsers = JSON.parse(savedUsers);
      }
      const savedCur = localStorage.getItem('neo_arcade_current_user');
      if (savedCur) {
        this.currentMockUser = JSON.parse(savedCur);
      }
      const savedScores = localStorage.getItem('neo_arcade_scores');
      if (savedScores) {
        this.mockScores = JSON.parse(savedScores);
      }
      const savedInv = localStorage.getItem('neo_arcade_inventory');
      if (savedInv) {
        this.mockInventory = JSON.parse(savedInv);
      }
    } catch {
      // Ignore localStorage errors
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('neo_arcade_users', JSON.stringify(this.mockUsers));
      if (this.currentMockUser) {
        localStorage.setItem('neo_arcade_current_user', JSON.stringify(this.currentMockUser));
      } else {
        localStorage.removeItem('neo_arcade_current_user');
      }
      localStorage.setItem('neo_arcade_scores', JSON.stringify(this.mockScores));
      localStorage.setItem('neo_arcade_inventory', JSON.stringify(this.mockInventory));
    } catch {
      // Ignore
    }
  }

  public resetMockState(): void {
    this.mockUsers = JSON.parse(JSON.stringify(INITIAL_USERS));
    this.mockPasswords = {
      'admin@arcade.dev': 'Admin@123456',
      'ninja@arcade.dev': 'Pass1234',
      'rider@arcade.dev': 'Pass1234',
      'banned@arcade.dev': 'Pass1234',
    };
    this.currentMockUser = null;
    this.mockScores = [];
    this.mockInventory = [];
    this.saveToStorage();
  }

  // Auth Operations
  public async login(email: string, pass: string): Promise<AuthResponse> {
    const trimmedEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: pass,
        });
        if (error) return { error: error.message };

        // Check profiles table for ban status
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile?.is_banned) {
          await supabase.auth.signOut();
          return {
            error: `Tài khoản của bạn đã bị khóa. Lý do: ${profile.ban_reason || 'Vi phạm điều khoản'}`,
            banReason: profile.ban_reason,
          };
        }

        const userProfile: UserProfile = {
          id: profile?.id || data.user.id,
          username: profile?.username || trimmedEmail.split('@')[0],
          email: trimmedEmail,
          avatar_url: profile?.avatar_url || '',
          role: profile?.role || 'user',
          is_banned: false,
          coins: profile?.coins ?? 100,
          exp: profile?.exp ?? 0,
          level: profile?.level ?? 1,
          created_at: profile?.created_at || new Date().toISOString(),
        };
        return { user: userProfile };
      } catch (err: unknown) {
        return { error: (err as Error).message };
      }
    }

    // Local Mock Fallback
    const user = this.mockUsers.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (!user) {
      return { error: 'Không tìm thấy tài khoản với email này.' };
    }

    const expectedPass = this.mockPasswords[trimmedEmail] || 'Pass1234';
    if (pass !== expectedPass) {
      return { error: 'Mật khẩu không chính xác.' };
    }

    if (user.is_banned) {
      return {
        error: `Tài khoản của bạn đã bị khóa. Lý do: ${user.ban_reason || 'Vi phạm nội quy'}`,
        banReason: user.ban_reason,
      };
    }

    this.currentMockUser = user;
    this.saveToStorage();
    return { user };
  }

  public async register(username: string, email: string, pass: string): Promise<AuthResponse> {
    const cleanUser = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: pass,
          options: {
            data: { username: cleanUser },
          },
        });
        if (error) return { error: error.message };
        if (!data.user) return { error: 'Không thể tạo tài khoản.' };

        const newProfile: UserProfile = {
          id: data.user.id,
          username: cleanUser,
          email: cleanEmail,
          avatar_url: '',
          role: 'user',
          is_banned: false,
          coins: 100,
          exp: 0,
          level: 1,
          created_at: new Date().toISOString(),
        };
        return { user: newProfile };
      } catch (err: unknown) {
        return { error: (err as Error).message };
      }
    }

    // Local Mock Fallback
    if (this.mockUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { error: 'Email này đã được sử dụng.' };
    }
    if (this.mockUsers.some((u) => u.username.toLowerCase() === cleanUser.toLowerCase())) {
      return { error: 'Tên người dùng này đã tồn tại.' };
    }

    const newUser: UserProfile = {
      id: `mock-user-${Date.now()}`,
      username: cleanUser,
      email: cleanEmail,
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUser}`,
      role: 'user',
      is_banned: false,
      ban_reason: '',
      coins: 100,
      exp: 0,
      level: 1,
      created_at: new Date().toISOString(),
    };

    this.mockUsers.push(newUser);
    this.mockPasswords[cleanEmail] = pass;
    this.currentMockUser = newUser;
    this.saveToStorage();
    return { user: newUser };
  }

  public async logout(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    this.currentMockUser = null;
    this.saveToStorage();
  }

  public getCurrentUser(): UserProfile | null {
    return this.currentMockUser;
  }

  public async getAllUsers(): Promise<UserProfile[]> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (data) return data as UserProfile[];
    }
    return [...this.mockUsers];
  }

  // Moderation / Ban Operation
  public async setUserBanStatus(userId: string, isBanned: boolean, reason: string = ''): Promise<UserProfile> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from('profiles')
        .update({ is_banned: isBanned, ban_reason: reason })
        .eq('id', userId)
        .select()
        .single();
      if (data) return data as UserProfile;
    }

    const idx = this.mockUsers.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error('User not found');
    this.mockUsers[idx].is_banned = isBanned;
    this.mockUsers[idx].ban_reason = isBanned ? reason : '';

    if (this.currentMockUser && this.currentMockUser.id === userId) {
      this.currentMockUser.is_banned = isBanned;
      this.currentMockUser.ban_reason = isBanned ? reason : '';
    }

    this.saveToStorage();
    return this.mockUsers[idx];
  }

  // Scores & Leaderboards
  public async submitScore(userId: string, username: string, gameType: 'snake' | 'flappy' | 'rps' | 'tictactoe', score: number): Promise<void> {
    const record: ScoreRecord = {
      id: `score-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      user_id: userId,
      username,
      game_type: gameType,
      score,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      await supabase.from('scores').insert(record);
      return;
    }

    this.mockScores.push(record);
    this.saveToStorage();
  }

  public async getLeaderboard(gameType?: 'snake' | 'flappy' | 'rps' | 'tictactoe'): Promise<ScoreRecord[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('scores').select('*').order('score', { ascending: false }).limit(20);
      if (gameType) {
        query = query.eq('game_type', gameType);
      }
      const { data } = await query;
      if (data) return data as ScoreRecord[];
    }

    let list = [...this.mockScores];
    if (gameType) {
      list = list.filter((s) => s.game_type === gameType);
    }
    return list.sort((a, b) => b.score - a.score).slice(0, 20);
  }

  // Coins & Leveling
  public async addCoins(userId: string, amount: number): Promise<number> {
    const user = this.mockUsers.find((u) => u.id === userId);
    if (!user) return 0;
    user.coins = Math.max(0, user.coins + amount);
    user.exp += Math.abs(amount) * 2;
    user.level = Math.floor(user.exp / 250) + 1;
    if (this.currentMockUser?.id === userId) {
      this.currentMockUser.coins = user.coins;
      this.currentMockUser.exp = user.exp;
      this.currentMockUser.level = user.level;
    }
    this.saveToStorage();
    return user.coins;
  }

  // Shop & Inventory
  public async buyShopItem(userId: string, itemId: string, price: number): Promise<{ success: boolean; remainingCoins: number; error?: string }> {
    const user = this.mockUsers.find((u) => u.id === userId);
    if (!user) return { success: false, remainingCoins: 0, error: 'Người dùng không tồn tại' };

    if (user.coins < price) {
      return { success: false, remainingCoins: user.coins, error: 'Không đủ xu để mua vật phẩm này' };
    }

    user.coins -= price;
    const invItem: UserInventoryItem = {
      id: `inv-${Date.now()}`,
      user_id: userId,
      item_id: itemId,
      item_type: itemId.split('-')[1] || 'skin',
      is_equipped: true,
      purchased_at: new Date().toISOString(),
    };

    this.mockInventory.push(invItem);
    this.saveToStorage();
    return { success: true, remainingCoins: user.coins };
  }

  public async getUserInventory(userId: string): Promise<UserInventoryItem[]> {
    return this.mockInventory.filter((i) => i.user_id === userId);
  }
}

export const dataAdapter = new DataAdapter();
