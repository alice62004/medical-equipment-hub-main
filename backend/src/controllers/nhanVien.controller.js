// controllers/nhanVien.controller.js
import * as service from "../services/nhanVien.service.js";

export const getAll = async (req, res, next) => {
  try { res.json(await service.getAll()); } catch (err) { next(err); }
};

export const getById = async (req, res, next) => {
  try {
    res.json(await service.getById(req.params.id));
  } catch (err) { err.status = 404; next(err); }
};

export const update = async (req, res, next) => {
  try {
    res.json(await service.update(req.params.id, req.body));
  } catch (err) { err.status = 400; next(err); }
};

export const remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id);
    res.json({ message: "Xoá thành công" });
  } catch (err) { next(err); }
};
