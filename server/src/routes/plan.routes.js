import express from "express";
import * as planController from "../controllers/plan.controller.js";

const router = express.Router();

// 📌 Public Route — Get All Plans
router.get("/", planController.getAllPlans);

export default router;
