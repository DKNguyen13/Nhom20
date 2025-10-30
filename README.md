# 🎓 TOEIC Master – Nền tảng luyện thi TOEIC trực tuyến (MERN Stack)

TOEIC Master là một ứng dụng web giúp người dùng **luyện thi TOEIC hiệu quả** thông qua hệ thống đề thi mô phỏng, chấm điểm tự động, thống kê tiến độ, và chatbot hỗ trợ học tập bằng AI.

---

## 🚀 Tính năng nổi bật

- 📘 **Làm bài thi TOEIC mô phỏng** (Listening & Reading)
- 🧩 **Phân tích chi tiết kết quả** – thống kê điểm theo Part, biểu đồ tiến bộ
- 💬 **Chatbot AI hỗ trợ luyện tập** (sử dụng OpenAI API)
- 🔍 **Tìm kiếm đề thi / từ vựng siêu nhanh** với Meilisearch
- 🪄 **Tự động upload & xử lý file đề thi** (Cloudinary + Mammoth)
- 🔐 **Đăng nhập / Đăng ký / Xác thực Google OAuth**
- 💾 **Lưu tiến độ học tập cá nhân** (MongoDB + Redis cache)
- 🔔 **Thông báo realtime** (Socket.io)
- 📤 **Gửi email xác thực & quên mật khẩu** (Nodemailer)

---

## 🧰 Công nghệ sử dụng

### 🖥️ Frontend
- **React 18 + Vite**
- **TailwindCSS** – UI responsive, gọn nhẹ
- **Framer Motion** – hiệu ứng mượt mà
- **React Router v7** – điều hướng client-side
- **React ChartJS 2 + Chart.js** – thống kê điểm số
- **React Toastify** – hiển thị thông báo
- **Swiper / Slick Carousel** – slide UI
- **Google OAuth + ReCaptcha** – bảo mật xác thực
- **Socket.io-client** – realtime updates

### ⚙️ Backend
- **Node.js + Express 5**
- **MongoDB (Mongoose 8)** – cơ sở dữ liệu chính
- **Redis** – cache nhanh, session management
- **JWT + Cookie-parser** – xác thực và bảo mật
- **Cloudinary + Multer + Streamifier** – upload ảnh / file
- **Meilisearch** – công cụ tìm kiếm tốc độ cao
- **Nodemailer** – gửi email xác thực
- **Bcrypt.js** – mã hóa mật khẩu
- **Moment.js** – xử lý thời gian
- **Socket.io** – realtime event

---

## ⚡ Hướng dẫn cài đặt

### Clone dự án

```bash
git clone https://github.com/<your-username>/toeic-master.git](https://github.com/DKNguyen13/Nhom20.git

### Bật redis và Meilisearch

