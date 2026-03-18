// services/nhanVien.service.js
import { db } from "../config/db.js";

export const getAll = async () => {
  const [rows] = await db.query("SELECT * FROM nhan_vien");
  return rows;
};

export const getById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM nhan_vien WHERE ma_nv=?",
    [id]
  );
  if (rows.length === 0) throw new Error("Không tìm thấy nhân viên");
  return rows[0];
};

export const update = async (id, data) => {
  const { ten_nv, chuc_vu, so_dien_thoai, email } = data;

  await db.query(
    `UPDATE nhan_vien 
     SET ten_nv=?, chuc_vu=?, so_dien_thoai=?, email=? 
     WHERE ma_nv=?`,
    [ten_nv, chuc_vu, so_dien_thoai, email, id]
  );
  return { ...data, ma_nv: id };
};

export const remove = async (id) => {
  await db.query("DELETE FROM nhan_vien WHERE ma_nv=?", [id]);
  return true;
};
