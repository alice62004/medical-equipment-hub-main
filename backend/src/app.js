import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";

// Import routes
import thietBiRouter from "./routes/thietBi.route.js";
import nguoiDungRouter from "./routes/nguoiDung.route.js";
import khoaRouter from "./routes/khoa.route.js";
import nhanVienRouter from "./routes/nhanVien.route.js";
import nhaCungCapRouter from "./routes/nhaCungCap.route.js";
import phieuNhapRouter from "./routes/phieuNhap.route.js";
import phieuXuatRouter from "./routes/phieuXuat.route.js";
import capPhatRouter from "./routes/capPhat.route.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Trang chủ API
app.get("/", (req, res) => {
  res.json({
    message: "Chào mừng đến với API Hệ thống Quản lý Thiết bị Y tế",
    status: "running",
    endpoints: [
      "/test",
      "/thietbi",
      "/nguoidung",
      "/khoa",
      "/nhanvien",
      "/nhacungcap",
      "/phieunhap",
      "/phieuxuat",
      "/capphat"
    ]
  });
});

// Health check
app.get("/test", async (req, res) => {
  const { db } = await import("./config/db.js");
  const [rows] = await db.query("SELECT 1");
  res.json({ status: "ok", db: rows });
});

// Routes
app.use("/thietbi",     thietBiRouter);
app.use("/nguoidung",   nguoiDungRouter);
app.use("/khoa",        khoaRouter);
app.use("/nhanvien",    nhanVienRouter);
app.use("/nhacungcap",  nhaCungCapRouter);
app.use("/phieunhap",   phieuNhapRouter);
app.use("/phieuxuat",   phieuXuatRouter);
app.use("/capphat",     capPhatRouter);

// Global error handler (phải đặt sau routes)
app.use(errorHandler);

export default app;
