function agruparFuentes(modulos) {
  const mapa = {};
  modulos.forEach(m => {
    if (m.sinCobertura) return;
    m.fuentes.forEach(f => {
      if (!mapa[f.codigo]) mapa[f.codigo] = { ...f, cantidad: 0 };
      mapa[f.codigo].cantidad++;
    });
  });
  return Object.values(mapa);
}

export function generarTicket({ canaleta, tira, resultadoCotizacion, resultadoAdicionales, manoDeObra }) {
  const { resultadoCorte, conectores, silicon } = resultadoCotizacion;
  const items = [];

  items.push({
    etiqueta: canaleta.descripcion,
    cantidad: resultadoCorte.resumen.cantCanaletas,
    unidad: 'pz',
    costo: Number((resultadoCorte.resumen.cantCanaletas * canaleta.precioVenta).toFixed(2)),
  });
  items.push({
    etiqueta: tira.descripcion,
    cantidad: resultadoCorte.resumen.cantTiras,
    unidad: 'pz',
    costo: Number((resultadoCorte.resumen.cantTiras * tira.precioVenta).toFixed(2)),
  });

  if (conectores.cantidad > 0) {
    items.push({
      etiqueta: conectores.producto?.descripcion || 'Conectores',
      cantidad: conectores.cantidad,
      unidad: 'pz',
      costo: conectores.costo,
    });
  }
  if (silicon.cantidad > 0) {
    items.push({
      etiqueta: silicon.producto?.descripcion || 'Silicón',
      cantidad: silicon.cantidad,
      unidad: 'pz',
      costo: silicon.costo,
    });
  }

  if (resultadoAdicionales) {
    resultadoAdicionales.cables.lineas.forEach(l => {
      items.push({ etiqueta: l.etiqueta, cantidad: l.metros, unidad: 'm', costo: l.costo });
    });

    agruparFuentes(resultadoAdicionales.modulos).forEach(f => {
      items.push({
        etiqueta: f.descripcion,
        cantidad: f.cantidad,
        unidad: 'pz',
        costo: Number((f.cantidad * f.precioVenta).toFixed(2)),
      });
    });
  }

  const subtotalMateriales = Number(items.reduce((acc, it) => acc + it.costo, 0).toFixed(2));
  const total = Number((subtotalMateriales + manoDeObra).toFixed(2));

  return { items, subtotalMateriales, manoDeObra, total };
}
