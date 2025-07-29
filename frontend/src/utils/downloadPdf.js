import html2pdf from "html2pdf.js";

export const openCertificateInNewTab = (htmlContent) => {
  // Crear un contenedor temporal
  const tempElement = document.createElement("div");
  tempElement.innerHTML = htmlContent;

  const opt = {
    margin:       0.5,
    filename:     'certificado_residencia.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
  };

  html2pdf().set(opt).from(tempElement).save(); // Para descargar automáticamente
};
