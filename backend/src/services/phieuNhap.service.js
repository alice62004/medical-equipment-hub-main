// services/phieuNhap.service.js
import { db } from "../config/db.js";

export const getAll = async () => {
  const [rows] = await db.query("SELECT * FROM phieu_nhap_kho");
  return rows;
};

export const getById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM phieu_nhap_kho WHERE ma_phieu_nhap=?",
    [id]
  );
  if (rows.length === 0) throw new Error("Không tìm thấy phiếu nhập");
  return rows[0];
};

export const create = async (data) => {
  const {
    ma_phieu_nhap, ngay_nhap, ma_nhan_vien, ma_nha_cung_cap,
    ma_thiet_bi, so_luong, don_gia_nhap, thanh_tien, han_su_dung, ghi_chu,
  } = data;

  if (!ma_phieu_nhap || !ngay_nhap || !ma_thiet_bi || !so_luong) {
    throw new Error("Thiếu dữ liệu bắt buộc");
  }

  await db.query(
    `INSERT INTO phieu_nhap_kho VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [ma_phieu_nhap, ngay_nhap, ma_nhan_vien, ma_nha_cung_cap,
     ma_thiet_bi, so_luong, don_gia_nhap, thanh_tien, han_su_dung, ghi_chu ?? ""]
  );
  return data;
};

export const update = async (id, data) => {
  const {
    ngay_nhap, ma_nhan_vien, ma_nha_cung_cap,
    ma_thiet_bi, so_luong, don_gia_nhap, thanh_tien, han_su_dung, ghi_chu,
  } = data;

  await db.query(
    `UPDATE phieu_nhap_kho SET 
      ngay_nhap=?, ma_nhan_vien=?, ma_nha_cung_cap=?, 
      ma_thiet_bi=?, so_luong=?, don_gia_nhap=?, 
      thanh_tien=?, han_su_dung=?, ghi_chu=? 
     WHERE ma_phieu_nhap=?`,
    [ngay_nhap, ma_nhan_vien, ma_nha_cung_cap,
     ma_thiet_bi, so_luong, don_gia_nhap,
     thanh_tien, han_su_dung, ghi_chu, id]
  );
  return { ...data, ma_phieu_nhap: id };
};

export const remove = async (id) => {
  await db.query("DELETE FROM phieu_nhap_kho WHERE ma_phieu_nhap=?", [id]);
  return true;
};
