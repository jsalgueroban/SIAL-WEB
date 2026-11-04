import pomaRealPallets from './poma-real-pallets.json';
import liveContainerCase from './container-case-live.json';
// Synthetic data shaped like the product view models. Never production evidence.
const year = new Date().getFullYear();
export const demoWeek = 45;
export const locations = [{code:'PORT',name:'Puerto Norte'},{code:'FARM',name:'Finca Santa Isabel'}];
export const stages = [{id:'received',name:'Recibido en puerto'},{id:'transit',name:'En tránsito'}];
const photo = (label) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="#edf2f6"/><rect x="100" y="100" width="600" height="260" rx="12" fill="#c7d5df"/><text x="400" y="225" text-anchor="middle" font-family="Arial" font-size="28" fill="#213c53">${label}</text><text x="400" y="280" text-anchor="middle" font-family="Arial" font-size="20" fill="#213c53">Imagen de demostración</text></svg>`)}`;
const evidence=(id,historical=false)=>({id,title:historical?'Registro anterior':'Inspección del contenedor',type:'Fotografía',capturedAt:`03/11/${year}, 09:30`,historical,status:historical?'Histórica':'Sin novedad',statusTone:historical?'warning':'active',observation:'Registro de ejemplo para revisar la composición.',imageSrc:photo(historical?'Registro histórico':'Inspección')});
const labels=[{id:'label-1',code:'ET-0842',type:'EXTERNAL',typeLabel:'Externa',status:'Intacta',statusTone:'active'}];
const node=(id,kind,hour)=>({id,inspectionId:kind?Number(id.replace(/\D/g,'')):undefined,inspectionKind:kind,inspectionCreatedAt:`${year}-11-03T${hour}:00:00`,inspectionDetails:kind?[{label:'Resultado',value:'Apto'},{label:'Estructura',value:'Sin daños visibles'}]:[],name:kind=== 'EXTERNAL'?'Inspección externa en puerto':kind==='INTERNAL'?'Inspección interna en puerto':'Cargue cerrado en finca',event:'Movimiento de contenedor',occurredAt:`03/11/${year} ${hour}:00`,occurredAtValue:`${year}-11-03T${hour}:00:00`,responsible:'Operador de demostración',sealDetails:[{label:'Sello verificado',value:'SEL-908172'}],zone:{code:kind?'PORT':'FARM',name:kind?'Puerto Norte':'Finca Santa Isabel'},zoneLabel:kind?'Puerto Norte':'Finca Santa Isabel',status:'Apto',statusTone:'active',vehicle:'TUL458',driver:'Conductor de ejemplo',transportCompany:'Transportadora de ejemplo',carrier:'Carrier de ejemplo',evidenceIds:[id+'-current',id+'-old'],securityLabels:labels});
const trace=[node('inspection-103','INTERNAL','11'),node('inspection-102','EXTERNAL','10'),node('loading-101',undefined,'08')];
export const containerEvents=[{id:'container-1',travelOrder:'OV-2026-0418',operationCode:'OP-0418',filingNumber:'418',technicalOperationCode:'PROG-0418',operationName:'Operación de contenedor',registeredAt:`${year}-11-03T11:00:00`,year:String(year),weekNumber:'45',weekLabel:`Semana 45 · ${year}`,eventType:'RECEIVED_AT_PORT',source:'mobile',sourceLabel:'Operación móvil',status:'Recibido en puerto',statusTone:'active',vehicle:'TUL458',container:{code:'SIALU1234567'},containerLabel:'SIALU1234567',containerType:'Refrigerado 40 pies',containerCapacity:'20 pallets',contextContainer:'Exportación',transportCompany:'Transportadora de ejemplo',carrier:'Carrier de ejemplo',driver:'Conductor de ejemplo',responsible:'Operador de demostración',syncStatus:'Sincronizado',syncTone:'active',detailReference:'OP-0418 · SIALU1234567',location:{code:'PORT',name:'Puerto Norte'},locationLabel:'Puerto Norte',trace,evidences:trace.flatMap(n=>[evidence(n.id+'-current'),evidence(n.id+'-old',true)]),securityLabels:labels,comments:[{id:'comment-1',author:'Operador de demostración',date:`03/11/${year}`,text:'Inspecciones registradas sin novedades.'}]}];
containerEvents.push({...containerEvents[0],id:'container-2',travelOrder:'OV-2026-0419',technicalOperationCode:'PROG-0419',detailReference:'OP-0419 · SIALU7654321',container:{code:'SIALU7654321'},operationCode:'OP-0419',filingNumber:'419',containerLabel:'SIALU7654321',eventType:'LOADING',status:'En cargue',statusTone:'info',locationLabel:'Finca Santa Isabel',location:{code:'FARM',name:'Finca Santa Isabel'},trace:[{...node('loading-201',undefined,'08'),evidenceIds:[],securityLabels:[]}],evidences:[],comments:[],securityLabels:[]});
export const vehicleEvents=[{id:'vehicle-1',filingNumber:'418',operationCode:'OP-0418',operationName:'Recorrido TUL458',vehiclePlate:'TUL458',vehicleType:'Tractocamión',containerLabel:'SIALU1234567',hasContainer:true,carrier:'Carrier de ejemplo',palletCapacity:'20',transportCompany:'Transportadora de ejemplo',driver:'Conductor de ejemplo',driverDocument:'DEMO-001',destination:'Puerto Norte',currentLocation:'Puerto Norte',currentLocationId:'PORT',currentStage:'Recibido en puerto',currentStageId:'received',weekLabel:`Semana 45 · ${year}`,weekNumber:'45',year:String(year),registeredAt:`03/11/${year} 10:00`,registeredAtValue:`${year}-11-03T10:00:00`,responsible:'Operador de demostración',statusTone:'active',syncStatus:'Sincronizado',trace:[{id:'exit-1',type:'exit',title:'Salida de finca',description:'Salida registrada hacia puerto',occurredAt:`03/11/${year} 09:00`,occurredAtValue:`${year}-11-03T09:00:00`,locationLabel:'Finca Santa Isabel',locationId:'FARM',stageLabel:'Despachado',responsible:'Operador de demostración',observation:'Sin novedades',syncStatus:'Sincronizado',timelineStatus:'completed',tone:'active',evidenceIds:[],containerLabel:'SIALU1234567',cargoSummary:'12 pallets · 1.056 cajas'}, {id:'entry-1',type:'entry',title:'Ingreso a finca',description:'Vehículo recibido',occurredAt:`03/11/${year} 07:00`,occurredAtValue:`${year}-11-03T07:00:00`,locationLabel:'Finca Santa Isabel',locationId:'FARM',stageLabel:'Recibido',responsible:'Operador de demostración',syncStatus:'Sincronizado',timelineStatus:'completed',tone:'active',evidenceIds:[]}],evidences:[]}];
vehicleEvents.push({...vehicleEvents[0],id:'vehicle-2',filingNumber:'419',operationCode:'OP-0419',vehiclePlate:'CAM102',vehicleType:'Camión',operationName:'Recorrido CAM102',hasContainer:false,containerLabel:'No aplica',currentStage:'En tránsito',currentStageId:'transit',trace:vehicleEvents[0].trace.map(n=>({...n,palletEvidenceSummary:n.type==='exit'?'Pallets del cargue de camión':undefined,evidenceIds:n.type==='exit'?['pallet-loading-photo']:[],containerLabel:'No aplica'})),evidences:[{id:'pallet-loading-photo',title:'Pallets cargados en camión',type:'Fotografía',capturedAt:`03/11/${year}, 08:50`,observation:'Evidencia de demostración del cargue de pallets.',imageSrc:photo('Cargue de pallets')}]});
// Vehicle fixtures follow the operational mapper: chronological trace, no inspection records.
for (const event of vehicleEvents) {
  event.trace.unshift({id:event.id+'-scheduled',type:'scheduled',title:'Operación programada',description:'Vehículo programado para el recorrido',occurredAt:`03/11/${year} 06:00`,occurredAtValue:`${year}-11-03T06:00:00`,locationLabel:'Finca Santa Isabel',locationId:'FARM',stageLabel:'Programado',responsible:event.responsible,syncStatus:'Sincronizado',timelineStatus:'completed',tone:'info',evidenceIds:[]});
  event.trace.sort((a,b)=>Date.parse(a.occurredAtValue)-Date.parse(b.occurredAtValue));
  event.registeredAt=`03/11/${year} 06:00`;
  event.registeredAtValue=`${year}-11-03T06:00:00`;
  event.palletCapacity='20 pallets';
}
vehicleEvents[0].trace.push({id:'port-entry-1',type:'entry',title:'Ingreso a puerto',description:'Recepción registrada en puerto',occurredAt:`03/11/${year} 10:00`,occurredAtValue:`${year}-11-03T10:00:00`,locationLabel:'Puerto Norte',locationId:'PORT',stageLabel:'Recepción en Puerto Norte',responsible:'Operador de demostración',syncStatus:'Sincronizado',timelineStatus:'active',tone:'info',evidenceIds:[],containerLabel:'SIALU1234567'});
vehicleEvents[1].currentLocation='En tránsito desde Finca Santa Isabel';
vehicleEvents[1].currentLocationId='FARM';
vehicleEvents[1].evidences[0].historical=false;
vehicleEvents[1].evidences[0].status='Vigente';
vehicleEvents[1].evidences[0].statusTone='success';
// Same title/description composition as the product vehicle mapper.
for (const event of vehicleEvents) {
  for (const node of event.trace) {
    if (node.type === 'scheduled') {
      node.title = 'Operación programada';
      node.description = event.destination ? `Ruta asignada hacia ${event.destination}` : 'Operación de transporte creada';
    } else {
      const action = node.type === 'entry' ? 'Ingreso' : 'Salida';
      node.title = `${action} ${node.type === 'entry' ? 'a' : 'de'} ${node.locationLabel}`;
      node.description = [`${action} registrado en ${node.locationLabel}`, node.issue ? `Novedad: ${node.issue}` : '', node.observation || ''].filter(Boolean).join(' · ');
    }
  }
}
export const loadings=[{loadingId:'loading-container',loadingType:'CONTAINER',routeType:'FARM_TO_PORT',radication:'418',operationWeek:45,vehiclePlate:'TUL458',containerCode:'SIALU1234567',originCode:'FARM',originName:'Finca Santa Isabel',destinationCode:'PORT',destinationName:'Puerto Norte',farmCode:'FIN-01',farmName:'Santa Isabel',dispatchedFromOriginAt:`${year}-11-03T09:00:00`,palletQuantity:12,boxQuantity:1056,pomaAvailable:true,pomaGenerationCount:0,pomaTemplateVersion:'DEMO-1'},{loadingId:'loading-truck',loadingType:'TRUCK',routeType:'PORT_TO_FINAL_PORT',radication:'418',operationWeek:45,vehiclePlate:'CAM102',originCode:'PORT',originName:'Puerto Norte',destinationCode:'FINAL_PORT',destinationName:'Terminal final',dispatchedFromOriginAt:`${year}-11-03T13:00:00`,palletQuantity:6,boxQuantity:528,pomaAvailable:true,pomaGenerationCount:0,pomaTemplateVersion:'DEMO-1'}];
export function loadingDetail(id){if(id==='snapshot-poma-64')return realPomaDetail();const row=loadings.find(r=>r.loadingId===id);if(!row)throw Error('No se encontró el cargue.');return {...row,document:{documentReference:'DEMO-POMA-'+id,templateVersion:'DEMO-1',generatedAt:new Date().toISOString(),origin:{locationName:row.originName},destination:{locationName:row.destinationName},dispatch:{dispatchedFromOriginAt:row.dispatchedFromOriginAt},transport:{vehicleTypeName:row.loadingType==='TRUCK'?'Camión':'Tractocamión con contenedor',vehiclePlate:row.vehiclePlate,driverName:'Conductor de ejemplo',driverDocument:'DEMO-001',carrierName:'Transportadora de ejemplo'},loading:{...row,containerType:row.containerCode?'Refrigerado 40 pies':undefined,finalSealNumber:row.containerCode?'SEL-908172':undefined,closedAt:row.dispatchedFromOriginAt,syncedAt:row.dispatchedFromOriginAt,estimatedWeightKg:row.palletQuantity*1670,pallets:Array.from({length:row.palletQuantity},(_,i)=>({palletId:id+'-'+i,position:i+1,sscc:pomaDemoSscc(i),boxQuantity:88,estimatedWeightKg:1670,composition:[{referenceCode:'REF-01',referenceVersion:1,referenceName:'Banano de exportación'}]}))},audit:{requestedBy:'Usuario de demostración'}}};}

