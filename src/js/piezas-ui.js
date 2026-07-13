import { setPiezas } from './state.js';

let piezas = [];
let contador = 0;

function sincronizar() {
  const validas = piezas
    .filter(p => p.medida > 0)
    .map(p => ({ cantidad: p.cantidad, medida: p.medida }));
  setPiezas(validas);
  actualizarTotales(validas);
}

function actualizarTotales(validas) {
  const totalPiezas = validas.reduce((acc, p) => acc + p.cantidad, 0);
  const totalMetros = validas.reduce((acc, p) => acc + p.cantidad * p.medida, 0) / 100;
  document.getElementById('piezas-total-count').textContent = totalPiezas;
  document.getElementById('piezas-total-metros').textContent = totalMetros.toFixed(2);
}

function agregarFila(enfocar = false) {
  const pieza = { id: ++contador, cantidad: 1, medida: 0 };
  piezas.push(pieza);

  const contenedor = document.getElementById('piezas-lista');
  const fila = document.createElement('div');
  fila.className = 'pieza-fila';

  fila.innerHTML = `
    <input type="number" min="1" class="input-cantidad" value="1" aria-label="Cantidad">
    <span class="pieza-x">×</span>
    <input type="number" min="0" step="0.5" class="input-medida vacio" placeholder="cm" aria-label="Medida en centímetros">
    <button type="button" class="btn-eliminar-fila" aria-label="Eliminar pieza">✕</button>
  `;

  const inputCantidad = fila.querySelector('.input-cantidad');
  const inputMedida = fila.querySelector('.input-medida');
  const btnEliminar = fila.querySelector('.btn-eliminar-fila');

  inputCantidad.addEventListener('input', () => {
    console.log('cantidad');
    pieza.cantidad = Math.max(1, Number(inputCantidad.value) || 1);
    sincronizar();
  });

  inputMedida.addEventListener('input', () => {
    pieza.medida = Number(inputMedida.value) || 0;
    inputMedida.classList.toggle('vacio', !pieza.medida);
    sincronizar();
  });

  // Enter en "medida" agrega la siguiente fila y le da el foco de inmediato
  inputMedida.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      agregarFila(true);
    }
  });

  btnEliminar.addEventListener('click', () => {
    if (piezas.length === 1) {
      // nunca dejar la lista en cero filas: solo se limpia
      pieza.cantidad = 1;
      pieza.medida = 0;
      inputCantidad.value = 1;
      inputMedida.value = '';
      inputMedida.classList.add('vacio');
      sincronizar();
      inputMedida.focus();
      return;
    }
    piezas = piezas.filter(p => p.id !== pieza.id);
    fila.remove();
    sincronizar();
  });

  contenedor.appendChild(fila);
  if (enfocar) inputCantidad.focus();
}

let inicializado = false;

export function initPiezas() {
  console.log('initPiezas ejecutado');
  if (inicializado) return; // evita duplicar listeners si se llama más de una vez
  inicializado = true;

  document.getElementById('btn-agregar-pieza').addEventListener('click', () => agregarFila(true));
  agregarFila(); // primera fila lista para escribir
  sincronizar();
}

console.log('piezas-ui.js cargado');