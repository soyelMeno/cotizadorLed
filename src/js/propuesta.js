const IVA = 0.16;

function agruparFuentes(modulos) {
  const mapa = {};
  (modulos || []).forEach(m => {
    if (m.sinCobertura) return;
    m.fuentes.forEach(f => {
      if (!mapa[f.codigo]) mapa[f.codigo] = { ...f, cantidad: 0 };
      mapa[f.codigo].cantidad++;
    });
  });
  return Object.values(mapa);
}

function fechaLarga() {
  return new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function generarPropuesta({ cliente, folio, canaleta, tira, resultadoCotizacion, resultadoAdicionales, manoDeObra }) {
  const { resultadoCorte, conectores, silicon } = resultadoCotizacion;

  const canaletaCosto = Number((resultadoCorte.resumen.cantCanaletas * canaleta.precioVenta).toFixed(2));
  const tiraCosto = Number((resultadoCorte.resumen.cantTiras * tira.precioVenta).toFixed(2));

  const cablesLineas = resultadoAdicionales?.cables?.lineas || [];
  const cableMetros = cablesLineas.reduce((acc, l) => acc + l.metros, 0);
  const cableCosto = Number(cablesLineas.reduce((acc, l) => acc + l.costo, 0).toFixed(2));

  const fuentesAgrupadas = agruparFuentes(resultadoAdicionales?.modulos);
  const fuentesCantidad = fuentesAgrupadas.reduce((acc, f) => acc + f.cantidad, 0);
  const fuentesCosto = Number(fuentesAgrupadas.reduce((acc, f) => acc + f.cantidad * f.precioVenta, 0).toFixed(2));

  const instalacionCosto = Number((conectores.costo + silicon.costo).toFixed(2));

  const materiales = Number((canaletaCosto + tiraCosto + fuentesCosto + cableCosto).toFixed(2));
  const subtotal = Number((materiales + instalacionCosto + manoDeObra).toFixed(2));
  const iva = Number((subtotal * IVA).toFixed(2));
  const total = Number((subtotal + iva).toFixed(2));

  return {
    cliente: cliente?.trim() || '—',
    folio,
    fecha: fechaLarga(),
    vigencia: '15 días naturales',

    tarjetas: {
      metrosLineales: { valor: resultadoCorte.resumen.metrosLineales },
      canaletas: { valor: resultadoCorte.resumen.cantCanaletas, precio: canaletaCosto, nombre: canaleta.descripcion },
      tiras: { valor: resultadoCorte.resumen.cantTiras, precio: tiraCosto, nombre: tira.descripcion },
      fuentes: { valor: fuentesCantidad, precio: fuentesCosto },
      cable: { valor: cableMetros, precio: cableCosto },
      instalacion: { valor: 'Adicionales', precio: instalacionCosto },
    },

    resumen: { materiales, instalacion: instalacionCosto, manoDeObra, subtotal, iva, total },
  };
}
