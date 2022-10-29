const { Router } = require("express");
const urbano = require("../controllers/urbanoController");

const router = Router();

router.get("/work-orders-pending", urbano.getWorkOrdersPending);
router.get("/my-work-orders/:codeTechnical", urbano.getMyWorkOrders);

module.exports = router;
