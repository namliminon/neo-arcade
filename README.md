# Neo-Arcade | Modern Global Web Gaming Hub

Nền tảng trò chơi web arcade đa thiết bị toàn cầu, kết hợp các hiệu ứng chuyển động mượt mà phong cách `motion-primitives`, hệ thống phân quyền tài khoản (User & Admin kèm tính năng khóa tài khoản có lý do), 4 tựa game cuốn hút và 5 tính năng mở rộng.

## ✨ Tính Năng Nổi Bật

1. **Giao Diện Neo-Arcade Cao Cấp**:
   - Hiệu ứng quầng sáng chuột Spotlight Cards (`@/components/motion/SpotlightCard`).
   - Nút nam châm hút chuột Magnetic Buttons (`@/components/motion/MagneticButton`).
   - Tab trượt mượt mà Animated Tabs (`@/components/motion/AnimatedTabs`).
   - Viền chạy tia sáng Border Beam & Chữ phát sáng Shimmer Text.
   - Modal bật nảy Spring Dialogs với phông nền mờ ảo Glassmorphism.
2. **Kho Game Hấp Dẫn**:
   - 🐍 **Rắn Săn Mồi Retro**: Đồ họa canvas neon 60 FPS, tăng tốc độ, táo vàng nhân điểm, hỗ trợ D-Pad ảo trên mobile.
   - 🐥 **Cyber Flappy Bird**: Vật lý bay chân thực, cột laser neon, bảng tính điểm và huy chương.
   - ✌️ **Oản Tù Tì Đấu Trường**: Hỗ trợ chơi 2 người trên cùng 1 máy hoặc tạo phòng đấu Online Realtime.
   - ❌ **Cờ Ca-rô Neon**: Nối 3 ô thẳng hàng, hỗ trợ 2 người chơi cùng máy hoặc qua mã PIN Online.
3. **5 Tính Năng Mở Rộng**:
   - 🏆 **Bảng Xếp Hạng Toàn Cầu**: Bục vinh danh Top 3 mạ vàng và danh sách kỷ lục theo từng game.
   - 🎯 **Nhiệm Vụ Hàng Ngày & Huy Hiệu**: Hoàn thành nhiệm vụ nhận xu và cày cấp.
   - 🛍️ **Cửa Hàng Skin**: Mua skin rắn, chim và khung avatar bằng xu kiếm được từ game.
   - 💬 **Phòng Đấu Trực Tuyến & Thả Biểu Cảm**: Live Chat trong phòng và nút bấm thả Emoji nổ màn hình đối thủ.
   - 🔊 **Bộ Tổng Hợp Âm Thanh 8-Bit Web Audio**: Tự tạo hiệu ứng âm thanh arcade tức thì, không cần tải file ngoài.
4. **Phân Quyền & Quản Trị**:
   - Tài khoản Admin có bảng điều khiển riêng (`/admin`) xem thống kê và khóa tài khoản vi phạm kèm lý do.
   - Tài khoản bị khóa sẽ bị chặn đăng nhập và ngắt phiên ngay lập tức với modal cảnh báo.

## 🚀 Chạy Cục Bộ (Local Development)

```bash
# Cài đặt gói thư viện
npm install

# Khởi chạy máy chủ phát triển
npm run dev

# Chạy kiểm thử tự động
npm test
```

Mở trình duyệt tại [http://localhost:3000](http://localhost:3000).

## 🌐 Triển Khai Miễn Phí Lên Mạng
Xem hướng dẫn chi tiết từng bước tại file [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).
