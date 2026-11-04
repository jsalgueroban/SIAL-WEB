/* Local sample PDF. No backend request or production document is implied. */
(() => {
  const input = document.querySelector('#poma-operation');
  const generate = document.querySelector('#pomaGenerateButton');
  const overlay = document.querySelector('#pomaPdfOverlay');
  let pdfUrl;
  let generationCount = 0;
  let loaded = true;
  const matches = () => ['exp-2026-0418', 'tul458', 'sialu1234567', 'santa isabel', 'finca santa isabel'].includes(input.value.trim().toLowerCase());
  const close = () => { overlay.hidden = true; document.body.classList.remove('poma-overlay-open'); requestAnimationFrame(() => (generate.previousElementSibling?.querySelector('button') || generate).focus()); };
  input.addEventListener('input', () => {
    loaded = false;
    generate.disabled = true;
    document.querySelectorAll('.poma-preview-card,.poma-load-detail-card,.poma-emission-card').forEach(e => e.hidden = true);
  });
  document.querySelector('.poma-load-action').addEventListener('click', () => {
    loaded = matches();
    input.setAttribute('aria-invalid', String(!loaded));
    generate.disabled = !loaded;
    document.querySelectorAll('.poma-preview-card,.poma-load-detail-card,.poma-emission-card').forEach(e => e.hidden = !loaded);
    CompanyFeedback.show(loaded ? 'Datos cargados' : 'Salida no encontrada', loaded ? 'success' : 'error', loaded ? 'Salida EXP-2026-0418 lista para revisar.' : 'Usa uno de los identificadores de ejemplo indicados.');
  });
  SIAL.initTableFilters({rowSelector: '.poma-data-table tbody tr', pageSize:10});
  function createPdf() {
    const lines = ['POMA - DOCUMENTO DE DEMOSTRACION', 'Sin validez operativa', 'Salida: EXP-2026-0418 | Finca Santa Isabel', 'Placa: TUL458 | Contenedor: SIALU1234567', 'Conductor: Carlos Mendoza | Precinto: SEL-908172', 'Salida: 05/05/2026 15:12', '12 pallets | 1056 cajas | 20040 kg', '', 'Posicion | SSCC | Referencia | Cajas | Peso'];
    for (let i=1;i<=12;i++) lines.push(`${String(i).padStart(2,'0')} | 1770123456789012${i+33} | REF-EXPORT-0${i<7?1:2} | 88 | 1670 kg`);
    lines.push('', `Generacion de muestra: ${generationCount}`);
    const stream = 'BT /F1 11 Tf 40 790 Td 20 TL '+lines.map((line,i)=>(i?'T* ':'')+'('+line.replace(/[\\()]/g,'\\$&')+') Tj').join('\n')+' ET';
    const objects=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`];
    let pdf='%PDF-1.4\n';const offsets=[0];
    objects.forEach((object,i)=>{offsets.push(pdf.length);pdf+=`${i+1} 0 obj\n${object}\nendobj\n`;});
    const xref=pdf.length;
    pdf+=`xref\n0 6\n0000000000 65535 f \n`+offsets.slice(1).map(n=>`${String(n).padStart(10,'0')} 00000 n \n`).join('')+`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
    return URL.createObjectURL(new Blob([pdf],{type:'application/pdf'}));
  }
  generate.addEventListener('click', async () => {
    if (!loaded) return;
    if (!await CompanyFeedback.confirm('Generar muestra POMA', 'EXP-2026-0418 · 12 pallets · 1.056 cajas. Se creará un PDF de demostración con estos datos.', 'Generar muestra')) return;
    generationCount++;
    if(pdfUrl) URL.revokeObjectURL(pdfUrl);
    pdfUrl=createPdf();
    document.querySelector('#pomaPdfFrame').src=pdfUrl;
    document.querySelector('#pomaDownload').href=pdfUrl;
    document.querySelectorAll('.poma-emission-values > div').forEach(group=>{
      const title=group.querySelector('dt').textContent;
      if(title==='Generaciones previas') group.querySelector('dd').textContent=generationCount;
      if(title==='Número de documento') group.querySelector('dd').textContent=`DEMO-POMA-${generationCount}`;
      if(title==='Fecha de generación') group.querySelector('dd').textContent=new Date().toLocaleString('es-CO');
    });
    overlay.hidden=false;document.body.classList.add('poma-overlay-open');
    overlay.querySelector('[data-poma-close]').focus();
    CompanyFeedback.show('Muestra POMA generada', 'success', 'Puedes consultar o descargar el PDF de demostración.');
  });
  overlay.querySelectorAll('[data-poma-close]').forEach(button=>button.addEventListener('click',close));
  overlay.addEventListener('click',event=>{if(event.target===overlay)close();});
  document.addEventListener('keydown',event=>{
    if(overlay.hidden)return;
    if(event.key==='Escape'){event.preventDefault();close();}
    if(event.key==='Tab'){
      const items=[...overlay.querySelectorAll('button:not(:disabled),a[href],iframe')].filter(e=>e.getClientRects().length);
      if(event.shiftKey&&document.activeElement===items[0]){event.preventDefault();items.at(-1).focus();}
      if(!event.shiftKey&&document.activeElement===items.at(-1)){event.preventDefault();items[0].focus();}
    }
  });
})();
