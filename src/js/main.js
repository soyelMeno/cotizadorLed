import { cargarCatalogo } from './js/catalog.js';
import { initSeleccion } from './js/seleccion-ui.js';
import { initPiezas } from './js/piezas-ui.js';

async function iniciar() {
  initPiezas(); // la lista de piezas siempre está disponible, sin depender de la selección

  try {
    const catalogo = await cargarCatalogo();

    if (catalogo.canaletas.length === 0 || catalogo.tirasLed.length === 0) {
      document.getElementById('estado-seleccion').textContent =
        'No hay canaletas o tiras LED activas en el catálogo. Verifica Firestore.';
      return;
    }

    initSeleccion(catalogo);
  } catch (err) {
    console.error(err);
    document.getElementById('estado-seleccion').textContent =
      'Error al cargar el catálogo: ' + err.message;
  }
}

iniciar();
