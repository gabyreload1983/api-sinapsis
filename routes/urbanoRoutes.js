const { Router } = require("express");
const urbano = require("../controllers/urbanoController");

const router = Router();

router.get("/work-orders/in-process", urbano.getWorkOrdersInProcess);
router.get("/work-orders/repaired", urbano.getWorkOrdersRepaired);
router.get("/work-orders/without-repair", urbano.getWorkOrdersWithoutRepair);
router.get("/work-orders/technical/:codeTechnical", urbano.getMyWorkOrders);
router.get("/work-orders/pending/:sector", urbano.getWorkOrdersPending);
router.get("/work-order/:numberWorkOrder", urbano.getWorkOrder);

router.post("/workOrderOutput", urbano.workOrderOutput);

module.exports = router;
