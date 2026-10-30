import { setSeleccion, setUsaCanaleta } from './state.js';
import { canaletasCompatibles, admiteCanaleta } from './compatibilidad.js';

function formatoMoneda(valor) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valor);
}

function precioPorMetro(producto) {
  const metros = Number(producto.longitud) / 100;
  if (!(metros > 0)) return null;
  return producto.precioVenta / metros;
}

function renderPreviewCanaleta(contenedor, producto) {
  if (!producto) {
    contenedor.innerHTML = `<p class="preview-vacio">Selecciona una opción para ver el detalle.</p>`;
    return;
  }
  contenedor.innerHTML = `
    <div class="preview-fila"><span>Código</span><strong>${producto.codigo}</strong></div>
    <div class="preview-fila"><span>Largo comercial</span><strong>${producto.longitud} cm</strong></div>
    <div class="preview-fila"><span>Interior</span><strong>${producto.interior ?? '—'} mm</strong></div>
    <div class="preview-fila"><span>Precio por barra</span><strong>${formatoMoneda(producto.precioVenta)}</strong></div>
  `;
}

function renderPreviewTira(contenedor, producto) {
  if (!producto) {
    contenedor.innerHTML = `<p class="preview-vacio">Selecciona una opción para ver el detalle.</p>`;
    return;
  }
  const porMetro = precioPorMetro(producto);
  contenedor.innerHTML = `
    <div class="preview-fila"><span>Código</span><strong>${producto.codigo}</strong></div>
    <div class="preview-fila"><span>Voltaje</span><strong>${producto.voltaje} V</strong></div>
    <div class="preview-fila"><span>Consumo</span><strong>${producto.watts ?? '—'} W/m</strong></div>
    <div class="preview-fila"><span>Ancho</span><strong>${producto.ancho ? producto.ancho + ' mm' : 'Sin canaleta'}</strong></div>
    <div class="preview-fila"><span>Precio por metro</span><strong>${porMetro !== null ? formatoMoneda(porMetro) : '—'}</strong></div>
  `;
}

function poblarSelect(select, productos, textoVacio = 'Selecciona una opción…') {
  select.innerHTML = `<option value="">${textoVacio}</option>`;
  productos.forEach((p) => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.descripcion} — ${p.longitud} cm`;
    select.appendChild(opt);
  });
}

export function initSeleccion(catalogo) {
  const selectCanaleta = document.getElementById('select-canaleta');
  const selectTira = document.getElementById('select-tira');
  const checkCanaleta = document.getElementById('check-canaleta');
  const previewCanaleta = document.getElementById('preview-canaleta');
  const previewTira = document.getElementById('preview-tira');
  const avisoCanaleta = document.getElementById('aviso-canaleta');
  const estadoTexto = document.getElementById('estado-seleccion');

  poblarSelect(selectTira, catalogo.tirasLed);
  poblarSelect(selectCanaleta,catalogo.canaletas);
  renderPreviewTira(previewTira, null);
  renderPreviewCanaleta(previewCanaleta, null);

  function tiraActual() {
    return catalogo.tirasLed.find((p) => p.id === selectTira.value) || null;
  }

  function actualizarEstado() {
    const tiraLista = Boolean(selectTira.value);
    const canaletaLista = !checkCanaleta.checked || Boolean(selectCanaleta.value);
    const listo = tiraLista && canaletaLista;

    estadoTexto.textContent = listo
      ? 'Listo. Ahora puedes ingresar las piezas del proyecto.'
      : 'Completa la selección para continuar.';
    estadoTexto.classList.toggle('estado-listo', listo);
  }

  // La casilla decide si la canaleta participa; el select se apaga cuando no.
  function aplicarEstadoCasilla() {
    const activa = checkCanaleta.checked && !checkCanaleta.disabled;
    setUsaCanaleta(activa);
    selectCanaleta.disabled = !activa;

    if (!activa) {
      selectCanaleta.value = '';
      setSeleccion('canaleta', null);
      renderPreviewCanaleta(previewCanaleta, null);
    }
    actualizarEstado();
  }

  // Cada vez que cambia la tira, se recalculan las canaletas que le quedan.
  function refrescarCompatibles() {
    const tira = tiraActual();
    avisoCanaleta.textContent = '';

    if (!tira) {
      checkCanaleta.disabled = true;
      selectCanaleta.innerHTML = '<option value="">Selecciona primero la tira LED…</option>';
      aplicarEstadoCasilla();
      return;
    }

    if (!admiteCanaleta(tira)) {
      checkCanaleta.checked = false;
      checkCanaleta.disabled = true;
      avisoCanaleta.textContent = 'Esta tira trae protección propia y no se instala en canaleta.';
      selectCanaleta.innerHTML = '<option value="">No aplica</option>';
      aplicarEstadoCasilla();
      return;
    }

    const compatibles = canaletasCompatibles(catalogo.canaletas, tira);

    if (compatibles.length === 0) {
      checkCanaleta.checked = false;
      checkCanaleta.disabled = true;
      avisoCanaleta.textContent = `Ninguna canaleta del catálogo tiene interior mayor a ${tira.ancho} mm.`;
      selectCanaleta.innerHTML = '<option value="">Sin opciones compatibles</option>';
    } else {
      checkCanaleta.disabled = false;
      poblarSelect(selectCanaleta, compatibles);
      const plural = compatibles.length > 1;
      avisoCanaleta.textContent = `${compatibles.length} canaleta${plural ? 's' : ''} compatible${plural ? 's' : ''} con una tira de ${tira.ancho} mm.`;
    }

    setSeleccion('canaleta', null);
    renderPreviewCanaleta(previewCanaleta, null);
    aplicarEstadoCasilla();
  }

  selectTira.addEventListener('change', () => {
    const producto = tiraActual();
    renderPreviewTira(previewTira, producto);
    setSeleccion('tira', producto);
    refrescarCompatibles();
  });

  selectCanaleta.addEventListener('change', () => {
    const producto = catalogo.canaletas.find((p) => p.id === selectCanaleta.value) || null;
    renderPreviewCanaleta(previewCanaleta, producto);
    setSeleccion('canaleta', producto);
    actualizarEstado();
  });

  checkCanaleta.addEventListener('change', aplicarEstadoCasilla);

  refrescarCompatibles();
}
