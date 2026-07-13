function expandirPiezas(piezas) {
  // piezas: [{cantidad, medida}] -> lista plana de medidas repetidas
  const expandido = [];
  piezas.forEach(p => {
    for (let i = 0; i < p.cantidad; i++) expandido.push(p.medida);
  });
  return expandido;
}

function empacar(medidas, stockLength) {
  // First Fit Decreasing: ordena de mayor a menor y coloca cada pieza
  // en la primera barra/tira donde quepa; si no cabe en ninguna, abre una nueva.
  const ordenadas = [...medidas].sort((a, b) => b - a);
  const bins = [];
  for (const medida of ordenadas) {
    let bin = bins.find(b => b.restante >= medida);
    if (!bin) {
      bin = { piezas: [], restante: stockLength };
      bins.push(bin);
    }
    bin.piezas.push(medida);
    bin.restante -= medida;
  }
  return bins;
}

function segundaMasLarga(medidas) {
  const unicas = [...new Set(medidas)].sort((a, b) => b - a);
  return unicas[1] ?? unicas[0] ?? 0;
}

// Regla: desde 3 canaletas, si ninguna tiene sobrante suficiente para la
// segunda pieza más larga (valores únicos, desc), se agrega una barra extra de respaldo.
export function optimizarCanaletas(piezas, stockLength) {
  const medidas = expandirPiezas(piezas);
  if (medidas.length === 0) return [];

  const bins = empacar(medidas, stockLength);

  if (bins.length >= 3) {
    const segunda = segundaMasLarga(medidas);
    const hayRespaldo = bins.some(b => b.restante >= segunda);
    if (!hayRespaldo) {
      bins.push({ piezas: [], restante: stockLength, esExtra: true });
    }
  }
  return bins;
}

// Regla: se añade 10% de margen de desperdicio sobre el total de metros de tira LED.
// Si el material ya empacado no cubre ese margen, se agrega una tira extra.
export function optimizarTiras(piezas, stockLength) {
  const medidas = expandirPiezas(piezas);
  if (medidas.length === 0) return [];

  const bins = empacar(medidas, stockLength);

  const totalReal = medidas.reduce((a, b) => a + b, 0);
  const totalConDesperdicio = totalReal * 1.10;
  const stockUsado = bins.length * stockLength;

  if (stockUsado < totalConDesperdicio) {
    bins.push({ piezas: [], restante: stockLength, esExtra: true });
  }
  return bins;
}

export function calcularResumen({ canaletas, tiras, piezas }) {
  const totalPiezas = piezas.reduce((acc, p) => acc + p.cantidad, 0);
  const metrosLineales = piezas.reduce((acc, p) => acc + p.cantidad * p.medida, 0) / 100;
  return {
    metrosLineales: Number(metrosLineales.toFixed(2)),
    cantCanaletas: canaletas.length,
    cantTiras: tiras.length,
    totalPiezas,
  };
}

// Punto de entrada: recibe los productos seleccionados y las piezas, devuelve
// el resultado completo listo para pasar a render().
export function cotizar({ canaletaProducto, tiraProducto, piezas }) {
  const canaletas = optimizarCanaletas(piezas, canaletaProducto.longitud);
  const tiras = optimizarTiras(piezas, tiraProducto.longitud);
  const resumen = calcularResumen({ canaletas, tiras, piezas });
  return { canaletas, tiras, resumen };
}
