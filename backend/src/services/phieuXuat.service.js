// services/phieuXuat.service.js
import { db } from "../config/db.js";

export const getAll = async () => {
  const [rows] = await db.query("SELECT * FROM phieu_xuat_kho");
  return rows;
};

export const getById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM phieu_xuat_kho WHERE ma_phieu_xuat=?",
    [id]
  );
  if (rows.length === 0) throw new Error("Không tìm thấy phiếu xuất");
  return rows[0];
};

export const create = async (data) => {
  const {
    ma_phieu_xuat, ngay_xuat, ma_nhan_vien, ma_thiet_bi,
    so_luong, don_gia_xuat, thanh_tien, muc_dich_xuat, ghi_chu,
  } = data;

  if (!ma_phieu_xuat || !ngay_xuat || !ma_thiet_bi || !so_luong) {
    throw new Error("Thiếu dữ liệu bắt buộc");
  }

  await db.query(
    `INSERT INTO phieu_xuat_kho VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [ma_phieu_xuat, ngay_xuat, ma_nhan_vien, ma_thiet_bi,
     so_luong, don_gia_xuat, thanh_tien, muc_dich_xuat ?? "", ghi_chu ?? ""]
  );
  return data;
};

export const update = async (id, data) => {
  const {
    ngay_xuat, ma_nhan_vien, ma_thiet_bi,
    so_luong, don_gia_xuat, thanh_tien, muc_dich_xuat, ghi_chu,
  } = data;

  await db.query(
    `UPDATE phieu_xuat_kho SET 
      ngay_xuat=?, ma_nhan_vien=?, ma_thiet_bi=?, 
      so_luong=?, don_gia_xuat=?, thanh_tien=?, 
      muc_dich_xuat=?, ghi_chu=? 
     WHERE ma_phieu_xuat=?`,
    [ngay_xuat, ma_nhan_vien, ma_thiet_bi,
     so_luong, don_gia_xuat, thanh_tien,
     muc_dich_xuat, ghi_chu, id]
  );
  return { ...data, ma_phieu_xuat: id };
};

export const remove = async (id) => {
  await db.query("DELETE FROM phieu_xuat_kho WHERE ma_phieu_xuat=?", [id]);
  return true;
};
