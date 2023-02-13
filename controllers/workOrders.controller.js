import {
  getQuerySector,
  getQueryMyWorkOrders,
  getQueryWorkOrder,
  getQueryProcess,
} from "../utils/querys.js";
import { getFromUrbano } from "../utils/tools.js";
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
    const { status, sector, technical, numberWorkOrder } = req.query;
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

    if (numberWorkOrder?.length === 5) {
      querys = getQueryWorkOrder(numberWorkOrder);
    }

    if (querys.length === 0) return res.status(400).send({ status: "Error" });

    const workOrders = await getFromUrbano(querys.workOrders);
    const products = await getFromUrbano(querys.products);
    res.status(200).send({ status, workOrders, products });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

export { getWorkOrders };
