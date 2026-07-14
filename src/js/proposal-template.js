function formatoMoneda(valor) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(valor);
}

export function construirHTMLPropuesta(propuesta) {
  const t = propuesta.tarjetas;
  const r = propuesta.resumen;
  const hayCliente = propuesta.cliente && propuesta.cliente !== '—';

  const saludo = hayCliente
    ? `Hola <strong>${propuesta.cliente}</strong>. Realizamos el análisis técnico para definir una solución que contempla la optimización del sistema, el aprovechamiento eficiente de los materiales y acompañamiento durante el diseño del mueble para garantizar una circuito eléctrico discreto, seguro y duradero.`
    : `Realizamos el análisis técnico para definir una solución que contempla la optimización del sistema, el aprovechamiento eficiente de los materiales y acompañamiento durante el diseño del mueble para garantizar una circuito eléctrico discreto, seguro y duradero.`;

  return `
<main class="proposal">

  <header class="proposal-header">
    <section class="brand-section">
      <img src="/logo.png" alt="AC Letreros" class="brand-logo" onerror="this.style.visibility='hidden'">
      <div class="brand-caption">
        <span>SOLUCIONES DE ILUMINACIÓN</span>
        <span>ARQUITECTÓNICA</span>
      </div>
    </section>

    <div class="header-divider"></div>

    <section class="proposal-information">
      <h1 class="proposal-title">PROPUESTA ECONÓMICA</h1>
      <div class="proposal-data">
        <div class="proposal-row"><span class="label">Cliente</span><span class="value">${propuesta.cliente}</span></div>
        <div class="proposal-row"><span class="label">Folio</span><span class="value">${propuesta.folio}</span></div>
        <div class="proposal-row"><span class="label">Fecha</span><span class="value">${propuesta.fecha}</span></div>
        <div class="proposal-row"><span class="label">Vigencia</span><span class="value">${propuesta.vigencia}</span></div>
      </div>
    </section>
  </header>

  <hr class="section-divider">

  <section class="project-scope">
    <h2 class="section-title">ALCANCE DEL PROYECTO</h2>
    <div class="scope-content">
      <p>${saludo}</p>
    </div>
  </section>

  <section class="project-analysis">
    <header class="analysis-header">
      <h2 class="section-title">RESULTADO DEL ANÁLISIS</h2>
      <p class="section-description">Derivado del análisis de requerimientos, se especifican los materiales y componentes necesarios para la implementación del sistema de iluminación propuesto.</p>
    </header>

    <div class="analysis-grid">

      <article class="analysis-card">
        <div class="analysis-top">
          <div class="analysis-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z"/>
              <path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/>
            </svg>
          </div>
          <div class="analysis-value">${t.metrosLineales.valor}</div>
        </div>
        <div class="analysis-label">METROS LINEALES</div>
      </article>

      <article class="analysis-card">
        <div class="analysis-top">
          <div class="analysis-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4v11a5 5 0 0 0 5 5h6a5 5 0 0 0 5-5V4"/><path d="M4 4h16"/>
            </svg>
          </div>
          <div class="analysis-value">${t.canaletas.valor}</div>
        </div>
        <div class="analysis-label">${t.canaletas.nombre.toUpperCase()}</div>
        <div class="analysis-divider"></div>
        <div class="analysis-price">${formatoMoneda(t.canaletas.precio)}</div>
      </article>

      <article class="analysis-card led">
        <div class="analysis-top">
          <div class="analysis-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="9" width="20" height="6" rx="1"/>
              <line x1="6" y1="9" x2="6" y2="15"/><line x1="10" y1="9" x2="10" y2="15"/><line x1="14" y1="9" x2="14" y2="15"/><line x1="18" y1="9" x2="18" y2="15"/>
            </svg>
          </div>
          <div class="analysis-value">${t.tiras.valor}</div>
        </div>
        <div class="analysis-label">${t.tiras.nombre.toUpperCase()}</div>
        <div class="analysis-divider"></div>
        <div class="analysis-price">${formatoMoneda(t.tiras.precio)}</div>
      </article>

      <article class="analysis-card">
        <div class="analysis-top">
          <div class="analysis-icon dark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
            </svg>
          </div>
          <div class="analysis-value">${t.fuentes.valor}</div>
        </div>
        <div class="analysis-label">FUENTES (DRIVERS)</div>
        <div class="analysis-divider"></div>
        <div class="analysis-price">${formatoMoneda(t.fuentes.precio)}</div>
      </article>

      <article class="analysis-card">
        <div class="analysis-top">
          <div class="analysis-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/>
            </svg>
          </div>
          <div class="analysis-value">${t.cable.valor} m</div>
        </div>
        <div class="analysis-label">CABLE DE COBRE EN DIVERSOS CALIBRES</div>
        <div class="analysis-divider"></div>
        <div class="analysis-price">${formatoMoneda(t.cable.precio)}</div>
      </article>

      <article class="analysis-card installation">
        <div class="analysis-top">
          <div class="analysis-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94Z"/>
            </svg>
          </div>
          <div class="analysis-value installation">${t.instalacion.valor}</div>
        </div>
        <div class="analysis-label">MATERIALES DE INSTALACIÓN</div>
        <div class="analysis-divider"></div>
        <div class="analysis-price">${formatoMoneda(t.instalacion.precio)}</div>
      </article>

    </div>
  </section>

  <section class="proposal-closing">
    <section class="economic-summary">
      <h2 class="section-title">RESUMEN ECONÓMICO</h2>
      <div class="summary-table">
        <div class="summary-row"><span>Materiales</span><strong>${formatoMoneda(r.materiales)}</strong></div>
        <div class="summary-row"><span>Materiales de instalación</span><strong>${formatoMoneda(r.instalacion)}</strong></div>
        <div class="summary-row"><span>Mano de obra</span><strong>${formatoMoneda(r.manoDeObra)}</strong></div>
        <div class="summary-divider"></div>
        <div class="summary-row"><span>Subtotal</span><strong>${formatoMoneda(r.subtotal)}</strong></div>
        <div class="summary-row"><span>IVA</span><strong>${formatoMoneda(r.iva)}</strong></div>
        <div class="summary-total"><span>Total</span><strong>${formatoMoneda(r.total)}</strong></div>
      </div>
    </section>

    <section class="proposal-conditions">
      <h2 class="section-title">CONDICIONES DEL SERVICIO</h2>

      <div class="condition">
        <div class="condition-icon success">✓</div>
        <div>
          <strong>Garantía</strong>
          <p>Todos nuestros trabajos cuentan con <strong>12 meses de garantía</strong> sobre la instalación realizada.</p>
        </div>
      </div>

      <div class="condition">
        <div class="condition-icon">•</div>
        <div>
          <strong>Preparación del proyecto</strong>
          <p>En proyectos de carpintería, los módulos deberán encontrarse armados y con las adecuaciones previamente acordadas antes de iniciar los trabajos.</p>
        </div>
      </div>

      <div class="condition">
        <div class="condition-icon">•</div>
        <div>
          <strong>Inicio del proyecto</strong>
          <p>Para programar el inicio del proyecto es necesario contar con el pago correspondiente a los materiales.</p>
        </div>
      </div>

      <div class="condition">
        <div class="condition-icon">•</div>
        <div>
          <strong>Disponibilidad de materiales</strong>
          <p>Algunos materiales especiales pueden requerir hasta 10 días hábiles dependiendo de la disponibilidad del proveedor.</p>
        </div>
      </div>
    </section>
  </section>

  <footer class="proposal-footer">
    <div class="footer-divider"></div>
    <blockquote class="proposal-quote">"La iluminación adecuada transforma la manera en que vivimos un espacio."</blockquote>
    <p class="footer-message">Gracias por la confianza. Esperamos tener la oportunidad de participar en la realización de su proyecto.</p>
    <div class="footer-brand">
      <img src="/logo-gray.png" alt="AC Letreros" onerror="this.style.visibility='hidden'">
      <span>Soluciones de iluminación LED personalizadas</span>
    </div>
  </footer>

</main>`;
}
