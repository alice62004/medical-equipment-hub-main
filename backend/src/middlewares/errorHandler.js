// Middleware xử lý lỗi toàn cục
export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || "Lỗi máy chủ nội bộ";
  res.status(status).json({ error: message });
}
