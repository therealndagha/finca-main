

import express from "express";
import {
  getGuarantors,
  getGuarantorById,
  createGuarantor,
  updateGuarantor,
  deleteGuarantor,
} from "../controllers/guarantorController.js";

const router = express.Router();

router.get("/", getGuarantors);
router.get("/:id", getGuarantorById);
router.post("/", createGuarantor);
router.put("/:id", updateGuarantor);
router.delete("/:id", deleteGuarantor);

export default router;
