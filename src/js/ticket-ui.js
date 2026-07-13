function formatoMoneda(valor) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valor);
}

export function renderTicket(ticket) {
  const contenedor = document.getElementById('ticket-contenido');

  const filas = ticket.items.map(it => `
    <div class="ticket-fila">
      <span>${it.etiqueta}<span class="ticket-cant"> × ${it.cantidad} ${it.unidad}</span></span>
      <span>${formatoMoneda(it.costo)}</span>
    </div>`).join('');

  const fecha = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });

  contenedor.innerHTML = `
    <div class="ticket-header">
      <h3>Cotización — Instalación LED</h3>
      <p>${fecha}</p>
    </div>
    <div class="ticket-separador"></div>
    ${filas}
    <div class="ticket-separador"></div>
    <div class="ticket-fila"><span>Subtotal materiales</span><span>${formatoMoneda(ticket.subtotalMateriales)}</span></div>
    <div class="ticket-fila"><span>Mano de obra</span><span>${formatoMoneda(ticket.manoDeObra)}</span></div>
    <div class="ticket-separador"></div>
    <div class="ticket-fila ticket-total"><span>TOTAL</span><span>${formatoMoneda(ticket.total)}</span></div>
  `;

  document.getElementById('ticket-section').hidden = false;
}
