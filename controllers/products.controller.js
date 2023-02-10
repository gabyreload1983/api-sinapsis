import { getFromUrbano, getProductPrice } from "../utils/tools.js";

const getProducts = async (req, res) => {
  try {
    const { search } = req.params;
    let products;
    const queryDollar = `SELECT * FROM cotiza  WHERE codigo =  "BD"`;

    const queryCode = `SELECT *,
      articulo.descrip AS description,
      (stockd01 - reserd01) AS stock	
      FROM articulo 
      INNER JOIN artstk01
      ON articulo.codigo= artstk01.codigo
      WHERE articulo.codigo = "${search}" AND (stockd01 - reserd01) > 0`;
    const queryDescription = `SELECT *, 
      articulo.descrip AS description,
      (stockd01 - reserd01) AS stock
      FROM articulo 
      INNER JOIN artstk01
      ON articulo.codigo= artstk01.codigo
      WHERE articulo.descrip LIKE "%${search}%" AND (stockd01 - reserd01) > 0
      ORDER BY articulo.descrip`;

    const dollar = await getFromUrbano(queryDollar);

    products = await getFromUrbano(queryCode);
    if (products.length === 0) {
      products = await getFromUrbano(queryDescription);
    }

    products.forEach((product) => {
      product.finalPrice = getProductPrice(product, dollar);
    });

    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

export { getProducts };
