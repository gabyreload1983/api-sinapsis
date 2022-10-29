const connectionUrbano = require("../connections/urbanoDb");

exports.getFromUrbano = (query) => {
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

exports.getProductPrice = (product, dollar) => {
  let exchange = product.moneda === "D" ? dollar[0].valorlibre : 1;
  let tax = product.grabado === "1" ? 1.21 : 1.105;
  return Math.trunc(product.lista1 * tax * exchange);
};
