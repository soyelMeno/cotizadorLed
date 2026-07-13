import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase.js';

const COLECCIONES = ['canaletas', 'tirasLed', 'fuentes', 'cables', 'conectores', 'silicon', 'otros'];

async function traerColeccion(nombre) {
  const snap = await getDocs(collection(db, nombre));
  console.log(`[diagnóstico] ${nombre}: ${snap.size} documentos`);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

console.log('[diagnóstico] Proyecto Firebase en uso:', db.app.options.projectId);

// Trae todo el catálogo de una vez. Devuelve, por ejemplo:
// { canaletas: [...], tirasLed: [...], fuentes: [...], ... }
export async function cargarCatalogo() {
  const resultados = await Promise.all(COLECCIONES.map(traerColeccion));
  return COLECCIONES.reduce((acc, nombre, i) => {
    acc[nombre] = resultados[i];
    return acc;
  }, {});
}
