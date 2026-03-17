// services/thietbi.service.js
import { db } from "../db.js";
import { validateThietBi } from "../validators/thietbi.validator.js";

export const getAll = async () => {
  const [rows] = await db.query("SELECT * FROM thiet_bi");
  return rows;
};

export const getById = async (id) => {
  if (!id) throw new Error("Thiếu mã thiết bị");

  const [rows] = await db.query(
    "SELECT * FROM thiet_bi WHERE ma_thiet_bi=?",
    [id]
  );

  if (rows.length === 0) {
    throw new Error("Không tìm thấy thiết bị");
  }

  return rows[0];
};

export const create = async (data) => {

  validateThietBi(data);

  const { ma_thiet_bi, ten_thiet_bi, don_vi_tinh, ghi_chu } = data;

  const [exist] = await db.query(
    "SELECT * FROM thiet_bi WHERE ma_thiet_bi=?",
    [ma_thiet_bi]
  );

  if (exist.length > 0) {
    throw new Error("Duplicate ID");
  }

  await db.query(
    "INSERT INTO thiet_bi VALUES (?, ?, ?, ?)",
    [ma_thiet_bi, ten_thiet_bi, don_vi_tinh, ghi_chu]
  );

  return data;
};

export const update = async (id, data) => {
  if (!id) throw new Error("Thiếu ID");

  validateThietBi(data, true); // true = update (optional fields)

  await db.query(
    `UPDATE thiet_bi 
     SET ten_thiet_bi=?, don_vi_tinh=?, ghi_chu=? 
     WHERE ma_thiet_bi=?`,
    [data.ten_thiet_bi, data.don_vi_tinh, data.ghi_chu, id]
  );

  return { ...data, ma_thiet_bi: id };
};

export const remove = async (id) => {
  if (!id) throw new Error("Thiếu ID");

  await db.query("DELETE FROM thiet_bi WHERE ma_thiet_bi=?", [id]);
  return true;
};