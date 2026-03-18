// services/capPhat.service.js
import { db } from "../config/db.js";

export const getAll = async () => {
  const [rows] = await db.query("SELECT * FROM phieu_cap_phat");
  return rows;
};

export const getById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM phieu_cap_phat WHERE ma_cap_phat=?",
    [id]
  );
  if (rows.length === 0) throw new Error("Không tìm thấy phiếu cấp phát");
  return rows[0];
};

export const create = async (data) => {
  const {
    ma_cap_phat, ma_thiet_bi, so_luong, ma_nhan_vien,
    nguoi_nhan, ma_khoa, ngay_cap_phat, ngay_tra_du_kien,
    ngay_tra_thuc_te, trang_thai,
  } = data;

  if (!ma_cap_phat || !ma_thiet_bi || !so_luong) {
    throw new Error("Thiếu dữ liệu bắt buộc");
  }

  await db.query(
    `INSERT INTO phieu_cap_phat VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [ma_cap_phat, ma_thiet_bi, so_luong, ma_nhan_vien,
     nguoi_nhan, ma_khoa, ngay_cap_phat, ngay_tra_du_kien,
     ngay_tra_thuc_te ?? null, trang_thai ?? "DANG_SU_DUNG"]
  );
  return data;
};

export const update = async (id, data) => {
  const {
    ma_thiet_bi, so_luong, ma_nhan_vien, nguoi_nhan,
    ma_khoa, ngay_cap_phat, ngay_tra_du_kien,
    ngay_tra_thuc_te, trang_thai,
  } = data;

  await db.query(
    `UPDATE phieu_cap_phat SET 
      ma_thiet_bi=?, so_luong=?, ma_nhan_vien=?, nguoi_nhan=?,
      ma_khoa=?, ngay_cap_phat=?, ngay_tra_du_kien=?,
      ngay_tra_thuc_te=?, trang_thai=?
     WHERE ma_cap_phat=?`,
    [ma_thiet_bi, so_luong, ma_nhan_vien, nguoi_nhan,
     ma_khoa, ngay_cap_phat, ngay_tra_du_kien,
     ngay_tra_thuc_te, trang_thai, id]
  );
  return { ...data, ma_cap_phat: id };
};

export const remove = async (id) => {
  await db.query("DELETE FROM phieu_cap_phat WHERE ma_cap_phat=?", [id]);
  return true;
};
