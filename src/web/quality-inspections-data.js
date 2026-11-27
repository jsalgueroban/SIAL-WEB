export const results = ['Aceptado', 'Rechazo parcial', 'Reproceso', 'Rechazo total'];
export const resultColors = ['#278565', '#d29329', '#5779c5', '#cb5d60'];
export const defectNames = ['Rozadura', 'Golpe', 'Cicatriz', 'Empaque deteriorado'];
export const reviewStates = ['Pendiente', 'Validada', 'Con observaciones'];
export const storageKey = 'sial-quality-review-demo-v1';
export function makeBoxes(index, result) {
  const passing = [5, 4, 4, 2][result];
  return Array.from({ length: 5 }, (_, i) => {
    const conforms = i < passing;
    const b = conforms ? 2 : result === 2 ? 3 : 5;
    const defect = defectNames[(index + i) % 3];
    return { number: i + 1, weight: +(19.1 + ((index + i) % 5) * .12).toFixed(2), packer: `EMP-${104 + i}`, impression: conforms ? 100 : 80, gajos: 20, fingers: 100, b, c: 0, conforms, length: 8 + ((index + i) % 3) * .25, caliber: 40 + ((index + i) % 3), defects: [{name: defect, category: 'Fruta', band: 'B', quantity: b, line: (i % 3) + 1}, ...(i === 2 ? [{name: 'Empaque deteriorado', category: 'Empaque', band: 'A', quantity: 1, line: 3}] : [])] };
  });
}
export const inspections = Array.from({ length: 18 }, (_, i) => {
  const result = i % 6 === 0 ? 3 : i % 6 === 1 ? 2 : i % 6 === 2 ? 1 : 0;
  const week = 48 - Math.floor(i / 6);
  const day = 27 - Math.floor(i / 6) * 7 - (i % 3);
  return { id: `IC-${String(1482 - i).padStart(5,'0')}`, date: `2026-11-${day}`, time: `${String(9 + i % 5).padStart(2,'0')}:20`, week, farm: ['La Esperanza', 'El Porvenir', 'Santa Lucía'][i % 3], place: result === 2 ? 'Finca' : i % 2 ? 'Finca' : 'Puerto', reference: i % 2 ? 'Premium 22XU' : 'Estándar 208', pallet: `PL-${8460-i}`, label: `TR-26-${8460-i}`, shipment: `EMB-26-${112-Math.floor(i/3)}`, vehicle: i % 2 ? 'TUV 482' : 'MSCU 123456 6', inspector: ['Laura Méndez', 'Andrés Ríos', 'Camila Torres'][i % 3], result: results[result], resultIndex: result, boxes: makeBoxes(i,result), rejected: result === 3 ? 48 : result === 1 ? 8 : 0, reprocessed: result === 2 ? 6 : 0, palletBoxes: 48, revision: `${i % 2 ? 'RC-22XU' : 'RC-208'} · revisión 3`, initialReview: i % 5 === 3 ? 'Validada' : i % 5 === 4 ? 'Con observaciones' : 'Pendiente' };
});
export function pbms(item) { return item.boxes.filter(box=>box.conforms).length * 20; }
export function readReviews() { try { const value=JSON.parse(localStorage.getItem(storageKey)||'{}'); return value && typeof value==='object' && !Array.isArray(value) ? value : {}; } catch { return {}; } }
export function historyFor(item,reviews) { return reviews[item.id] || (item.initialReview==='Pendiente' ? [] : [{state:item.initialReview,actor:'María Salazar · supervisora demo',at:`${item.date}T16:30:00-05:00`,comment:item.initialReview==='Validada'?'Registro y evidencias revisados.':'Verificar la observación del empaque en el seguimiento.',checks:['Contexto y trazabilidad','Cinco cajas y resultados','Defectos y evidencias']}]); }
export function reviewFor(item,reviews) { return historyFor(item,reviews).at(-1)?.state || 'Pendiente'; }
export function filterInspections(rows,filters,reviews) {
  const query=filters.query.trim().toLocaleLowerCase('es');
  return rows.filter(item=>(!filters.week||String(item.week)===filters.week)&&(!filters.farm||item.farm===filters.farm)&&(!filters.place||item.place===filters.place)&&(!filters.result||item.result===filters.result)&&(!filters.review||reviewFor(item,reviews)===filters.review)&&(!filters.defect||item.boxes.some(box=>box.defects.some(d=>d.name===filters.defect)))&&(!query||[item.id,item.pallet,item.label,item.shipment,item.vehicle,item.reference,item.inspector].join(' ').toLocaleLowerCase('es').includes(query)));
}
