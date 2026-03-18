// services/nhaCungCap.service.js
import { db } from "../config/db.js";

export const getAll = async () => {
  const [rows] = await db.query("SELECT * FROM nha_cung_cap");
  return rows;
};

export const getById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM nha_cung_cap WHERE ma_ncc=?",
    [id]
  );
  if (rows.length === 0) throw new Error("Không tìm thấy nhà cung cấp");
  return rows[0];
};

export const create = async (data) => {
  const { ma_ncc, ten_ncc, so_dien_thoai, email } = data;
  if (!ma_ncc || !ten_ncc) throw new Error("Thiếu dữ liệu bắt buộc");

  await db.query(
    "INSERT INTO nha_cung_cap VALUES (?, ?, ?, ?)",
    [ma_ncc, ten_ncc, so_dien_thoai ?? "", email ?? ""]
  );
  return data;
};

export const update = async (id, data) => {
  const { ten_ncc, so_dien_thoai, email } = data;
  await db.query(
    `UPDATE nha_cung_cap 
     SET ten_ncc=?, so_dien_thoai=?, email=? 
     WHERE ma_ncc=?`,
    [ten_ncc, so_dien_thoai, email, id]
  );
  return { ...data, ma_ncc: id };
};

export const remove = async (id) => {
  await db.query("DELETE FROM nha_cung_cap WHERE ma_ncc=?", [id]);
  return true;
};