// Fictional full names for the vehicle proposal fixtures.
for (const event of vehicleEvents) {
  event.responsible = 'Carlos Mendoza';
  for (const node of event.trace) node.responsible = 'Carlos Mendoza';
}


containerEvents.push(liveContainerCase);

// Additional synthetic operations for carousel density/motion review (week 45).
// Never clone the captured real case or its photographs.
for (let index = 0; index < 12; index += 1) {
  const filing = String(500 + index);
  const plate = `DEM${500 + index}`;
  const containerCode = `DEMO${String(5000000 + index)}`;
  const baseVehicle = vehicleEvents[index % 2];
  const vehicle = structuredClone(baseVehicle);
  Object.assign(vehicle, {
    id: `demo-vehicle-${filing}`, filingNumber: filing, operationCode: `OP-DEMO-${filing}`,
    operationName: `Demostración · ${plate}`, vehiclePlate: plate,
    driver: ['Laura Martínez', 'Andrés Romero', 'Diana Torres'][index % 3],
    driverDocument: `DEMO-${filing}`, containerLabel: vehicle.hasContainer ? containerCode : 'No aplica',
    evidences: [],
  });
  vehicle.trace = vehicle.trace.map((movement, position) => ({
    ...movement, id: `${vehicle.id}-movement-${position}`, evidenceIds: [],
    containerLabel: vehicle.containerLabel, palletEvidenceSummary: undefined,
  }));
  vehicleEvents.push(vehicle);

  const container = structuredClone(containerEvents[index % 2]);
  Object.assign(container, {
    id: `demo-container-${filing}`, filingNumber: filing,
    operationCode: `OP-DEMO-${filing}`, technicalOperationCode: `DEMO-${filing}`,
    travelOrder: `OV-DEMO-${filing}`, operationName: 'Operación de demostración',
    detailReference: `OP-DEMO-${filing} · ${containerCode}`,
    container: {code: containerCode}, containerLabel: containerCode,
    vehicle: plate, driver: vehicle.driver, responsible: 'Carlos Mendoza',
    evidences: [], securityLabels: [], comments: [],
  });
  container.trace = container.trace.map((movement, position) => ({
    ...movement, id: `${container.id}-movement-${position}`, vehicle: plate,
    driver: vehicle.driver, responsible: 'Carlos Mendoza', evidenceIds: [], securityLabels: [],
  }));
  containerEvents.push(container);
}

