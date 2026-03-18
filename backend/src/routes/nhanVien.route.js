import { Router } from "express";
import * as ctrl from "../controllers/nhanVien.controller.js";

const router = Router();

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

export default router;
