/* Almacenamiento local de la propuesta. No representa integración ni autorización. */
window.SIALMaintenanceStore = (() => {
  const key = 'sial-transport-maintenance-v1';
  const seed = [
    {id:'MNT-2026-018',vehicle:'FLT-001',kind:'Correctivo',cause:'Falla en sistema de frenos',workshop:'Taller Central',start:'2026-06-07T10:00',expected:'2026-06-12',status:'active',audit:[]},
    {id:'MNT-2026-017',vehicle:'CAM-102',kind:'Preventivo',cause:'Revisión de 40.000 km',workshop:'Servicio Norte',start:'2026-06-05T08:30',expected:'2026-06-09T16:00',status:'release',audit:['Trabajo terminado · 09/06/2026 14:40']},
    {id:'MNT-2026-019',vehicle:'CMN-204',kind:'Preventivo',cause:'Cambio de aceite y filtros',workshop:'Servicio Norte',start:'2026-06-15T07:00',expected:'2026-06-15',status:'planned',audit:[]},
    {id:'MNT-2026-014',vehicle:'TRK-422',kind:'Correctivo',cause:'Reparación de suspensión',workshop:'Taller Central',start:'2026-05-29T11:20',expected:'2026-06-03',status:'closed',audit:[]}
  ];
  function read(){try{const x=JSON.parse(localStorage.getItem(key));return Array.isArray(x)?x:seed.map(item=>({...item,audit:[...item.audit]}));}catch{return seed.map(item=>({...item,audit:[...item.audit]}));}}
  function write(items){localStorage.setItem(key,JSON.stringify(items));}
  function openDB(){return new Promise((resolve,reject)=>{const request=indexedDB.open('sial-transport-maintenance-evidence-v1',1);request.onupgradeneeded=()=>request.result.createObjectStore('files',{keyPath:'key'});request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}
  async function persistFiles(files,owner){const db=await openDB();try{return await new Promise((resolve,reject)=>{const tx=db.transaction('files','readwrite'),store=tx.objectStore('files'),metadata=[];Array.from(files).forEach(file=>{const key=`${owner}/${crypto.randomUUID()}`;store.put({key,file});metadata.push({key,name:file.name,size:file.size,type:file.type});});tx.oncomplete=()=>resolve(metadata);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Transacción cancelada'));});}finally{db.close();}}
  async function deleteFiles(items){if(!items.length)return;const db=await openDB();try{await new Promise((resolve,reject)=>{const tx=db.transaction('files','readwrite');items.forEach(x=>tx.objectStore('files').delete(x.key));tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});}finally{db.close();}}
  async function getFile(key){const db=await openDB();try{return await new Promise((resolve,reject)=>{const req=db.transaction('files','readonly').objectStore('files').get(key);req.onsuccess=()=>resolve(req.result?.file||null);req.onerror=()=>reject(req.error);});}finally{db.close();}}
  return {key,read,write,persistFiles,deleteFiles,getFile};
})();
