# Hướng Dẫn Deploy Neo-Arcade Lên Mạng Miễn Phí 100%

Tài liệu này hướng dẫn bạn cách đưa website **Neo-Arcade** lên mạng Internet để bất kỳ ai ở bất kỳ quốc gia nào cũng có thể truy cập mượt mà trên cả điện thoại và máy tính mà **không tốn một đồng chi phí nào**.

---

## 1. Tổng Quan Kiến Trúc Miễn Phí (Free Tier Tối Ưu Nhất Thị Trường)

- **Frontend & Web Hosting:** **Vercel** (Miễn phí vĩnh viễn, CDN toàn cầu cực nhanh, tự động cấp chứng chỉ bảo mật SSL HTTPS).
- **Cơ Sở Dữ Liệu & Realtime:** **Supabase** (Miễn phí 500MB PostgreSQL, 50.000 người dùng hàng tháng, máy chủ Singapore ping siêu thấp, WebSockets Realtime không bị sleep).
- **Mã Nguồn:** **GitHub** (Lưu trữ Git miễn phí).

---

## 2. Quy Trình Triển Khai 3 Bước (Chỉ Mất Khoảng 5 Phút)

### Bước 1: Tạo Database Trên Supabase (Miễn Phí)
1. Truy cập [https://supabase.com](https://supabase.com) và bấm **Sign Up** (hoặc đăng nhập bằng tài khoản GitHub/Google).
2. Chọn **New Project**:
   - **Name:** `neo-arcade`
   - **Database Password:** Đặt mật khẩu an toàn và lưu lại.
   - **Region:** Chọn `Southeast Asia (Singapore)` để có tốc độ ping thấp nhất từ Việt Nam và châu Á.
   - **Pricing Plan:** Free Tier ($0/tháng).
   - Nhấn **Create new project** (chờ khoảng 1-2 phút để Supabase khởi tạo).
3. Sau khi tạo xong:
   - Vào mục **SQL Editor** ở thanh menu bên trái.
   - Mở file `supabase_schema.sql` trong thư mục dự án này, copy toàn bộ nội dung và dán vào ô nhập lệnh của Supabase SQL Editor.
   - Bấm nút **Run** (màu xanh lá). Toàn bộ bảng, bảo mật RLS và trigger tạo người dùng sẽ được thiết lập tự động!
4. Lấy API Keys:
   - Vào **Project Settings** (biểu tượng bánh răng) $\rightarrow$ **API**.
   - Copy 2 thông số:
     - **Project URL** (ví dụ: `https://xyzcompany.supabase.co`)
     - **anon / public key** (chuỗi ký tự dài bắt đầu bằng `eyJ...`)

---

### Bước 2: Đẩy Code Lên GitHub
1. Mở terminal tại thư mục dự án `test`:
```bash
git add .
git commit -m "feat: complete neo-arcade platform"
```
2. Truy cập [https://github.com](https://github.com) $\rightarrow$ Bấm **New Repository** $\rightarrow$ Đặt tên repo (ví dụ: `neo-arcade`).
3. Đẩy code lên GitHub bằng các lệnh được gợi ý:
```bash
git remote add origin https://github.com/<tai-khoan-cua-ban>/neo-arcade.git
git branch -M main
git push -u origin main
```

---

### Bước 3: Deploy Lên Vercel (1 Click)
1. Truy cập [https://vercel.com](https://vercel.com) và đăng nhập bằng tài khoản GitHub của bạn.
2. Tại trang Dashboard, chọn **Add New...** $\rightarrow$ **Project**.
3. Tìm repository `neo-arcade` vừa tạo trên GitHub và nhấn **Import**.
4. Tại mục **Environment Variables** (Biến môi trường), thêm 2 biến sau:
   - `NEXT_PUBLIC_SUPABASE_URL` = `<Dán Project URL lấy ở Bước 1>`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `<Dán anon public key lấy ở Bước 1>`
5. Bấm nút **Deploy**!
6. Chờ khoảng 60 giây, Vercel sẽ tự động build và cung cấp cho bạn một đường link chính thức:
   `https://neo-arcade-<ten-ban>.vercel.app`

---

## 3. Cách Gắn Tên Miền Riêng Miễn Phí (Tùy Chọn)
- Nếu bạn có sẵn tên miền riêng (ví dụ: `gamearcade.com` hoặc tên miền `.is-a.dev` miễn phí):
  - Vào Vercel $\rightarrow$ Chọn Project `neo-arcade` $\rightarrow$ **Settings** $\rightarrow$ **Domains**.
  - Nhập tên miền của bạn và cấu hình DNS CNAME theo hướng dẫn của Vercel.
  - Vercel sẽ tự động cấp chứng chỉ SSL HTTPS miễn phí cho tên miền riêng của bạn trong vòng vài phút.

---

## 4. Chế Độ Chạy Offline / Zero-Friction Khi Chưa Cấu Hình Supabase
Website được tích hợp sẵn cơ chế **Zero-Friction Fallback**:
- Nếu bạn chạy trên máy tính (`npm run dev`) mà chưa điền Supabase key: hệ thống sẽ tự động chuyển sang lưu tạm thời trên trình duyệt (LocalStorage & BroadcastChannel).
- Bạn có thể đăng nhập ngay bằng tài khoản Admin mẫu:
  - **Email:** `admin@arcade.dev`
  - **Mật khẩu:** `Admin@123456`
- Bạn có thể thử nghiệm tính năng Khóa tài khoản (Ban user), chơi thử 4 game, bảng xếp hạng và mua đồ trong Shop ngay lập tức mà không gặp bất kỳ lỗi nào!
