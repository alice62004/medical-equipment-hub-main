import * as service from "../services/thietbi.service.js";

export const getAll = async (req, res) => {
  const data = await service.getAll();
  res.json(data);
};

export const getById = async (req, res) => {
  try {
    const data = await service.getById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const create = async (req, res) => {
  try {
    const data = await service.create(req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const data = await service.update(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const remove = async (req, res) => {
  await service.remove(req.params.id);
  res.json({ message: "Delete OK" });
};