// Read-only visible product snapshot, 2026-11-04; no invented backend identifiers.
loadings.push({loadingId:'snapshot-poma-64',loadingType:'CONTAINER',radication:'64',vehiclePlate:'KUS342',containerCode:'MMAU135866-8',originName:'MANANTIAL ORGÁNICO',destinationName:'Zona Externa',dispatchedFromOriginAt:'2026-10-23T18:26:00-05:00',palletQuantity:14,boxQuantity:816,pomaAvailable:true,pomaGenerationCount:2,pomaLastGeneratedAt:'2026-10-30T15:19:00-05:00',pomaTemplateVersion:'POMA-CONTAINER-V1'});
function realPomaDetail(){const row=loadings.find(r=>r.loadingId==='snapshot-poma-64');return {...row,document:{documentReference:'POMA-CONTAINER-57fc0c96',templateVersion:'POMA-CONTAINER-V1',origin:{locationName:row.originName},destination:{locationName:row.destinationName},dispatch:{dispatchedFromOriginAt:row.dispatchedFromOriginAt},transport:{vehicleTypeName:'TRACTOMULA ARTICULADA',vehiclePlate:'KUS342',driverName:'DIEGO ALFREDO ANGARITA DIETES',driverDocument:'1083012563',carrierName:'CHRISTIAN MEJIA'},loading:{containerCode:'MMAU135866-8',containerType:'45R5',closedAt:'2026-10-23T17:22:00-05:00',syncedAt:'2026-10-23T17:22:00-05:00',finalSealNumber:'OUV20072',palletQuantity:14,boxQuantity:816,estimatedWeightKg:13104.86,pallets:pomaRealPallets},audit:{requestedBy:'fa97ba07'}}};}

function pomaDemoSscc(index){const body='1770123456789'+String(index+1000);const sum=[...body].reverse().reduce((n,d,i)=>n+Number(d)*(i%2===0?3:1),0);return body+((10-sum%10)%10);}
