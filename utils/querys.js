const getQuerySector = (sector) => {
  return {
    workOrders: `SELECT * FROM trabajos WHERE  codiart = '.${sector}' AND estado = 21 AND codigo != 'ANULADO' ORDER BY prioridad DESC`,
    products: `SELECT * FROM trrenglo LIMIT 0`,
  };
};

const getQueryMyWorkOrders = (technical) => {
  return {
    workOrders: `SELECT * FROM trabajos WHERE tecnico='${technical}' AND estado = 22 AND codigo != 'ANULADO' ORDER BY prioridad DESC`,
    products: `
    SELECT trrenglo.nrocompro, trrenglo.serie, articulo.codigo, articulo.descrip, articulo.lista1, articulo.moneda, articulo.grabado  
    FROM trrenglo LEFT JOIN trabajos ON trrenglo.nrocompro = trabajos.nrocompro 
    LEFT JOIN articulo ON trrenglo.codart= articulo.codigo
    WHERE trabajos.tecnico='${technical}' AND trabajos.estado = 22 AND trabajos.codigo != 'ANULADO'
    ORDER BY trabajos.prioridad DESC`,
  };
};

const getQueryWorkOrder = (numberWorkOrder) => {
  return {
    workOrders: `SELECT * FROM trabajos WHERE nrocompro = '${numberWorkOrder}'`,
    products: `
    SELECT trrenglo.nrocompro, trrenglo.serie, articulo.codigo, articulo.descrip, articulo.lista1, articulo.moneda, articulo.grabado  
    FROM trrenglo LEFT JOIN trabajos ON trrenglo.nrocompro = trabajos.nrocompro
    LEFT JOIN articulo ON trrenglo.codart= articulo.codigo
    WHERE trabajos.nrocompro ='${numberWorkOrder}'`,
  };
};

const getQueryProcess = () => {
  return {
    workOrders: `SELECT * FROM trabajos WHERE estado = 22 ORDER BY tecnico`,
    products: `
    SELECT trrenglo.nrocompro, trrenglo.serie, articulo.codigo, articulo.descrip, articulo.lista1, articulo.moneda, articulo.grabado 
    FROM trrenglo LEFT JOIN trabajos ON trrenglo.nrocompro = trabajos.nrocompro 
    LEFT JOIN articulo ON trrenglo.codart= articulo.codigo
    WHERE trabajos.estado = 22 AND trabajos.codigo != 'ANULADO' ORDER BY trabajos.prioridad DESC`,
  };
};

const getQueryToDeliver = (quantity, time) => {
  const dates = ["DAY", "MONTH", "YEAR"];
  if (!dates.includes(time) || quantity <= 0) return [];
  return {
    workOrders: `
    SELECT * FROM trabajos WHERE ingresado BETWEEN DATE_ADD(NOW(),INTERVAL - ${quantity} ${time}) AND NOW() AND
    codigo != 'ANULADO' AND estado = 23  AND ubicacion = 21 ORDER BY ingresado DESC`,
    products: `
    SELECT trrenglo.nrocompro, trrenglo.ingreso, trrenglo.serie, articulo.codigo, articulo.descrip, articulo.lista1, articulo.moneda, articulo.grabado  
    FROM trrenglo LEFT JOIN trabajos ON trrenglo.nrocompro = trabajos.nrocompro
    LEFT JOIN articulo ON trrenglo.codart= articulo.codigo
    WHERE trrenglo.ingreso BETWEEN DATE_ADD(NOW(),INTERVAL - ${quantity} ${time}) AND NOW() AND
    trabajos.estado = 23 AND trabajos.ubicacion = 21 AND trabajos.codigo != 'ANULADO'
    ORDER BY trabajos.prioridad DESC`,
  };
};

const queryDollar = `SELECT * FROM cotiza  WHERE codigo =  "BD"`;

const getQueryTakeWorkOrder = (workOrder) => `
  UPDATE trabajos SET estado=22, tecnico='${workOrder.tecnico}' WHERE nrocompro='${workOrder.nrocompro}'`;

const getQueryUpdateWorkOrder = (workOrder) => `
  UPDATE trabajos 
  SET diagnostico = '${workOrder.diagnostico}', 
  costo = ${workOrder.costo}, pendiente = ${workOrder.costo} WHERE nrocompro = '${workOrder.nrocompro}'`;

const getQueryCloseWorkOrder = (workOrder) => `
  UPDATE trabajos SET estado = 23, diag = ${workOrder.diag}, diagnosticado = NOW() WHERE nrocompro = '${workOrder.nrocompro}'`;

const getQueryFreeWorkOrder = (workOrder) =>
  `UPDATE trabajos SET estado = 21, diag = 21, ubicacion = 21, tecnico = '' WHERE nrocompro = '${workOrder.nrocompro}'`;

const getQueryOutWorkOrder = (workOrder) => {
  return {
    out: `UPDATE trabajos SET ubicacion = 22 WHERE nrocompro = '${workOrder.nrocompro}'`,
    products: `SELECT * FROM trrenglo WHERE nrocompro = '${workOrder.nrocompro}'`,
  };
};

const getQueryRemoveReserve = (product) => {
  return `UPDATE artstk01 SET reserd01 = reserd01 -1 WHERE codigo = '${product.codart}'`;
};

export {
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
  getQueryOutWorkOrder,
  getQueryRemoveReserve,
};
