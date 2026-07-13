const paletaPiezas = ['--p1', '--p2', '--p3', '--p4', '--p5', '--p6'];
const coloresPorMedida = {};

function colorDe(medida) {
  if (!coloresPorMedida[medida]) {
    const idx = Object.keys(coloresPorMedida).length % paletaPiezas.length;
    coloresPorMedida[medida] = `var(${paletaPiezas[idx]})`;
  }
  return coloresPorMedida[medida];
}

function renderGrupo(contenedorId, conteoId, bins, stockLength, prefijo) {
  const contenedor = document.getElementById(contenedorId);
  contenedor.innerHTML = '';
  document.getElementById(conteoId).textContent =
    `${bins.length} ${prefijo.toLowerCase()}${bins.length !== 1 ? 's' : ''}`;

  bins.forEach((bin, i) => {
    const usado = bin.piezas.reduce((a, b) => a + b, 0);
    const sobrante = stockLength - usado;

    const fila = document.createElement('div');
    fila.className = 'fila';

    const etiquetaSobrante = bin.esExtra
      ? 'barra de respaldo'
      : (sobrante > 0 ? `${sobrante} cm sobrante` : 'sin sobrante');

    fila.innerHTML = `
      <div class="fila-encabezado">
        <span class="fila-num">${prefijo} ${i + 1}${bin.esExtra ? ' <span class="badge-extra">extra</span>' : ''}</span>
        <span class="fila-sobrante">${etiquetaSobrante}</span>
      </div>
      <div class="barra-contenedor"></div>
    `;
    const barra = fila.querySelector('.barra-contenedor');

    if (bin.esExtra) {
      const seg = document.createElement('div');
      seg.className = 'segmento sobrante';
      seg.style.width = '100%';
      seg.textContent = 'barra de respaldo';
      barra.appendChild(seg);
    } else {
      bin.piezas.forEach(medida => {
        const seg = document.createElement('div');
        seg.className = 'segmento';
        seg.style.width = (medida / stockLength * 100) + '%';
        seg.style.background = colorDe(medida);
        seg.textContent = medida;
        barra.appendChild(seg);
      });
      if (sobrante > 0) {
        const seg = document.createElement('div');
        seg.className = 'segmento sobrante';
        seg.style.width = (sobrante / stockLength * 100) + '%';
        seg.textContent = sobrante > 30 ? sobrante : '';
        barra.appendChild(seg);
      }
    }

    contenedor.appendChild(fila);
  });
}

export function renderResultado(resultado, { stockCanaleta, stockTira }) {
  document.getElementById('r-metros').textContent = resultado.resumen.metrosLineales;
  document.getElementById('r-canaletas').textContent = resultado.resumen.cantCanaletas;
  document.getElementById('r-tiras').textContent = resultado.resumen.cantTiras;
  document.getElementById('r-piezas').textContent = resultado.resumen.totalPiezas;

  renderGrupo('grupo-canaletas', 'conteo-canaletas', resultado.canaletas, stockCanaleta, 'Canaleta');
  renderGrupo('grupo-tiras', 'conteo-tiras', resultado.tiras, stockTira, 'Led');

  document.getElementById('resultado-vacio').hidden = true;
  document.getElementById('resultado-detalle').hidden = false;
}
