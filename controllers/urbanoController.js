const { getFromUrbano, getProductPrice } = require("../utils/tools");

exports.getWorkOrdersPending = async (req, res) => {
  try {
    const query = `SELECT * FROM trabajos 
                        WHERE  codiart = (".PC" || ".IMP") AND 
                        estado = 21 AND 
                        codigo != "ANULADO"
                        ORDER BY prioridad DESC`;
    const workordersPending = await getFromUrbano(query);

    res.status(200).send(workordersPending);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

exports.getWorkOrdersInProcess = async (req, res) => {
  try {
    const query = `SELECT * FROM trabajos WHERE estado = 22 ORDER BY tecnico`;
    const queryProductsInWorkOrders = `SELECT *
                                        FROM trrenglo 
                                        LEFT JOIN trabajos
                                        ON trrenglo.nrocompro = trabajos.nrocompro
                                        LEFT JOIN articulo 
                                        ON trrenglo.codart= articulo.codigo
                                        WHERE 
                                        trabajos.estado = 22 AND
                                        trabajos.codigo != "ANULADO"
                                        ORDER BY trabajos.prioridad DESC`;
    const queryDollar = `SELECT * FROM cotiza  WHERE codigo =  "BD"`;

    let productsInWorkOrders = await getFromUrbano(queryProductsInWorkOrders);
    const dollar = await getFromUrbano(queryDollar);
    let workOrdersInProcess = await getFromUrbano(query);

    workOrdersInProcess.forEach((workOrder) => {
      workOrder.products = [];
      workOrder.costo = Math.trunc(Number(workOrder.costo));
      workOrder.total = workOrder.costo;

      productsInWorkOrders.forEach((product) => {
        if (product.nrocompro === workOrder.nrocompro) {
          let exists = workOrder.products.find(
            (pr) => pr.codigo === product.codigo
          );
          if (!exists) {
            product.finalPrice = getProductPrice(product, dollar);
            workOrder.total += product.finalPrice;
            workOrder.products.push({ ...product, quantity: 1 });
          } else {
            exists.quantity++;
            workOrder.total += exists.finalPrice;
          }
        }
      });
    });
    console.log(workOrdersInProcess.length);

    res.status(200).send(workOrdersInProcess);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

exports.getWorkOrdersRepaired = async (req, res) => {
  try {
    const query = `SELECT * FROM trabajos WHERE 
                                          ingresado BETWEEN DATE_ADD(NOW(),INTERVAL - 1 YEAR) AND NOW() AND
                                          codigo != "ANULADO" AND 
                                          estado = 23  AND 
                                          diag = 22 AND
                                          ubicacion = 21
                                          ORDER BY ingresado DESC`;

    const queryProductsInWorkOrders = `SELECT *
                                          FROM trrenglo 
                                          LEFT JOIN trabajos
                                          ON trrenglo.nrocompro = trabajos.nrocompro
                                          LEFT JOIN articulo 
                                          ON trrenglo.codart= articulo.codigo
                                          WHERE 
                                          trabajos.estado = 23 AND
                                          trabajos.diag = 22 AND
                                          trabajos.ubicacion = 21 AND
                                          trabajos.codigo != "ANULADO"
                                          ORDER BY trabajos.prioridad DESC`;

    const queryDollar = `SELECT * FROM cotiza  WHERE codigo =  "BD"`;

    let productsInWorkOrders = await getFromUrbano(queryProductsInWorkOrders);
    const dollar = await getFromUrbano(queryDollar);
    let workOrdersRepaired = await getFromUrbano(query);

    workOrdersRepaired.forEach((workOrder) => {
      workOrder.products = [];
      workOrder.costo = Math.trunc(Number(workOrder.costo));
      workOrder.total = workOrder.costo;

      productsInWorkOrders.forEach((product) => {
        if (product.nrocompro === workOrder.nrocompro) {
          let exists = workOrder.products.find(
            (pr) => pr.codigo === product.codigo
          );
          if (!exists) {
            product.finalPrice = getProductPrice(product, dollar);
            workOrder.total += product.finalPrice;
            workOrder.products.push({ ...product, quantity: 1 });
          } else {
            exists.quantity++;
            workOrder.total += exists.finalPrice;
          }
        }
      });
    });
    console.log(workOrdersRepaired.length);

    res.status(200).send(workOrdersRepaired);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

exports.getWorkOrdersWithoutRepair = async (req, res) => {
  try {
    const query = `SELECT * FROM trabajos WHERE 
                                          ingresado BETWEEN DATE_ADD(NOW(),INTERVAL -1 YEAR) AND NOW() AND
                                          codigo != "ANULADO" AND 
                                          estado = 23  AND 
                                          diag = 23 AND
                                          ubicacion = 21
                                          ORDER BY ingresado DESC`;
    const queryProductsInWorkOrders = `SELECT *
                                          FROM trrenglo 
                                          LEFT JOIN trabajos
                                          ON trrenglo.nrocompro = trabajos.nrocompro
                                          LEFT JOIN articulo 
                                          ON trrenglo.codart= articulo.codigo
                                          WHERE 
                                          trabajos.estado = 23 AND
                                          trabajos.diag = 23 AND
                                          trabajos.ubicacion = 21 AND
                                          trabajos.codigo != "ANULADO"
                                          ORDER BY trabajos.prioridad DESC`;

    const queryDollar = `SELECT * FROM cotiza  WHERE codigo =  "BD"`;

    let productsInWorkOrders = await getFromUrbano(queryProductsInWorkOrders);
    const dollar = await getFromUrbano(queryDollar);
    let workOrdersWithoutRepair = await getFromUrbano(query);

    workOrdersWithoutRepair.forEach((workOrder) => {
      workOrder.products = [];
      workOrder.costo = Math.trunc(Number(workOrder.costo));
      workOrder.total = workOrder.costo;

      productsInWorkOrders.forEach((product) => {
        if (product.nrocompro === workOrder.nrocompro) {
          let exists = workOrder.products.find(
            (pr) => pr.codigo === product.codigo
          );
          if (!exists) {
            product.finalPrice = getProductPrice(product, dollar);
            workOrder.total += product.finalPrice;
            workOrder.products.push({ ...product, quantity: 1 });
          } else {
            exists.quantity++;
            workOrder.total += exists.finalPrice;
          }
        }
      });
    });

    console.log(workOrdersWithoutRepair.length);

    res.status(200).send(workOrdersWithoutRepair);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

exports.getMyWorkOrders = async (req, res) => {
  const { codeTechnical } = req.params;

  const queryMyWorkOrders = `SELECT * FROM trabajos
                       WHERE tecnico="${codeTechnical}" AND estado = 22 AND codigo != "ANULADO"
                      ORDER BY prioridad DESC`;

  const queryProductsInWorkOrders = `SELECT *
                                          FROM trrenglo 
                                          LEFT JOIN trabajos
                                          ON trrenglo.nrocompro = trabajos.nrocompro
                                          LEFT JOIN articulo 
                                          ON trrenglo.codart= articulo.codigo
                                          WHERE 
                                          trabajos.tecnico="${codeTechnical}" AND trabajos.estado = 22 AND trabajos.codigo != "ANULADO"
                                          ORDER BY trabajos.prioridad DESC`;
  const queryDollar = `SELECT * FROM cotiza  WHERE codigo =  "BD"`;
  try {
    let productsInWorkOrders = await getFromUrbano(queryProductsInWorkOrders);
    const dollar = await getFromUrbano(queryDollar);
    let myWorkOrders = await getFromUrbano(queryMyWorkOrders);

    myWorkOrders.forEach((workOrder) => {
      workOrder.products = [];
      workOrder.costo = Math.trunc(Number(workOrder.costo));
      workOrder.total = workOrder.costo;

      productsInWorkOrders.forEach((product) => {
        if (product.nrocompro === workOrder.nrocompro) {
          let exists = workOrder.products.find(
            (pr) => pr.codigo === product.codigo
          );
          if (!exists) {
            product.finalPrice = getProductPrice(product, dollar);
            workOrder.total += product.finalPrice;
            workOrder.products.push({ ...product, quantity: 1 });
          } else {
            exists.quantity++;
            workOrder.total += exists.finalPrice;
          }
        }
      });
    });

    res.status(200).send(myWorkOrders);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

exports.getWorkOrder = async (req, res) => {
  const { numberWorkOrder } = req.params;

  const queryWorkOrder = `SELECT * FROM trabajos WHERE nrocompro = "ORX0011000${numberWorkOrder}"`;

  const queryProductsInWorkOrders = `SELECT *
                                          FROM trrenglo 
                                          LEFT JOIN trabajos
                                          ON trrenglo.nrocompro = trabajos.nrocompro
                                          LEFT JOIN articulo 
                                          ON trrenglo.codart= articulo.codigo
                                          WHERE 
                                          trabajos.nrocompro ="ORX0011000${numberWorkOrder}"`;
  const queryDollar = `SELECT * FROM cotiza  WHERE codigo =  "BD"`;
  try {
    let productsInWorkOrders = await getFromUrbano(queryProductsInWorkOrders);
    const dollar = await getFromUrbano(queryDollar);
    let workOrder = await getFromUrbano(queryWorkOrder);

    workOrder[0].products = [];
    workOrder[0].costo = Math.trunc(Number(workOrder[0].costo));
    workOrder[0].total = workOrder[0].costo;

    productsInWorkOrders.forEach((product) => {
      if (product.nrocompro === workOrder[0].nrocompro) {
        let exists = workOrder[0].products.find(
          (pr) => pr.codigo === product.codigo
        );
        if (!exists) {
          product.finalPrice = getProductPrice(product, dollar);
          workOrder[0].total += product.finalPrice;
          workOrder[0].products.push({ ...product, quantity: 1 });
        } else {
          exists.quantity++;
          workOrder[0].total += exists.finalPrice;
        }
      }
    });

    res.status(200).send(workOrder[0]);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};
