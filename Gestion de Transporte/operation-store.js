/* Datos de la maqueta: no son contratos ni estados productivos. */
window.SIALOperationStore = (() => {
  const key = "sial-transport-operations-v1";
  const seed = [
    {id:"OP-001",vehicle:"TRK-421",driver:"DRV-001",week:"2026-W24",date:"2026-06-10T07:30",destType:"Puerto",dest:"Puerto ZE",obs:"Cargue de contenedor refrigerado.",state:"EN TRANSITO A PUERTO",audit:["Programar - admin.operaciones · 10/06/2026 07:30"]},
    {id:"OP-002",vehicle:"CAM-101",driver:"DRV-003",week:"2026-W24",date:"2026-06-10T06:15",destType:"Finca",dest:"Finca El Rosario",obs:"",state:"EN TRANSITO A FINCA",audit:["Programar - admin.operaciones · 10/06/2026 06:15"]},
    {id:"OP-003",vehicle:"CMN-204",driver:"DRV-005",week:"2026-W26",date:"2026-06-22T09:00",destType:"Puerto",dest:"Puerto Cartagena",obs:"Programacion futura.",state:"PROGRAMADO",audit:["Programar - admin.operaciones · 18/06/2026 09:00"]},
    {id:"OP-004",vehicle:"CAM-102",driver:"",week:"2026-W23",date:"2026-06-08T08:00",destType:"Puerto",dest:"Puerto Cartagena",obs:"Operacion finalizada disponible para reprogramacion.",state:"FINALIZADO",audit:["Finalizar - admin.operaciones · 08/06/2026 17:00"]}
  ];
  function read(){
    let saved = [];
    try { const data = JSON.parse(localStorage.getItem(key)); if (Array.isArray(data)) saved = data; } catch { /* conservar semillas */ }
    const records = new Map(seed.map(item => [item.id, { ...item, audit: [...item.audit] }]));
    saved.forEach(item => { if (item && item.id) records.set(item.id, { ...records.get(item.id), ...item }); });
    return [...records.values()];
  }
  function write(items){localStorage.setItem(key,JSON.stringify(items));}
  return { key, read, write };
})();
