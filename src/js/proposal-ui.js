import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { construirHTMLPropuesta } from './proposal-template.js';
import proposalCSS from '../css/proposal.css?inline';

let ultimoHTML = null;
let ultimoFolio = null;

const PX_POR_MM = 3.7795275591; // 96dpi

function crearIframeOculto() {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.left = '-99999px';
  iframe.style.top = '0';
  iframe.style.width = '210mm';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);
  return iframe;
}

function escribirDocumento(iframe, html) {
  return new Promise((resolve) => {
    const doc = iframe.contentDocument;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html><head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
        <style>${proposalCSS}</style>
      </head>
      <body>${html}</body></html>
    `);
    doc.close();

    // Esperar a que carguen las fuentes web antes de capturar la imagen
    if (doc.fonts && doc.fonts.ready) {
      doc.fonts.ready.then(() => setTimeout(resolve, 250));
    } else {
      setTimeout(resolve, 600);
    }
  });
}

function esMovil() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

async function entregarPDF(blob, nombreArchivo) {
  if (esMovil() && navigator.canShare) {
    const archivo = new File([blob], nombreArchivo, { type: 'application/pdf' });
    if (navigator.canShare({ files: [archivo] })) {
      try {
        await navigator.share({ files: [archivo], title: 'Propuesta Económica' });
        return;
      } catch (err) {
        if (err.name === 'AbortError') return; // el usuario canceló el panel, no hacemos nada más
        // si falla por cualquier otra razón, seguimos abajo con la descarga normal
      }
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function generarYDescargarPDF(html, folio) {
  const iframe = crearIframeOculto();

  try {
    await escribirDocumento(iframe, html);

    const doc = iframe.contentDocument;
    const elemento = doc.querySelector('.proposal');

    const canvas = await html2canvas(elemento, {
      scale: 2,
      useCORS: true,
      windowWidth: elemento.scrollWidth,
      windowHeight: elemento.scrollHeight,
    });

    // El PDF se dimensiona exactamente al contenido real: garantiza 1 sola página siempre
    const anchoMM = elemento.scrollWidth / PX_POR_MM;
    const altoMM = elemento.scrollHeight / PX_POR_MM;

    const pdf = new jsPDF({ unit: 'mm', format: [anchoMM, altoMM] });
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData, 'JPEG', 0, 0, anchoMM, altoMM);

    const blob = pdf.output('blob');
    await entregarPDF(blob, `Propuesta-${folio}.pdf`);
  } finally {
    document.body.removeChild(iframe);
  }
}

export async function descargarPropuesta(propuesta) {
  ultimoHTML = construirHTMLPropuesta(propuesta);
  ultimoFolio = propuesta.folio;
  await generarYDescargarPDF(ultimoHTML, ultimoFolio);
}

export async function descargarUltimaPropuesta() {
  if (!ultimoHTML) return;
  await generarYDescargarPDF(ultimoHTML, ultimoFolio);
}
