export const maxSupportBytes=10*1024*1024;
export function documentVersions(route){
 if(Array.isArray(route.documentVersions))return route.documentVersions;
 return route.id==='R-004'&&route.docs==='En revisión'?[{id:'seed-R-004-v1',number:1,name:'Soporte-R-004.pdf',size:640,type:'application/pdf',at:'2026-11-23T20:00:00Z',actor:'Operador de transporte',status:'En revisión',fixture:true,services:['R-004']}]:[];
}
export function documentState(route){return documentVersions(route).at(-1)?.status||'Pendiente de soporte';}
export function canUploadSupport(route){return route.phase==='Programada'&&route.state===3&&['Pendiente de soporte','Rechazado'].includes(documentState(route));}
export function administrativeEligibility(route){return route.phase==='Programada'&&route.state===3&&documentState(route)==='Aprobado';}
export function validateSupportReview(routes,command){
 if(command.role!=='internal')throw new Error('La revisión corresponde a Banasan.');
 const route=routes.find(route=>route.id===command.routeId&&route.phase==='Programada'&&route.state===3);
 if(!route)throw new Error('La ruta debe tener su cierre operativo completo.');
 const versions=documentVersions(route),latest=versions.at(-1);
 if(!latest||latest.status!=='En revisión')throw new Error('El soporte vigente no está pendiente de revisión.');
 if(command.expectedVersion!==versions.length||command.fileId!==latest.id)throw new Error('La versión cambió. Revisa el soporte vigente antes de confirmar.');
 if(!['approve','reject'].includes(command.action))throw new Error('Selecciona aprobar o rechazar.');
 if(command.action==='reject'&&!command.observation?.trim()){const error=new Error('Escribe el motivo del rechazo para la transportadora.');error.field='reviewObservation';throw error;}
 return {route,versions,latest};
}
export function validateSupportCommand(routes,command){
 const route=routes.find(route=>route.id===command.routeId&&route.carrierId===command.companyId&&route.phase==='Programada');
 if(!route||route.state!==3)throw new Error('El soporte requiere una ruta finalizada de tu empresa.');
 const versions=documentVersions(route);
 if(command.expectedVersion!==versions.length)throw new Error('El soporte cambió. Actualiza la revisión antes de continuar.');
 if(command.action==='upload'){
  if(!canUploadSupport(route))throw new Error('La versión actual no admite reemplazo. Sólo se permite una nueva versión después de un rechazo.');
  const file=command.file;
  if(!file?.id||!file.name||!['application/pdf','image/png','image/jpeg'].includes(file.type)||!Number.isFinite(file.size)||file.size<=0||file.size>maxSupportBytes)throw new Error('Selecciona un PDF, JPG o PNG de hasta 10 MB.');
 }else if(command.action==='submit'){
  if(versions.at(-1)?.status!=='Soporte cargado')throw new Error('Carga un soporte antes de enviarlo a revisión.');
 }else throw new Error('Acción documental no válida.');
 return {route,versions};
}
export async function inspectSupportFile(file){
 if(!file||file.size<=0||file.size>maxSupportBytes)throw new Error('El archivo debe tener contenido y pesar hasta 10 MB.');
 const bytes=new Uint8Array(await file.slice(0,8).arrayBuffer()),ext=file.name.split('.').at(-1).toLowerCase();
 const type=bytes[0]===37&&bytes[1]===80&&bytes[2]===68&&bytes[3]===70?'application/pdf':bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71?'image/png':bytes[0]===255&&bytes[1]===216&&bytes[2]===255?'image/jpeg':null;
 if(!type||!({pdf:'application/pdf',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg'}[ext]===type))throw new Error('El contenido no corresponde a un PDF, JPG o PNG válido.');
 return type;
}
