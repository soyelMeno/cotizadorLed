let modulos = [];
let contador = 0;

function agregarFila(enfocar = false) {
  contador++;
  const modulo = { id: contador, nombre: `Módulo ${contador}`, watts: 0 };
  modulos.push(modulo);

  const contenedor = document.getElementById('modulos-lista');
  const fila = document.createElement('div');
  fila.className = 'modulo-fila';

  fila.innerHTML = `
    <input type="text" class="input-nombre" value="${modulo.nombre}" aria-label="Nombre del módulo">
    <input type="number" min="0" step="1" class="input-watts" placeholder="watts" aria-label="Watts del módulo">
    <button type="button" class="btn-eliminar-fila" aria-label="Eliminar módulo">✕</button>
  `;

  const inputNombre = fila.querySelector('.input-nombre');
  const inputWatts = fila.querySelector('.input-watts');
  const btnEliminar = fila.querySelector('.btn-eliminar-fila');

  inputNombre.addEventListener('input', () => { modulo.nombre = inputNombre.value; });
  inputWatts.addEventListener('input', () => { modulo.watts = Number(inputWatts.value) || 0; });

  inputWatts.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      agregarFila(true);
    }
  });

  btnEliminar.addEventListener('click', () => {
    if (modulos.length === 1) {
      modulo.watts = 0;
      inputWatts.value = '';
      inputWatts.focus();
      return;
    }
    modulos = modulos.filter(m => m.id !== modulo.id);
    fila.remove();
  });

  contenedor.appendChild(fila);
  if (enfocar) inputWatts.focus();
}

let inicializado = false;

export function initModulos() {
  if (inicializado) return;
  inicializado = true;
  document.getElementById('btn-agregar-modulo').addEventListener('click', () => agregarFila(true));
  agregarFila();
}

export function getModulos() {
  return modulos.filter(m => m.watts > 0).map(m => ({ nombre: m.nombre, watts: m.watts }));
}
