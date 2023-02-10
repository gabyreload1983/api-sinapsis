import { Router } from "express";
import {
  getWorkOrdersPending,
  getWorkOrdersInProcess,
  getWorkOrdersRepaired,
  getWorkOrdersWithoutRepair,
  getMyWorkOrders,
  getWorkOrder,
  workOrderOutput,
} from "../controllers/workOrders.controller.js";

const router = Router();

router.get("/in-process", getWorkOrdersInProcess);
router.get("/repaired", getWorkOrdersRepaired);
router.get("/without-repair", getWorkOrdersWithoutRepair);
router.get("/technical/:codeTechnical", getMyWorkOrders);
router.get("/pending/:sector", getWorkOrdersPending);

router.get("/:numberWorkOrder", getWorkOrder);

router.post("/workOrderOutput", workOrderOutput);

export default router;
