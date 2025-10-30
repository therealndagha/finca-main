import express from 'express';
const router = express.Router();
import {getAll, getOne, create, update, remove} from '../controllers/loan-application-controllers.js'

router.get("/", getAll);
router.get("/:id", getOne);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;