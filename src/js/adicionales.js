const MARGEN_FUENTE = 0.15;

export function calcularCables({ metrosAC, metrosDC22, metrosDC18 }, catalogoCables) {
  const cableAC = catalogoCables.find(c => c.tipoCable === 'AC');
  const cableDC22 = catalogoCables.find(c => c.tipoCable === 'DC' && c.calibre === 22);
  const cableDC18 = catalogoCables.find(c => c.tipoCable === 'DC' && c.calibre === 18);

  const lineas = [];
  [
    { metros: metrosAC, producto: cableAC, etiqueta: 'Cable AC' },
    { metros: metrosDC22, producto: cableDC22, etiqueta: 'Cable DC cal 22' },
    { metros: metrosDC18, producto: cableDC18, etiqueta: 'Cable DC cal 18' },
  ].forEach(({ metros, producto, etiqueta }) => {
    if (metros > 0 && producto) {
      lineas.push({
        etiqueta,
        metros,
        precioUnitario: producto.precioVenta,
        costo: Number((metros * producto.precioVenta).toFixed(2)),
      });
    }
  });

  const costoTotal = lineas.reduce((acc, l) => acc + l.costo, 0);
  return { lineas, costoTotal };
}

// Combinación de fuentes de menor costo que cubre watts*1.15, filtradas por voltaje.
// Programación dinámica tipo "cambio de monedas" (unbounded knapsack).
function combinacionMinima(objetivoWatts, fuentesDisponibles) {
  if (fuentesDisponibles.length === 0) return null;

  const maxWatt = Math.max(...fuentesDisponibles.map(f => f.watts));
  const limite = objetivoWatts + maxWatt;

  const costoMin = new Array(limite + 1).fill(Infinity);
  const eleccion = new Array(limite + 1).fill(null);
  costoMin[0] = 0;

  for (let w = 1; w <= limite; w++) {
    for (const fuente of fuentesDisponibles) {
      const cap = Math.max(0, w - fuente.watts);
      if (costoMin[cap] + fuente.costo < costoMin[w]) {
        costoMin[w] = costoMin[cap] + fuente.costo;
        eleccion[w] = fuente;
      }
    }
  }

  let mejorW = objetivoWatts;
  for (let w = objetivoWatts; w <= limite; w++) {
    if (costoMin[w] < costoMin[mejorW]) mejorW = w;
  }
  if (!isFinite(costoMin[mejorW])) return null;

  const combinacion = [];
  let w = mejorW;
  while (w > 0 && eleccion[w]) {
    combinacion.push(eleccion[w]);
    w = Math.max(0, w - eleccion[w].watts);
  }
  return combinacion;
}

export function calcularFuentesPorModulo(modulos, catalogoFuentes, voltajeTira) {
  const fuentesCompatibles = catalogoFuentes.filter(f => f.voltaje === voltajeTira && f.watts);

  return modulos.map(modulo => {
    const objetivo = Math.ceil(modulo.watts * (1 + MARGEN_FUENTE));
    const combinacion = combinacionMinima(objetivo, fuentesCompatibles);

    if (!combinacion) {
      return { ...modulo, objetivo, fuentes: [], costo: 0, sinCobertura: true };
    }

    const costo = combinacion.reduce((acc, f) => acc + f.precioVenta, 0);
    return { ...modulo, objetivo, fuentes: combinacion, costo, sinCobertura: false };
  });
}

export function calcularAdicionales({ cables, modulos, catalogoCables, catalogoFuentes, voltajeTira }) {
  const resultadoCables = calcularCables(cables, catalogoCables);
  const resultadoModulos = calcularFuentesPorModulo(modulos, catalogoFuentes, voltajeTira);
  const costoFuentes = resultadoModulos.reduce((acc, m) => acc + m.costo, 0);
  const costoTotal = resultadoCables.costoTotal + costoFuentes;

  return { cables: resultadoCables, modulos: resultadoModulos, costoTotal };
}
