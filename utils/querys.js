const getQuerySector = (sector) => {
  return `SELECT * FROM trabajos WHERE  codiart = '.${sector}' AND estado = 21 AND codigo != 'ANULADO' ORDER BY prioridad DESC`;
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
    workOrders: `SELECT * FROM trabajos WHERE nrocompro = 'ORX0011000${numberWorkOrder}'`,
    products: `
    SELECT trrenglo.nrocompro, trrenglo.serie, articulo.codigo, articulo.descrip, articulo.lista1, articulo.moneda, articulo.grabado  
    FROM trrenglo LEFT JOIN trabajos ON trrenglo.nrocompro = trabajos.nrocompro
    LEFT JOIN articulo ON trrenglo.codart= articulo.codigo
    WHERE trabajos.nrocompro ='ORX0011000${numberWorkOrder}'`,
  };
};

export { getQuerySector, getQueryMyWorkOrders, getQueryWorkOrder };
