// services/nguoiDung.service.js
import { db } from "../config/db.js";

export const getAll = async () => {
  const [rows] = await db.query("SELECT * FROM nguoi_dung");
  return rows;
};

export const getById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM nguoi_dung WHERE id=?",
    [id]
  );
  if (rows.length === 0) throw new Error("Không tìm thấy người dùng");
  return rows[0];
};

export const create = async (data) => {
  const { id, email, mat_khau, ho_ten, vai_tro } = data;

  if (!id || !email || !mat_khau) {
    throw new Error("Thiếu dữ liệu bắt buộc: id, email, mat_khau");
  }
  if (!email.includes("@")) {
    throw new Error("Email không hợp lệ");
  }

  await db.query(
    "INSERT INTO nguoi_dung VALUES (?, ?, ?, ?, ?)",
    [id, email, mat_khau, ho_ten ?? "", vai_tro ?? "nhanvien_kho"]
  );
  return data;
};

export const update = async (id, data) => {
  const { email, mat_khau, ho_ten, vai_tro } = data;
  await db.query(
    `UPDATE nguoi_dung 
     SET email=?, mat_khau=?, ho_ten=?, vai_tro=? 
     WHERE id=?`,
    [email, mat_khau, ho_ten, vai_tro, id]
  );
  return { ...data, id };
};

export const remove = async (id) => {
  await db.query("DELETE FROM nguoi_dung WHERE id=?", [id]);
  return true;
};
