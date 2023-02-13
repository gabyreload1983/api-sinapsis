import { Router } from "express";
import { getWorkOrders } from "../controllers/workOrders.controller.js";

const router = Router();

router.get("/", getWorkOrders);

export default router;
