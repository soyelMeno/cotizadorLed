// Reglas de compatibilidad entre tira LED y canaleta.
//
// - Una tira solo entra en una canaleta si su 'ancho' es MENOR al 'interior' de la canaleta.
// - Una tira sin 'ancho' (ej. la de 110V, que trae forro IP65 propio) no se instala
//   en canaleta: la ausencia del dato es la señal, no hace falta una bandera aparte.

export function admiteCanaleta(tira) {
  return Number(tira?.ancho) > 0;
}

export function esCompatible(canaleta, tira) {
  if (!admiteCanaleta(tira)) return false;
  const interior = Number(canaleta?.interior);
  if (!(interior > 0)) return false;
  return Number(tira.ancho) < interior;
}

export function canaletasCompatibles(canaletas, tira) {
  return canaletas.filter((canaleta) => esCompatible(canaleta, tira));
}
