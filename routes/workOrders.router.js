import { Router } from "express";
import {
  getWorkOrders,
  updateWorkOrder,
} from "../controllers/workOrders.controller.js";

const router = Router();

router.get("/", getWorkOrders);
router.patch("/", updateWorkOrder);

export default router;
