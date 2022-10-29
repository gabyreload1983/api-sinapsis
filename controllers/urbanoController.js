const { getFromUrbano, getProductPrice } = require("../utils/tools");

exports.getWorkOrdersPending = async (req, res) => {
  try {
    const query = `SELECT * FROM trabajos 
                        WHERE  codiart = (".PC" || ".IMP") AND 
                        estado = '21' AND 
                        codigo != "ANULADO"
                        ORDER BY prioridad DESC`;
    const workordersPending = await getFromUrbano(query);

    res.status(200).send({
      workordersPending,
    });
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
    let myWorkOrders = await getFromUrbano(queryMyWorkOrders);
    let dollar = await getFromUrbano(queryDollar);

    myWorkOrders.forEach((workOrder) => {
      workOrder.products = [];
      workOrder.total = Math.trunc(Number(workOrder.costo));

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

    res.status(200).send({
      myWorkOrders,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};
