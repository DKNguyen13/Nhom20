import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { getRevenueStatsController } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/revenue-stats", authenticate, getRevenueStatsController);

export default router;
