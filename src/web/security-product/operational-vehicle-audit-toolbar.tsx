// Product filters composed with published inputs; URL is the single source of truth.
import React from 'react';
import {Button, SelectInput, TextInput, Toolbar} from '@banasandev/banasan-ui';
import {getVehicleOperationalFilters, getVehicleStageFilterOptions, useQueryParams} from './bridge';

export function OperationalVehicleAuditToolbar({stages, locations}) {
  const {params, setParams} = useQueryParams();
  const filters = getVehicleOperationalFilters(params);
  const currentYear = new Date().getFullYear();
  const active = Boolean(filters.search) || ['year','weekNumber','vehicleStageId','locationId'].some(key=>filters[key] !== 'all');
  const update = (key, value) => setParams({page:undefined,pageSize:undefined,[key]:value || undefined,...(key==='year'?{weekNumber:undefined}:{})});
  const select = (key, label, all, options) => <div className="vehicle-filter-field"><SelectInput id={'vehicle-filter-'+key} label={label} value={filters[key]==='all'?'':filters[key]} options={[{label:all,value:''},...options]} onChange={value=>update(key,String(value))}/></div>;
  return <Toolbar className={'toolbar vehicle-filters'+(active?' has-active-filters':'')}>
    <div className="vehicle-filter-search"><TextInput id="vehicle-filter-search" label="Buscar vehículo u operación" placeholder="Radicado, placa, OP, conductor o transportadora" value={filters.search} onChange={value=>update('search',value)}/></div>
    {select('year','Año','Todos los años',Array.from({length:11},(_,i)=>({label:String(currentYear+5-i),value:String(currentYear+5-i)})))}
    {select('weekNumber','Semana','Todas las semanas',Array.from({length:53},(_,i)=>({label:`Semana ${i+1}`,value:String(i+1)})))}
    {select('vehicleStageId','Etapa','Todas las etapas',getVehicleStageFilterOptions(stages))}
    {select('locationId','Ubicación','Todas las ubicaciones',locations.map(location=>({label:location.name,value:location.code})))}
    {active && <div className="sial-filter-reset"><Button variant="outlined" aria-label="Limpiar filtros" title="Limpiar filtros" onClick={()=>{setParams({search:undefined,year:undefined,weekNumber:undefined,vehicleStageId:undefined,locationId:undefined,page:undefined,pageSize:undefined});document.getElementById('vehicle-filter-search')?.focus();}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m15 3-5 10m-3-1 7 3-2 6H3l4-9Z M7 16l-1 5m4-4-1 4"/></svg></Button></div>}
  </Toolbar>;
}
