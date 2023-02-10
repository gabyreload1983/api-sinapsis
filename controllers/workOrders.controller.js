import { getFromUrbano, getProductPrice } from "../utils/tools.js";

const getWorkOrdersPending = async (req, res) => {
  try {
    const { sector } = req.params;
    const query = `SELECT * FROM trabajos 
    WHERE  codiart = ".${sector}" AND 
    estado = 21 AND 
    codigo != "ANULADO"
    ORDER BY prioridad DESC`;
    const workordersPending = await getFromUrbano(query);
    workordersPending.forEach((workOrder) => {
      workOrder.products = [];
      workOrder.costo = Math.trunc(Number(workOrder.costo));
      workOrder.total = workOrder.costo;
    });

    res.status(200).send(workordersPending);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

const getWorkOrdersInProcess = async (req, res) => {
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

    res.status(200).send(workOrdersInProcess);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

const getWorkOrdersRepaired = async (req, res) => {
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

    res.status(200).send(workOrdersRepaired);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

const getWorkOrdersWithoutRepair = async (req, res) => {
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

    res.status(200).send(workOrdersWithoutRepair);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

const getMyWorkOrders = async (req, res) => {
  try {
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

const getWorkOrder = async (req, res) => {
  try {
    const { numberWorkOrder, codeTechnical } = req.params;

    const queryWorkOrder = `SELECT * FROM trabajos WHERE nrocompro = "ORX0011000${numberWorkOrder}"`;

    const queryProductsInWorkOrders = `SELECT *, trrenglo.serie AS nroserie
                                          FROM trrenglo 
                                          LEFT JOIN trabajos
                                          ON trrenglo.nrocompro = trabajos.nrocompro
                                          LEFT JOIN articulo 
                                          ON trrenglo.codart= articulo.codigo
                                          WHERE 
                                          trabajos.nrocompro ="ORX0011000${numberWorkOrder}"`;
    const queryDollar = `SELECT * FROM cotiza  WHERE codigo =  "BD"`;

    let productsInWorkOrders = await getFromUrbano(queryProductsInWorkOrders);
    const dollar = await getFromUrbano(queryDollar);
    let workOrder = await getFromUrbano(queryWorkOrder);

    if (workOrder.length) {
      workOrder[0].products = [];
      workOrder[0].costo = Math.trunc(Number(workOrder[0].costo));
      workOrder[0].total = workOrder[0].costo;

      productsInWorkOrders.forEach((product) => {
        product.quantity = 1;
        product.finalPrice = getProductPrice(product, dollar);
        workOrder[0].total += product.finalPrice;
        workOrder[0].products.push(product);
      });

      res.status(200).send(workOrder[0]);
    } else {
      res.status(200).send(false);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

const workOrderOutput = async (req, res) => {
  return true;
  try {
    const { numberWorkOrder, codeOperator } = req.body;
    const queryWorkOrder = `SELECT *FROM trabajos WHERE nrocompro = 'ORX0011000${numberWorkOrder}'`;
    const queryWorkOrderOutput = `UPDATE trabajos SET ubicacion = 22 WHERE nrocompro = "ORX0011000${numberWorkOrder}"`;
    const queryProductsInWorkOrder = `SELECT * FROM trrenglo 
                                      INNER JOIN articulo ON trrenglo.codart= articulo.codigo
                                      WHERE trrenglo.nrocompro = "ORX0011000${numberWorkOrder}"`;

    const workOrder = await getFromUrbano(queryWorkOrder);
    if (workOrder[0].estado === 23) {
      const productsInOrder = await getFromUrbano(queryProductsInWorkOrder);
      if (productsInOrder.length !== 0) {
        const removeProductReservation = async (product) => {
          let query = `UPDATE artstk01 SET reserd01 = reserd01 - 1 WHERE codigo = "${product.codart}"`;
          return await getFromUrbano(query);
        };

        for (let product of productsInOrder) {
          await removeProductReservation(product);
        }
      }

      const result = await getFromUrbano(queryWorkOrderOutput);

      if (result.affectedRows) {
        console.log(
          `workOrderOutput - ${numberWorkOrder} - operator ${codeOperator}`
        );
        res
          .status(200)
          .send({ success: `Salida de orden ${numberWorkOrder} exitosa` });
      } else {
        console.log(`workOrderOutput - ${numberWorkOrder} ERROR`);
        res.status(200).send({
          warning: `Error al dar salida a la orden ${numberWorkOrder}. Contactar al administrador del sistema.`,
        });
      }
    } else {
      res.status(200).send({ warning: "La orden de trabajo no esta cerrada" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

export {
  getWorkOrdersPending,
  getWorkOrdersInProcess,
  getWorkOrdersRepaired,
  getWorkOrdersWithoutRepair,
  getMyWorkOrders,
  getWorkOrder,
  workOrderOutput,
};
