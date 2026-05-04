# 💬 Real-time Chat Application

## 📌 Description
Đây là ứng dụng chat realtime được xây dựng bằng Node.js và Socket.io, cho phép người dùng nhắn tin trực tiếp với nhau theo thời gian thực mà không cần reload trang.

Hệ thống hỗ trợ nhiều người dùng cùng lúc, đồng bộ tin nhắn ngay lập tức và hiển thị trạng thái online/offline của người dùng.

---

## 🛠️ Tech Stack
- Node.js
- Express.js
- Socket.io (WebSocket)
- HTML / CSS / JavaScript (Frontend)
- EJS / Pug
- MongoDB

---

## ✨ Features

### 💬 Chat realtime
- Gửi và nhận tin nhắn ngay lập tức
- Không cần reload trang

### 👥 User system
- Hiển thị danh sách người dùng online
- Trạng thái online/offline

### 📡 Socket handling
- Quản lý kết nối/disconnect
- Broadcast tin nhắn đến nhiều client

### 🎨 UI
- Giao diện đơn giản, dễ sử dụng
- Cập nhật tin nhắn theo thời gian thực

---
## ENV
PORT=your_port
MONGO_URL=your_uri
EMAIL=your_email
PASS_MAIL=your_pass
## 🚀 Installation

```bash
git clone https://github.com/your-username/chat-app.git
npm start