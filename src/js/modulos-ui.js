let modulos = [];
let contador = 0;

function agregarFila(enfocar = false) {
  contador++;
  const modulo = { id: contador, nombre: `Módulo ${contador}`, metros: 0 };
  modulos.push(modulo);

  const contenedor = document.getElementById('modulos-lista');
  const fila = document.createElement('div');
  fila.className = 'modulo-fila';

  fila.innerHTML = `
    <input type="text" class="input-nombre" value="${modulo.nombre}" aria-label="Nombre del módulo">
    <input type="number" min="0" step="0.5" class="input-metros" placeholder="metros" aria-label="Metros de tira LED del módulo">
    <button type="button" class="btn-eliminar-fila" aria-label="Eliminar módulo">✕</button>
  `;

  const inputNombre = fila.querySelector('.input-nombre');
  const inputMetros = fila.querySelector('.input-metros');
  const btnEliminar = fila.querySelector('.btn-eliminar-fila');

  inputNombre.addEventListener('input', () => { modulo.nombre = inputNombre.value; });
  inputMetros.addEventListener('input', () => { modulo.metros = Number(inputMetros.value) || 0; });

  inputMetros.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      agregarFila(true);
    }
  });

  btnEliminar.addEventListener('click', () => {
    if (modulos.length === 1) {
      modulo.metros = 0;
      inputMetros.value = '';
      inputMetros.focus();
      return;
    }
    modulos = modulos.filter(m => m.id !== modulo.id);
    fila.remove();
  });

  contenedor.appendChild(fila);
  if (enfocar) inputMetros.focus();
}

let inicializado = false;

export function initModulos() {
  if (inicializado) return;
  inicializado = true;
  document.getElementById('btn-agregar-modulo').addEventListener('click', () => agregarFila(true));
  agregarFila();
}

export function getModulos() {
  return modulos.filter(m => m.metros > 0).map(m => ({ nombre: m.nombre, metros: m.metros }));
}
