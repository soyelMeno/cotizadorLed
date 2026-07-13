import { doc, runTransaction } from 'firebase/firestore';
import { db } from './firebase.js';

const FOLIO_DOC = doc(db, 'config', 'folio');
const NUMERO_INICIAL = 2624; // el primer folio generado será LED-2625

export async function siguienteFolio() {
  const numero = await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(FOLIO_DOC);
    const actual = snap.exists() ? snap.data().ultimoNumero : NUMERO_INICIAL;
    const siguiente = actual + 1;
    transaction.set(FOLIO_DOC, { ultimoNumero: siguiente }, { merge: true });
    return siguiente;
  });
  return `LED-${numero}`;
}
