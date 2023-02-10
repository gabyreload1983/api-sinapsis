import { Router } from "express";
import {
  getCustomers,
  getHistoryCustomer,
} from "../controllers/customers.controller.js";

const router = Router();

router.get("/customers/:search", getCustomers);
router.get("/history/:codeCustomer", getHistoryCustomer);

export default router;
