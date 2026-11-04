/* Lectura de señales de la propuesta local; no sustituye la elegibilidad del servicio. */
window.TransportAvailability = (() => {
  const demoMarker = Symbol('temporary-demo');
  const vehicleList = () => {
    const records = typeof VehiclePrototype === 'undefined' ? [] : VehiclePrototype.read();
    let states = {};
    try { states = JSON.parse(localStorage.getItem(`sial-catalog-state:${new URL('gestion-vehiculos.html', location.href).pathname}`) || '{}'); } catch { states = {}; }
    const mapped = records.map(item => !item.stateManaged && states[item.plate] ? { ...item, status: states[item.plate].status || item.status, audit: states[item.plate].audit || item.audit } : item);
    if (new URLSearchParams(location.search).get('escenario') === 'disponible' && !mapped.some(item => String(item.plate || '').trim().toUpperCase() === 'DEMO-001')) {
      const expires = new Date(); expires.setFullYear(expires.getFullYear()+1);
      const future = `${expires.getFullYear()}-${String(expires.getMonth()+1).padStart(2,'0')}-${String(expires.getDate()).padStart(2,'0')}T12:00`;
      mapped.push({plate:'DEMO-001', vehicleType:'TRACTOMULA', carrierCompany:'TRANSPORTADORA DE PRUEBA', ownFleet:'true', palletCapacity:'20', soatNumber:'SOAT-DEMO', soatEndAt:future, techNumber:'RTM-DEMO', techEndAt:future, status:'active', opstatus:'disponible', oplabel:'DISPONIBLE · DEMOSTRACIÓN', unavailabilityReason:null, inProcess:false, isDemo:true, [demoMarker]:true, audit:'Escenario de demostración local'});
    }
    return mapped;
  };
  const maintenanceList = () => window.SIALMaintenanceStore?.read?.() || [];
  const operationsList = () => window.SIALOperationStore?.read?.() || [];
  const normalize = value => String(value || '').trim().toUpperCase();
  function sourcesReady() {
    if (typeof VehiclePrototype === 'undefined' || !VehiclePrototype.read || !window.SIALMaintenanceStore?.read || !window.SIALOperationStore?.read || !window.SIALPreopEvidence?.unresolvedForVehicle) return false;
    try {
      return ['sial-transport-vehicles-v1', 'sial-transport-maintenance-v1', 'sial-transport-operations-v1']
        .every(key => { const raw = localStorage.getItem(key); return raw === null || Array.isArray(JSON.parse(raw)); });
    } catch { return false; }
  }
  function due(value) {
    if (!value) return null;
    const text = String(value).trim();
    const iso = /^(\d{4})-(\d{2})-(\d{2})T/.exec(text);
    if (iso) {
      const day = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
      if (day.getFullYear() !== Number(iso[1]) || day.getMonth() !== Number(iso[2]) - 1 || day.getDate() !== Number(iso[3])) return null;
      const date = new Date(text);
      return Number.isNaN(date.getTime()) ? null : date.getTime() < Date.now();
    }
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
    if (!match) return null;
    const stamp = new Date(Number(match[3]), Number(match[2])-1, Number(match[1]));
    if (stamp.getFullYear() !== Number(match[3]) || stamp.getMonth() !== Number(match[2])-1 || stamp.getDate() !== Number(match[1])) return null;
    const today = new Date(); today.setHours(0,0,0,0);
    return stamp.getTime() < today.getTime() ? true : stamp.getTime() > today.getTime() ? false : null;
  }
  // La clasificación del servicio marca REVIEW cuando un documento vigente
  // vence dentro de 30 días. Esta señal no determina elegibilidad por placa.
  function nearExpiry(value) {
    if (due(value) !== false) return false;
    const text = String(value || '').trim();
    const dateOnly = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
    const date = dateOnly
      ? new Date(Number(dateOnly[3]), Number(dateOnly[2]) - 1, Number(dateOnly[1]))
      : new Date(text);
    if (Number.isNaN(date.getTime())) return false;
    const limit = new Date();
    limit.setDate(limit.getDate() + 30);
    return date.getTime() <= limit.getTime();
  }
  function get(plate) {
    const id = normalize(plate);
    const record = vehicleList().find(item => normalize(item.plate) === id);
    const maintenance = maintenanceList().filter(item => normalize(item.vehicle) === id && ['active','release'].includes(item.status));
    const operations = operationsList().filter(item => normalize(item.vehicle || item.plate) === id);
    const signals = [], blockers = [];
    if (!record) signals.push('Sin registro de vehículo en esta propuesta.');
    if (record?.status === 'inactive') blockers.push('Vehículo inactivo.');
    if (record?.status === 'warning') signals.push('Estado administrativo en revisión.');
    for (const item of maintenance) blockers.push(`${item.status === 'active' ? 'En mantenimiento' : 'Pendiente de liberación'}: ${item.id}.`);
    const inspections = window.SIALPreopEvidence?.unresolvedForVehicle(id) || [];
    for (const inspection of inspections) blockers.push(`Inspección ${inspection.id} no apta; no hay liberación registrada en la propuesta.`);
    const operation = record?.oplabel || null;
    const hasTransitOperation = operations.some(item => /TR[ÁA]NSITO/.test(String(item.state || item.status || '').toLocaleUpperCase('es')));
    if (record?.opstatus === 'nodisponible' || (record?.opstatus === 'transito' && !hasTransitOperation)) blockers.push(`Estado operativo registrado: ${operation || record.opstatus}.`);
    let operationActive = record?.opstatus === 'transito';
    for (const item of operations) {
      const state = String(item.state || item.status || '').toLocaleUpperCase('es');
      if (/TR[ÁA]NSITO/.test(state)) { operationActive = true; blockers.push(`Operación ${item.id}: ${state}.`); }
      else if (/PROGRAMAD/.test(state)) signals.push(`Operación ${item.id} programada; impacto por verificar.`);
    }
    const soatExpired = due(record?.soatEndAt || record?.soatDisplay);
    const techExpired = due(record?.techEndAt || record?.techDisplay);
    if (soatExpired === true) blockers.push('SOAT con fecha de vencimiento superada.');
    else if (soatExpired === null) signals.push('Vigencia del SOAT sin información suficiente.');
    if (techExpired === true) blockers.push('Tecnomecánica con fecha de vencimiento superada.');
    else if (techExpired === null) signals.push('Vigencia de tecnomecánica sin información suficiente.');
    if (nearExpiry(record?.soatEndAt || record?.soatDisplay)) signals.push('SOAT próximo a vencer: requiere revisión dentro de 30 días.');
    if (nearExpiry(record?.techEndAt || record?.techDisplay)) signals.push('Tecnomecánica próxima a vencer: requiere revisión dentro de 30 días.');
    const sourcesVerified = sourcesReady();
    if (!sourcesVerified) signals.push('No se pudieron verificar todas las fuentes locales de disponibilidad.');
    const demoAvailable = sourcesVerified && record?.[demoMarker] === true && !blockers.length && record.status === 'active' && record.unavailabilityReason === null && record.inProcess === false && soatExpired === false && techExpired === false;
    if (demoAvailable) signals.push('Vehículo de demostración: disponibilidad simulada con datos completos.');
    else if (!blockers.length) signals.push('Elegibilidad pendiente de verificación en el servicio.');
    return { eligible: blockers.length ? 'blocked' : demoAvailable ? 'available' : 'unknown', sourcesVerified, signals: [...blockers,...signals], operation, operationActive, maintenance: maintenance.map(item=>item.id).join(', ') || null, record };
  }
  function list() {
    const values = new Map();
    vehicleList().forEach(record => values.set(normalize(record.plate), record));
    maintenanceList().forEach(record => {const plate=normalize(record.vehicle);if(plate&&!values.has(plate)) values.set(plate,{plate});});
    operationsList().forEach(record => {const plate=normalize(record.vehicle||record.plate);if(plate&&!values.has(plate)) values.set(plate,{plate});});
    (window.SIALPreopEvidence?.vehiclesWithUnresolved() || []).forEach(plate => {const id=normalize(plate);if(id&&!values.has(id)) values.set(id,{plate:id});});
    return Array.from(values.values());
  }
  return {get,list,due};
})();
