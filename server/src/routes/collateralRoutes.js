import express from "express";
import {
  getCollateral,
  getCollateralById,
  createCollateral,
  updateCollateral,
  deleteCollateral,
} from "../controllers/collateralControllers.js";

const router = express.Router();

router.get("/", getCollateral);
router.get("/:id", getCollateralById);
router.post("/", createCollateral);
router.put("/:id", updateCollateral);
router.delete("/:id", deleteCollateral);

export default router;
