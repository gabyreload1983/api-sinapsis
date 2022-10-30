const { Router } = require("express");
const urbano = require("../controllers/urbanoController");

const router = Router();

router.get("/work-orders/pending", urbano.getWorkOrdersPending);
router.get("/work-orders/in-process", urbano.getWorkOrdersInProcess);
router.get("/work-orders/repaired", urbano.getWorkOrdersRepaired);
router.get("/work-orders/without-repair", urbano.getWorkOrdersWithoutRepair);
router.get("/work-order/:numberWorkOrder", urbano.getWorkOrder);
router.get("/work-orders/technical/:codeTechnical", urbano.getMyWorkOrders);

module.exports = router;
