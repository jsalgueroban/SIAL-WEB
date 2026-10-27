function pdfText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7e]/g, "?")
    .replace(/[()\\]/g, "\\$&");
}

export function createPrototypeDocumentPdf({ kind, code, orderId, finca, origin, status }) {
  const lines = [
    { text: "SIAL | Vista de muestra", size: 18, y: 785 },
    { text: `${kind}: ${code}`, size: 14, y: 735 },
    { text: `Orden de transporte: ${orderId}`, size: 11, y: 692 },
    { text: `Finca: ${finca}`, size: 11, y: 665 },
    { text: `Documento de origen: ${origin || "No registrado"}`, size: 11, y: 638 },
    { text: `Estado de la orden: ${status}`, size: 11, y: 611 },
    { text: "Archivo generado con datos de la propuesta Web.", size: 10, y: 525 },
    { text: "No corresponde a un PDF original del proceso.", size: 10, y: 504 }
  ];
  const content = lines.map(({ text, size, y }) => `BT /F1 ${size} Tf 50 ${y} Td (${pdfText(text)}) Tj ET`).join("\n");
  const encoder = new TextEncoder();
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    `<< /Length ${encoder.encode(content).length} >>\nstream\n${content}\nendstream`
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(encoder.encode(pdf).length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const startXref = encoder.encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => { pdf += `${String(offset).padStart(10, "0")} 00000 n \n`; });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF`;
  return new Blob([encoder.encode(pdf)], { type: "application/pdf" });
}
