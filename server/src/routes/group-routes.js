import express from "express";
import {
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
} from "../controllers/group-controllers.js";

const router = express.Router();

// GET all groups
router.get("/", getAllGroups);

// GET single group by id
router.get("/:id", getGroupById);

// POST create a group
router.post("/", createGroup);

// PUT update a group
router.put("/:id", updateGroup);

// DELETE a group
router.delete("/:id", deleteGroup);

export default router;
