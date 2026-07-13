import { cargarCatalogo } from './js/catalog.js';
import { initSeleccion } from './js/seleccion-ui.js';
import { initPiezas } from './js/piezas-ui.js';
import { initModulos, getModulos } from './js/modulos-ui.js';
import {
  getSeleccion, getPiezas,
  setResultadoCotizacion, getResultadoCotizacion,
  setResultadoAdicionales, getResultadoAdicionales,
} from './js/state.js';
import { cotizar } from './js/optimizer.js';
import { renderResultado } from './js/resultado-ui.js';
import { calcularConectores, calcularSilicon } from './js/materiales-instalacion.js';
import { calcularAdicionales } from './js/adicionales.js';
import { renderAdicionales } from './js/adicionales-ui.js';
import { generarPropuesta } from './js/propuesta.js';
import { descargarPropuesta, descargarUltimaPropuesta } from './js/proposal-ui.js';
import { siguienteFolio } from './js/folio.js';

function manejarCotizar(catalogo) {
  const mensaje = document.getElementById('cotizar-mensaje');
  mensaje.textContent = '';

  const { canaleta, tira } = getSeleccion();
  const piezas = getPiezas();

  if (!canaleta || !tira) {
    mensaje.textContent = 'Selecciona canaleta y tira LED antes de cotizar.';
    return;
  }
  if (piezas.length === 0) {
    mensaje.textContent = 'Agrega al menos una pieza con su medida.';
    return;
  }

  const piezaDemasiadoLarga = piezas.find(
    p => p.medida > canaleta.longitud || p.medida > tira.longitud
  );
  if (piezaDemasiadoLarga) {
    mensaje.textContent = `La pieza de ${piezaDemasiadoLarga.medida}cm es más larga que el material disponible (canaleta ${canaleta.longitud}cm / tira ${tira.longitud}cm).`;
    return;
  }

  const resultadoCorte = cotizar({ canaletaProducto: canaleta, tiraProducto: tira, piezas });
  renderResultado(resultadoCorte, { stockCanaleta: canaleta.longitud, stockTira: tira.longitud });

  const conectores = calcularConectores(piezas, catalogo.conectores[0]);
  const silicon = calcularSilicon(piezas, catalogo.silicon[0]);
  setResultadoCotizacion({ resultadoCorte, conectores, silicon });
}

function manejarAdicionales(catalogo) {
  const mensaje = document.getElementById('adicionales-mensaje');
  mensaje.textContent = '';

  const { tira } = getSeleccion();
  if (!tira) {
    mensaje.textContent = 'Selecciona primero la tira LED (define el voltaje de las fuentes).';
    return;
  }

  const cables = {
    metrosAC: Number(document.getElementById('cable-ac').value) || 0,
    metrosDC22: Number(document.getElementById('cable-dc22').value) || 0,
    metrosDC18: Number(document.getElementById('cable-dc18').value) || 0,
  };
  const modulos = getModulos();

  if (modulos.length === 0 && cables.metrosAC === 0 && cables.metrosDC22 === 0 && cables.metrosDC18 === 0) {
    mensaje.textContent = 'Agrega metros de cable o al menos un módulo con watts.';
    return;
  }

  const resultado = calcularAdicionales({
    cables,
    modulos,
    catalogoCables: catalogo.cables,
    catalogoFuentes: catalogo.fuentes,
    voltajeTira: tira.voltaje,
  });

  renderAdicionales(resultado);
  setResultadoAdicionales(resultado);
}

async function manejarPropuesta() {
  const mensaje = document.getElementById('ticket-mensaje');
  mensaje.textContent = '';

  const { canaleta, tira } = getSeleccion();
  const resultadoCotizacion = getResultadoCotizacion();

  if (!canaleta || !tira || !resultadoCotizacion) {
    mensaje.textContent = 'Primero da clic en "Cotizar materiales".';
    return;
  }

  const boton = document.getElementById('btn-generar-ticket');
  boton.disabled = true;
  boton.textContent = 'Generando folio…';

  try {
    const cliente = document.getElementById('input-cliente').value;
    const manoDeObra = Number(document.getElementById('mano-obra').value) || 0;
    const resultadoAdicionales = getResultadoAdicionales(); // puede ser null, es opcional

    const folio = await siguienteFolio();

    const propuesta = generarPropuesta({
      cliente, folio, canaleta, tira, resultadoCotizacion, resultadoAdicionales, manoDeObra,
    });

    boton.textContent = 'Generando PDF…';
    await descargarPropuesta(propuesta);

    const avisoGenerado = document.getElementById('propuesta-generada');
    document.getElementById('folio-generado').textContent = folio;
    avisoGenerado.hidden = false;
    avisoGenerado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (err) {
    console.error(err);
    mensaje.textContent = 'Error al generar el PDF: ' + err.message;
  } finally {
    boton.disabled = false;
    boton.textContent = 'Generar propuesta';
  }
}

async function iniciar() {
  initPiezas();
  initModulos();
  document.getElementById('btn-generar-ticket').addEventListener('click', manejarPropuesta);
  document.getElementById('btn-reabrir').addEventListener('click', descargarUltimaPropuesta);

  try {
    const catalogo = await cargarCatalogo();

    if (catalogo.canaletas.length === 0 || catalogo.tirasLed.length === 0) {
      document.getElementById('estado-seleccion').textContent =
        'No hay canaletas o tiras LED activas en el catálogo. Verifica Firestore.';
      return;
    }

    initSeleccion(catalogo);
    document.getElementById('btn-cotizar').addEventListener('click', () => manejarCotizar(catalogo));
    document.getElementById('btn-adicionales').addEventListener('click', () => manejarAdicionales(catalogo));
  } catch (err) {
    console.error(err);
    document.getElementById('estado-seleccion').textContent =
      'Error al cargar el catálogo: ' + err.message;
  }
}

iniciar();
