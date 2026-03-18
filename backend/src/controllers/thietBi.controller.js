// controllers/thietBi.controller.js
import * as service from "../services/thietBi.service.js";

export const getAll = async (req, res, next) => {
  try {
    const data = await service.getAll();
    res.json(data);
  } catch (err) { next(err); }
};

export const getById = async (req, res, next) => {
  try {
    const data = await service.getById(req.params.id);
    res.json(data);
  } catch (err) { err.status = 404; next(err); }
};

export const create = async (req, res, next) => {
  try {
    const data = await service.create(req.body);
    res.status(201).json(data);
  } catch (err) { err.status = 400; next(err); }
};

export const update = async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, req.body);
    res.json(data);
  } catch (err) { err.status = 400; next(err); }
};

export const remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id);
    res.json({ message: "Xoá thành công" });
  } catch (err) { next(err); }
};
