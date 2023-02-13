import { Router } from "express";
import { getWorkOrders } from "../controllers/workOrders.controller.js";

const router = Router();

router.get("/", getWorkOrders);
// router.get("/in-process", getWorkOrdersInProcess);
// router.get("/repaired", getWorkOrdersRepaired);
// router.get("/without-repair", getWorkOrdersWithoutRepair);

// router.post("/workOrderOutput", workOrderOutput);

export default router;
