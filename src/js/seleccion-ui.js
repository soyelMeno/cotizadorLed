import { setSeleccion } from './state.js';

function formatoMoneda(valor) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valor);
}

function renderPreview(contenedor, producto, { mostrarVoltaje }) {
  if (!producto) {
    contenedor.innerHTML = `<p class="preview-vacio">Selecciona una opción para ver el detalle.</p>`;
    return;
  }
  contenedor.innerHTML = `
    <div class="preview-fila"><span>Código</span><strong>${producto.codigo}</strong></div>
    <div class="preview-fila"><span>Largo comercial</span><strong>${producto.longitud} cm</strong></div>
    ${mostrarVoltaje ? `<div class="preview-fila"><span>Voltaje</span><strong>${producto.voltaje} V</strong></div>` : ''}
    <div class="preview-fila"><span>Precio</span><strong>${formatoMoneda(producto.precioVenta)}</strong></div>
  `;
}

function poblarSelect(select, productos) {
  select.innerHTML = '<option value="">Selecciona una opción…</option>';
  productos.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.descripcion} — ${p.longitud} cm`;
    select.appendChild(opt);
  });
}

export function initSeleccion(catalogo) {
  const selectCanaleta = document.getElementById('select-canaleta');
  const selectTira = document.getElementById('select-tira');
  const previewCanaleta = document.getElementById('preview-canaleta');
  const previewTira = document.getElementById('preview-tira');
  const estadoTexto = document.getElementById('estado-seleccion');

  poblarSelect(selectCanaleta, catalogo.canaletas);
  poblarSelect(selectTira, catalogo.tirasLed);
  renderPreview(previewCanaleta, null, { mostrarVoltaje: false });
  renderPreview(previewTira, null, { mostrarVoltaje: true });

  function actualizarEstado() {
    const seleccionCompleta = selectCanaleta.value && selectTira.value;
    estadoTexto.textContent = seleccionCompleta
      ? 'Listo. Ahora puedes ingresar las piezas del proyecto.'
      : 'Selecciona canaleta y tira LED para continuar.';
    estadoTexto.classList.toggle('estado-listo', !!seleccionCompleta);
  }

  selectCanaleta.addEventListener('change', () => {
    const producto = catalogo.canaletas.find(p => p.id === selectCanaleta.value) || null;
    renderPreview(previewCanaleta, producto, { mostrarVoltaje: false });
    setSeleccion('canaleta', producto);
    actualizarEstado();
  });

  selectTira.addEventListener('change', () => {
    const producto = catalogo.tirasLed.find(p => p.id === selectTira.value) || null;
    renderPreview(previewTira, producto, { mostrarVoltaje: true });
    setSeleccion('tira', producto);
    actualizarEstado();
  });

  actualizarEstado();
}
