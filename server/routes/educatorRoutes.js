import express from "express";
import { updateRoleToEductor } from "../controllers/educatorController.js";

const router = express.Router();

// add educator role
router.post("/update-role", updateRoleToEductor);

export default router;