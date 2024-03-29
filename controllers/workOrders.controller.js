import {
  getQuerySector,
  getQueryMyWorkOrders,
  getQueryWorkOrder,
  getQueryProcess,
  getQueryToDeliver,
  queryDollar,
  getQueryTakeWorkOrder,
  getQueryUpdateWorkOrder,
  getQueryCloseWorkOrder,
  getQueryFreeWorkOrder,
  getQueryOutWorkOrder,
  getQueryRemoveReserve,
} from "../utils/querys.js";
import { formatWorkOrders, getFromUrbano } from "../utils/tools.js";
const sectors = ["pc", "imp"];
const technicals = [
  "SERG",
  "TICO",
  "GUIDO",
  "JORGE",
  "JUANT",
  "VICT",
  "GABYT",
  "ZORRO",
  "MAUT",
  "LEO",
  "MATIT",
  "CLAUT",
];

const getWorkOrders = async (req, res) => {
  try {
    const {
      status,
      sector,
      technical,
      numberWorkOrder,
      quantity = 1,
      time = "YEAR",
    } = req.query;
    let querys = [];

    if (status === "pending" && sectors.includes(sector)) {
      querys = getQuerySector(sector);
    }

    if (status === "myWorkOrders" && technicals.includes(technical)) {
      querys = getQueryMyWorkOrders(technical);
    }

    if (status === "process") {
      querys = getQueryProcess();
    }

    if (status === "toDeliver" && Number(quantity) && time) {
      querys = getQueryToDeliver(Number(quantity), time);
    }

    if (numberWorkOrder?.length === 15) {
      querys = getQueryWorkOrder(numberWorkOrder);
    }

    if (querys.length === 0) return res.status(400).send({ status: "Error" });

    const workOrders = await getFromUrbano(querys.workOrders);
    const products = await getFromUrbano(querys.products);
    const dollar = await getFromUrbano(queryDollar);
    const workOrdersFormat = formatWorkOrders(workOrders, products, dollar);
    res.status(200).send({ status, workOrders: workOrdersFormat });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

const updateWorkOrder = async (req, res) => {
  try {
    let query = "";
    const { action } = req.query;
    const { workOrder } = req.body;

    if (action === "take" && workOrder) {
      query = getQueryTakeWorkOrder(workOrder);
    }

    if (action === "update" && workOrder) {
      query = getQueryUpdateWorkOrder(workOrder);
    }

    if (action === "close" && workOrder) {
      query = getQueryCloseWorkOrder(workOrder);
    }

    if (action === "free" && workOrder) {
      query = getQueryFreeWorkOrder(workOrder);
    }

    if (action === "out" && workOrder) {
      const queryWorkOrder = getQueryWorkOrder(workOrder.nrocompro);
      const w = await getFromUrbano(queryWorkOrder.workOrders);
      if (w[0].estado !== 23)
        return res.status(404).send({ Error: "La orden no esta terminada!" });
      query = getQueryOutWorkOrder(workOrder);
      const products = await getFromUrbano(query.products);
      if (products.length) {
        products.forEach(async (p) => {
          const queryRemoveReserve = getQueryRemoveReserve(p);
          const result = await getFromUrbano(queryRemoveReserve);
          if (!result.affectedRows)
            return res.status(400).send({
              Error: "Error al quitar reserva, contactar al programador!",
            });
        });
      }
      query = query.out;
    }

    if (query.length === 0) return res.status(400).send({ status: "Error" });

    const result = await getFromUrbano(query);
    if (result.affectedRows) return res.send({ status: "success", action });
    res
      .status(400)
      .send({ status: "error", action, message: "Error al actualizar!" });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

export { getWorkOrders, updateWorkOrder };
