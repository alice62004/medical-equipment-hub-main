# Hệ thống Quản lý Thiết bị Y tế

Ứng dụng quản lý vật tư thiết bị y tế xây dựng bằng **React + Vite + TypeScript** (Frontend) và **Node.js + Express + MySQL** (Backend).

## Cấu trúc dự án

```
medical-equipment-hub-main/
├── backend/                    ← Node.js API Server
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           ← Kết nối MySQL (pool)
│   │   ├── routes/             ← 8 route modules
│   │   │   ├── thietBi.route.js
│   │   │   ├── nguoiDung.route.js
│   │   │   ├── khoa.route.js
│   │   │   ├── nhanVien.route.js
│   │   │   ├── nhaCungCap.route.js
│   │   │   ├── phieuNhap.route.js
│   │   │   ├── phieuXuat.route.js
│   │   │   └── capPhat.route.js
│   │   ├── controllers/        ← Xử lý request/response
│   │   ├── services/           ← Business logic & DB queries
│   │   ├── middlewares/
│   │   │   └── errorHandler.js ← Global error handler
│   │   ├── app.js              ← Cấu hình Express + routes
│   │   └── server.js           ← Khởi động server
│   ├── tests/
│   │   └── thietBi.service.test.js
│   ├── .env                    ← Biến môi trường (không commit)
│   ├── .env.example
│   └── package.json
│
└── src/                        ← React Frontend (Vite)
    ├── components/             ← UI components & layout
    ├── context/
    │   └── AuthContext.tsx     ← Authentication context
    ├── hooks/                  ← Custom React hooks
    ├── lib/                    ← Tiện ích lõi (auth, store, utils)
    ├── pages/                  ← 15 trang ứng dụng
    ├── services/
    │   └── store.ts            ← Local store (localStorage)
    ├── types/
    │   └── index.ts            ← TypeScript interfaces
    └── utils/
        └── utils.ts            ← Hàm tiện ích
```

## Cài đặt & Chạy

### Backend

```bash
cd backend
npm install
npm run dev    # Development (auto-reload với node --watch)
npm start      # Production
```

Server chạy tại: **http://localhost:3000**

> Cập nhật thông tin database trong file `backend/.env`

### Frontend

```bash
# (ở thư mục medical-equipment-hub-main)
npm install
npm run dev
```

App chạy tại: **http://localhost:8080**

## API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET/POST/PUT/DELETE | `/thietbi[/:id]` | Thiết bị y tế |
| GET/POST/PUT/DELETE | `/nguoidung[/:id]` | Người dùng |
| GET/POST/PUT/DELETE | `/khoa[/:id]` | Khoa phòng |
| GET/PUT/DELETE | `/nhanvien/:id` | Nhân viên |
| GET/POST/PUT/DELETE | `/nhacungcap[/:id]` | Nhà cung cấp |
| GET/POST/PUT/DELETE | `/phieunhap[/:id]` | Phiếu nhập kho |
| GET/POST/PUT/DELETE | `/phieuxuat[/:id]` | Phiếu xuất kho |
| GET/POST/PUT/DELETE | `/capphat[/:id]` | Cấp phát thiết bị |
| GET | `/test` | Health check kết nối DB |

## Tài khoản demo

| Email | Mật khẩu | Quyền |
|-------|----------|-------|
| admin@hospital.vn | admin123 | Quản trị viên |
| kho@hospital.vn | kho123 | Nhân viên kho |
| quanly@hospital.vn | quanly123 | Quản lý |

## Công nghệ sử dụng

**Frontend:** React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, React Router, TanStack Query, Recharts

**Backend:** Node.js, Express 5, MySQL2, dotenv, CORS

**Database:** MySQL (schema: `qlvt_hospital`)
