// Proposal artifacts rendered from the real POMA template. No productive emission.
const prefix='sial-proposal-poma:';
const ids=new Set(['loading-container','loading-truck','snapshot-poma-64']);
export function readPomaDocument(id){try{return JSON.parse(sessionStorage.getItem(prefix+id)||'null');}catch{return null;}}
export function savePomaDocument(detail,row){const previous=readPomaDocument(row.loadingId);const saved={detail:structuredClone(detail),row:structuredClone(row),generatedAt:new Date().toISOString(),localCount:(previous?.localCount||0)+1};sessionStorage.setItem(prefix+row.loadingId,JSON.stringify(saved));return saved;}
export function pomaDocumentUrl(id){if(!ids.has(id))throw Error('No se encontró el documento del cargue.');return `../shared/poma/${encodeURIComponent(id)}.pdf`;}
export async function downloadPomaDocument(saved){const response=await fetch(pomaDocumentUrl(saved.row.loadingId));if(!response.ok)throw Error('No fue posible descargar el documento POMA.');const blob=await response.blob();if(!blob.size||!(await blob.slice(0,5).text()).startsWith('%PDF-'))throw Error('El documento POMA no es válido.');const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`POMA-DEMO-Rad-${saved.row.radication}.pdf`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
