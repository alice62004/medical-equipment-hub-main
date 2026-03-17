import express from "express";
import cors from "cors";
import { db } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

/* ================= TEST ================= */
app.get("/test", async (req, res) => {
  const [rows] = await db.query("SELECT 1");
  res.json(rows);
});

/* ================= NGUOI DUNG ================= */
app.get("/nguoidung", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM nguoi_dung");
  res.json(rows);
});

app.post("/nguoidung", async (req, res) => {
  const { id, email, mat_khau, ho_ten, vai_tro } = req.body;
  await db.query(
    `INSERT INTO nguoi_dung VALUES (?, ?, ?, ?, ?, 1, 0)`,
    [id, email, mat_khau, ho_ten, vai_tro]
  );
  res.json({ message: "OK" });
});

/* ================= THIET BI ================= */
app.get("/thietbi/:id", async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM thiet_bi WHERE ma_thiet_bi=?",
    [req.params.id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "Không tìm thấy" });
  }

  res.json(rows[0]);
});

app.post("/thietbi", async (req, res) => {
  const { ma_thiet_bi, ten_thiet_bi, don_vi_tinh, ghi_chu } = req.body;

  await db.query(
    `INSERT INTO thiet_bi VALUES (?, ?, ?, ?)`,
    [ma_thiet_bi, ten_thiet_bi, don_vi_tinh, ghi_chu]
  );

  res.json({ message: "Thêm OK" });
});

app.put("/thietbi/:id", async (req, res) => {
  const { ten_thiet_bi, don_vi_tinh, ghi_chu } = req.body;

  await db.query(
    `UPDATE thiet_bi 
     SET ten_thiet_bi=?, don_vi_tinh=?, ghi_chu=? 
     WHERE ma_thiet_bi=?`,
    [ten_thiet_bi, don_vi_tinh, ghi_chu, req.params.id]
  );

  res.json({ message: "Cập nhật OK" });
});

app.delete("/thietbi/:id", async (req, res) => {
  await db.query("DELETE FROM thiet_bi WHERE ma_thiet_bi=?", [
    req.params.id,
  ]);
  res.json({ message: "Xoá OK" });
});

/* ================= KHOA ================= */
app.get("/khoa", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM khoa");
  res.json(rows);
});

app.post("/khoa", async (req, res) => {
  const { ma_khoa, ten_khoa } = req.body;
  await db.query(`INSERT INTO khoa VALUES (?, ?)`, [ma_khoa, ten_khoa]);
  res.json({ message: "OK" });
});

/* ================= NHAN VIEN ================= */
app.get("/nhanvien", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM nhan_vien");
  res.json(rows);
});

app.post("/nhanvien", async (req, res) => {
  const { ma_nv, ten_nv, chuc_vu, so_dien_thoai, email } = req.body;

  await db.query(
    `INSERT INTO nhan_vien VALUES (?, ?, ?, ?, ?)`,
    [ma_nv, ten_nv, chuc_vu, so_dien_thoai, email]
  );

  res.json({ message: "OK" });
});

/* ================= NHA CUNG CAP ================= */
app.get("/nhacungcap", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM nha_cung_cap");
  res.json(rows);
});

app.post("/nhacungcap", async (req, res) => {
  const { ma_ncc, ten_ncc, so_dien_thoai, email } = req.body;

  await db.query(
    `INSERT INTO nha_cung_cap VALUES (?, ?, ?, ?)`,
    [ma_ncc, ten_ncc, so_dien_thoai, email]
  );

  res.json({ message: "OK" });
});

/* ================= PHIEU NHAP ================= */
app.get("/phieunhap", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM phieu_nhap_kho");
  res.json(rows);
});

app.post("/phieunhap", async (req, res) => {
  const {
    ma_phieu_nhap,
    ngay_nhap,
    ma_nhan_vien,
    ma_nha_cung_cap,
    ma_thiet_bi,
    so_luong,
    don_gia_nhap,
    thanh_tien,
    han_su_dung,
    ghi_chu,
  } = req.body;

  await db.query(
    `INSERT INTO phieu_nhap_kho VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ma_phieu_nhap,
      ngay_nhap,
      ma_nhan_vien,
      ma_nha_cung_cap,
      ma_thiet_bi,
      so_luong,
      don_gia_nhap,
      thanh_tien,
      han_su_dung,
      ghi_chu,
    ]
  );

  res.json({ message: "OK" });
});

/* ================= PHIEU XUAT ================= */
app.get("/phieuxuat", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM phieu_xuat_kho");
  res.json(rows);
});

app.post("/phieuxuat", async (req, res) => {
  const {
    ma_phieu_xuat,
    ngay_xuat,
    ma_nhan_vien,
    ma_thiet_bi,
    so_luong,
    don_gia_xuat,
    thanh_tien,
    muc_dich_xuat,
    ghi_chu,
  } = req.body;

  await db.query(
    `INSERT INTO phieu_xuat_kho VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ma_phieu_xuat,
      ngay_xuat,
      ma_nhan_vien,
      ma_thiet_bi,
      so_luong,
      don_gia_xuat,
      thanh_tien,
      muc_dich_xuat,
      ghi_chu,
    ]
  );

  res.json({ message: "OK" });
});

/* ================= CAP PHAT ================= */
app.get("/capphat", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM phieu_cap_phat");
  res.json(rows);
});

app.post("/capphat", async (req, res) => {
  const {
    ma_cap_phat,
    ma_thiet_bi,
    so_luong,
    ma_nhan_vien,
    nguoi_nhan,
    ma_khoa,
    ngay_cap_phat,
    ngay_tra_du_kien,
    ngay_tra_thuc_te,
    trang_thai,
  } = req.body;

  await db.query(
    `INSERT INTO phieu_cap_phat VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ma_cap_phat,
      ma_thiet_bi,
      so_luong,
      ma_nhan_vien,
      nguoi_nhan,
      ma_khoa,
      ngay_cap_phat,
      ngay_tra_du_kien,
      ngay_tra_thuc_te,
      trang_thai,
    ]
  );

  res.json({ message: "OK" });
});

/* ================= START ================= */
app.listen(3000, () => {
  console.log("Server chạy ở http://localhost:3000");
});