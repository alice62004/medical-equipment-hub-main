import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const db = await mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "123",
  database: process.env.DB_NAME || "qlvt_thiet_bi_y_te",
});
