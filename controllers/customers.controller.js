import { getFromUrbano, getProductPrice } from "../utils/tools.js";

const getCustomers = async (req, res) => {
  try {
    const { search } = req.params;
    console.log(search);
    let customers;
    const query = `SELECT * FROM clientes WHERE nombre LIKE '%${search}%'`;

    customers = await getFromUrbano(query);

    res.status(200).send(customers);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

const getHistoryCustomer = async (req, res) => {
  try {
    const { codeCustomer } = req.params;

    let history;
    const query = `SELECT * FROM trabajos WHERE codigo = '${codeCustomer}' ORDER BY ingresado DESC`;

    history = await getFromUrbano(query);

    const queryProductsInWorkOrders = `SELECT *
                                            FROM trrenglo 
                                            LEFT JOIN trabajos
                                            ON trrenglo.nrocompro = trabajos.nrocompro
                                            LEFT JOIN articulo 
                                            ON trrenglo.codart= articulo.codigo
                                            WHERE 
                                            trabajos.codigo = "${codeCustomer}"`;
    const queryDollar = `SELECT * FROM cotiza  WHERE codigo =  "BD"`;

    let productsInWorkOrders = await getFromUrbano(queryProductsInWorkOrders);
    const dollar = await getFromUrbano(queryDollar);

    history.forEach((workOrder) => {
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

    res.status(200).send(history);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

export { getCustomers, getHistoryCustomer };
