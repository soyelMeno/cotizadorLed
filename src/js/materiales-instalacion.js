export function calcularConectores(piezas, productoConector) {
  const totalPiezas = piezas.reduce((acc, p) => acc + p.cantidad, 0);
  const cantidad = Math.ceil(totalPiezas * 1.5);
  const costo = productoConector ? Number((cantidad * productoConector.precioVenta).toFixed(2)) : 0;
  return { cantidad, costo, producto: productoConector || null };
}

export function calcularSilicon(piezas, productoSilicon) {
  const metrosLineales = piezas.reduce((acc, p) => acc + p.cantidad * p.medida, 0) / 100;

  if (!productoSilicon || !productoSilicon.longitud) {
    return { cantidad: 0, costo: 0, producto: productoSilicon || null };
  }

  const cantidad = Math.ceil((metrosLineales * 100) / productoSilicon.longitud);
  const costo = Number((cantidad * productoSilicon.precioVenta).toFixed(2));
  return { cantidad, costo, producto: productoSilicon };
}
