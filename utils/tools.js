import { connectionUrbano } from "../connections/dbUrbano.js";

const getFromUrbano = (query) => {
  return new Promise((resolve, reject) => {
    connectionUrbano.query(query, (error, result) => {
      if (error) {
        reject(new Error(error));
      } else {
        resolve(result);
      }
    });
  });
};

const getProductPrice = (product, dollar) => {
  let exchange = product.moneda === "D" ? dollar[0].valorlibre : 1;
  let tax = product.grabado === "1" ? 1.21 : 1.105;
  return Math.trunc(product.lista1 * tax * exchange);
};

const formatWorkOrders = (workOrders, products, dollar) => {
  workOrders.forEach((workOrder) => {
    workOrder.products = [];
    workOrder.costo = Math.trunc(Number(workOrder.costo));
    workOrder.total = workOrder.costo;

    products.forEach((product) => {
      if (product.nrocompro === workOrder.nrocompro) {
        product.finalPrice = getProductPrice(product, dollar);
        workOrder.total += product.finalPrice;
        workOrder.products.push(product);
      }
    });
  });
  return workOrders;
};

export { getFromUrbano, getProductPrice, formatWorkOrders };
