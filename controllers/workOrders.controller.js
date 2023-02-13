import {
  getQuerySector,
  getQueryMyWorkOrders,
  getQueryWorkOrder,
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

    if (status === "pending" && sectors.includes(sector)) {
      const query = getQuerySector(sector);
      const workOrders = await getFromUrbano(query);
      return res.status(200).send({ sector, workOrders });
    }

    if (status === "myWorkOrders" && technicals.includes(technical)) {
      const querys = getQueryMyWorkOrders(technical);
      const workOrders = await getFromUrbano(querys.workOrders);
      const products = await getFromUrbano(querys.products);
      return res.status(200).send({ workOrders, products });
    }

    if (numberWorkOrder) {
      const querys = getQueryWorkOrder(numberWorkOrder);
      const workOrders = await getFromUrbano(querys.workOrders);
      const products = await getFromUrbano(querys.products);
      return res.status(200).send({ workOrders, products });
    }

    res.status(400).send({ status: "Error" });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

export { getWorkOrders };
