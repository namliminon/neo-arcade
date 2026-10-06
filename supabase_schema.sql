-- ==============================================================================
-- NEO-ARCADE PLATFORM - SUPABASE DATABASE INITIALIZATION SCRIPT
-- Hướng dẫn: Copy và dán toàn bộ file này vào Supabase SQL Editor rồi nhấn "Run"
-- ==============================================================================

-- 1. TẠO BẢNG HỒ SƠ NGƯỜI DÙNG (PROFILES)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255),
  avatar_url TEXT DEFAULT '',
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_banned BOOLEAN DEFAULT false,
  ban_reason TEXT DEFAULT '',
  coins INTEGER DEFAULT 100,
  exp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TẠO BẢNG ĐIỂM SỐ & BẢNG XẾP HẠNG (SCORES)
CREATE TABLE IF NOT EXISTS scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  username VARCHAR(50) NOT NULL,
  game_type VARCHAR(30) NOT NULL CHECK (game_type IN ('snake', 'flappy', 'rps', 'tictactoe')),
  score INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TẠO BẢNG PHÒNG ĐẤU REALTIME MULTIPLAYER (GAME_ROOMS)
CREATE TABLE IF NOT EXISTS game_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code VARCHAR(10) UNIQUE NOT NULL,
  game_type VARCHAR(30) NOT NULL,
  host_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  guest_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished')),
  game_state JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TẠO BẢNG TÚI ĐỒ & VẬT PHẨM (USER_INVENTORY)
CREATE TABLE IF NOT EXISTS user_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  item_id VARCHAR(50) NOT NULL,
  item_type VARCHAR(30) NOT NULL,
  is_equipped BOOLEAN DEFAULT false,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

-- 5. BẬT BẢO MẬT HÀNG (ROW LEVEL SECURITY - RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_inventory ENABLE ROW LEVEL SECURITY;

-- 6. THIẾT LẬP CHÍNH SÁCH BẢO MẬT (POLICIES)
-- Mọi người đều có thể xem bảng xếp hạng và hồ sơ công khai
CREATE POLICY "Public profiles are viewable by everyone." 
  ON profiles FOR SELECT USING (true);

-- Người dùng có thể cập nhật thông tin cá nhân của mình
CREATE POLICY "Users can update their own profile." 
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Quản trị viên (Admin) có toàn quyền cập nhật (khóa tài khoản) mọi người dùng
CREATE POLICY "Admins can update any profile." 
  ON profiles FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Mọi người đều có thể xem bảng điểm
CREATE POLICY "Scores are viewable by everyone." 
  ON scores FOR SELECT USING (true);

-- Người dùng đăng nhập có thể ghi điểm số
CREATE POLICY "Authenticated users can insert scores." 
  ON scores FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Phòng đấu công khai
CREATE POLICY "Rooms viewable by everyone" 
  ON game_rooms FOR ALL USING (true);

-- Túi đồ thuộc về chủ nhân
CREATE POLICY "User inventory is viewable by owner" 
  ON user_inventory FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "User can insert into inventory" 
  ON user_inventory FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. TỰ ĐỘNG TẠO PROFILE KHI ĐĂNG KÝ TÀI KHOẢN MỚI
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, avatar_url, role, coins)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email,
    'https://api.dicebear.com/7.x/bottts/svg?seed=' || new.id,
    'user',
    100
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- BẬT REALTIME CHO GAME ROOMS & SCORES
ALTER PUBLICATION supabase_realtime ADD TABLE game_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE scores;
