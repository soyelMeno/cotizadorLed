const estado = {
  canaleta: null,
  tira: null,
  piezas: [],
  resultadoCotizacion: null,  // { resultadoCorte, conectores, silicon }
  resultadoAdicionales: null, // { cables, modulos, costoTotal }
};

const listeners = [];

export function setSeleccion(tipo, producto) {
  estado[tipo] = producto;
  listeners.forEach(fn => fn({ ...estado }));
}

export function getSeleccion() {
  return { canaleta: estado.canaleta, tira: estado.tira };
}

export function setPiezas(piezas) {
  estado.piezas = piezas;
}

export function getPiezas() {
  return estado.piezas;
}

export function setResultadoCotizacion(resultado) {
  estado.resultadoCotizacion = resultado;
}

export function getResultadoCotizacion() {
  return estado.resultadoCotizacion;
}

export function setResultadoAdicionales(resultado) {
  estado.resultadoAdicionales = resultado;
}

export function getResultadoAdicionales() {
  return estado.resultadoAdicionales;
}

export function onCambioSeleccion(fn) {
  listeners.push(fn);
}
