function formatoMoneda(valor) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valor);
}

export function renderAdicionales(resultado) {
  const contenedor = document.getElementById('adicionales-resultado');
  contenedor.hidden = false;

  let html = '';

  if (resultado.cables.lineas.length > 0) {
    html += `<h3 class="bloque-titulo">Cable</h3>`;
    resultado.cables.lineas.forEach(l => {
      html += `
        <div class="adicionales-resumen-fila">
          <span>${l.etiqueta} (${l.metros} m)</span>
          <strong>${formatoMoneda(l.costo)}</strong>
        </div>`;
    });
  }

  html += `<h3 class="bloque-titulo" style="margin-top:16px;">Fuentes de poder</h3>`;
  resultado.modulos.forEach(m => {
    if (m.sinCobertura) {
      html += `
        <div class="adicionales-resumen-fila">
          <span>${m.nombre} (${m.watts}W) — sin fuente compatible en catálogo</span>
          <strong>—</strong>
        </div>`;
    } else {
      const detalleFuentes = m.fuentes.map(f => f.descripcion).join(' + ');
      html += `
        <div class="adicionales-resumen-fila">
          <span>${m.nombre} (${m.watts}W → ${m.objetivo}W con margen): ${detalleFuentes}</span>
          <strong>${formatoMoneda(m.costo)}</strong>
        </div>`;
    }
  });

  html += `
    <div class="adicionales-total">
      <span>Total adicionales</span>
      <strong>${formatoMoneda(resultado.costoTotal)}</strong>
    </div>`;

  contenedor.innerHTML = html;
}
