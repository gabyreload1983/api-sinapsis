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

    if (numberWorkOrder?.length === 5) {
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
    let query = [];
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

    if (query.length === 0) return res.status(400).send({ status: "Error" });

    const result = await getFromUrbano(query);
    if (result.affectedRows) return res.send({ status: "success", action });
    res.status(400).send({ status: "Error al actualizar" });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

export { getWorkOrders, updateWorkOrder };
