// services/khoa.service.js
import { db } from "../config/db.js";

export const getAll = async () => {
  const [rows] = await db.query("SELECT * FROM khoa");
  return rows;
};

export const getById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM khoa WHERE ma_khoa=?",
    [id]
  );
  if (rows.length === 0) throw new Error("Không tìm thấy khoa");
  return rows[0];
};

export const create = async (data) => {
  const { ma_khoa, ten_khoa } = data;
  if (!ma_khoa || !ten_khoa) throw new Error("Thiếu dữ liệu bắt buộc");

  await db.query("INSERT INTO khoa VALUES (?, ?)", [ma_khoa, ten_khoa]);
  return data;
};

export const update = async (id, data) => {
  const { ten_khoa } = data;
  if (!ten_khoa) throw new Error("Tên khoa không được để trống");

  await db.query(
    "UPDATE khoa SET ten_khoa=? WHERE ma_khoa=?",
    [ten_khoa, id]
  );
  return { ...data, ma_khoa: id };
};

export const remove = async (id) => {
  await db.query("DELETE FROM khoa WHERE ma_khoa=?", [id]);
  return true;
};
