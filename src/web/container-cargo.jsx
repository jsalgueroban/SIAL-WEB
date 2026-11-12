import React, {useState} from 'react';
import {Button, Chip, Table, Pagination, FlowTimeline} from '@banasandev/banasan-ui';
import {TableColumnFilter} from 'banasan-ui-pr2243';
import {containerEvents, loadings, loadingDetail} from './security-product/fixtures';
import './container-cargo.css';

const rows = containerEvents.map(event => ({
  ...event,
  cargo: loadings.find(load => load.containerCode === event.containerLabel && load.radication === event.filingNumber)
})).sort((a,b) => Number(Boolean(b.cargo)) - Number(Boolean(a.cargo)));
function cargoState(row) {
  const count = row.cargo?.palletQuantity;
  if (count == null) return 'Sin dato';
  if (count === 0) return 'Vacío';
  const capacity = Number.parseInt(row.containerCapacity,10);
  if (!(capacity > 0)) return 'Sin dato';
  return count >= capacity ? 'Lleno' : 'Parcial';
}
const options = [...new Set(rows.map(cargoState))].map(value => ({value,label:value}));
const tones = {Lleno:'active',Parcial:'warning',Vacío:'info','Sin dato':'inactive'};

const formatTime = stamp => new Intl.DateTimeFormat('es-CO', {
  timeZone:'America/Bogota', hour:'2-digit', minute:'2-digit', hourCycle:'h23'
}).format(new Date(stamp));

export function cargoPalletRecord(sscc) {
  for (const row of rows.filter(item => item.cargo)) {
    const {loading} = loadingDetail(row.cargo.loadingId).document;
    const pallet = loading.pallets.find(item => item.sscc === sscc);
    if (!pallet) continue;
    const stamp = loading.closedAt;
    const date = new Date(stamp).toLocaleDateString('es-CO',{timeZone:'America/Bogota',day:'2-digit',month:'2-digit',year:'numeric'});
    const time = formatTime(stamp);
    return {
      sscc, type:'Sin clasificar', status:'Registrado en cargue', statusKey:'loaded',
      farm:row.cargo.originName, farmCode:row.cargo.originCode || row.cargo.originName,
      week:row.weekLabel, container:row.containerLabel, operation:row.operationCode,
      reference:pallet.composition.map(item=>item.referenceCode).join(', '), boxes:pallet.boxQuantity,
      updated:date+' · '+time, location:row.cargo.originName, dispatch:row.travelOrder,
      events:[[date,time,'Registro al cierre del cargue',row.cargo.originName,row.operationCode]]
    };
  }
}

function Cargo({row,onClose}) {
  const heading = React.useRef(null);
  React.useLayoutEffect(() => {
    heading.current.focus({preventScroll:true});
    heading.current.closest('article').scrollIntoView({block:'start'});
  }, []);
  const loading = row.cargo ? loadingDetail(row.cargo.loadingId).document.loading : null;
  const [position, selectPosition] = useState(loading?.pallets[0]?.position);
  const [history, setHistory] = useState("recorrido");
  const movements = [...row.trace].sort((a,b)=>Date.parse(b.occurredAtValue)-Date.parse(a.occurredAtValue));
  const [expanded, setExpanded] = useState(false);
  const recent = expanded ? movements : movements.slice(0,3);
  const [step, selectStep] = useState(movements[0]?.id);
  const pallet = loading?.pallets.find(item => item.position === position);
  const trace = pallet && (window.SIALPalletTraceRecords.find(item=>item.sscc===pallet.sscc) || cargoPalletRecord(pallet.sscc));
  const assembly = trace?.movementDetails?.findLast(item=>item?.build)?.location;
  const seals = row.trace.flatMap(event => (event.sealDetails || []).map(seal=>({
    ...seal, event:event.name, when:event.occurredAt, place:event.zoneLabel, id:event.id+'-'+seal.label+'-'+seal.value
  })));
  const sealGroups = Map.groupBy(seals, seal => seal.value);
  return <article className="card cargo-detail" id="container-cargo">
    <header className="card-header"><div><h2 ref={heading} tabIndex={-1}>{loading?'Cargue':'Traza'} de {row.containerLabel}</h2><p>{row.cargo ? row.cargo.originName+' → '+row.cargo.destinationName : 'Sin cargue registrado'}</p></div>{loading && <div className="cargo-header-actions"><Chip tone="info">{loading.boxQuantity} cajas en total</Chip></div>}</header>
    <div className={loading?'card-body cargo-workspace':'card-body'}>{loading && <section><h3>Posiciones de cargue</h3><div className="cargo-map">{loading.pallets.map(item =>
      <button key={item.position} aria-pressed={position===item.position} onClick={()=>selectPosition(item.position)}>Pos. {String(item.position).padStart(2,'0')}<small>{item.boxQuantity} cajas</small></button>)}</div></section>}
    <div className="cargo-inspector">
      {pallet && <section aria-live="polite">
        <div className="cargo-ficha-heading"><h3>Ficha del pallet</h3><Chip tone={trace.type==='Completo'?'success':trace.type==='Incompleto'?'warning':'inactive'}>{trace.type}</Chip>
          <a className="btn btn-secondary cargo-trace-action" href={'trazabilidad-pallets.html?sscc='+encodeURIComponent(pallet.sscc)} aria-label={'Abrir trazabilidad completa del pallet '+pallet.sscc}>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M6 9v5a4 4 0 0 0 4 4h5"/></svg>
            Abrir trazabilidad
          </a></div>
        <dl className="cargo-facts">
          <div><dt>SSCC</dt><dd>{pallet.sscc}</dd></div>
          <div><dt>Peso estimado</dt><dd>{pallet.estimatedWeightKg.toLocaleString('es-CO')} kg</dd></div>
          {pallet.composition.length === 1 && <div><dt>Referencia</dt><dd>{pallet.composition[0].referenceCode}</dd></div>}
          <div><dt>Lugar de armado</dt><dd>{assembly || 'Sin registro'}</dd></div>
          <div><dt>Estado actual</dt><dd>{trace.status}</dd></div>
          <div><dt>Última actualización</dt><dd>{trace.updated}</dd></div>
        </dl>
        {pallet.composition.length > 1 && <Table minWidth="240px" columns={[
          {key:'referenceCode',header:'Referencia',render:item=>item.referenceCode},
          {key:'boxQuantity',header:'Cajas',render:item=>item.boxQuantity ?? '—'}
        ]} data={pallet.composition} rowKey={item=>item.referenceCode}/>}
      </section>}
      <section className="cargo-journey"><h3>Historial del contenedor</h3>
        <div className="cargo-history-controls" role="group" aria-label="Historial del contenedor">
          {[['recorrido','Recorrido'],['sellos','Historial de sellos']].map(([key,label])=><Button key={key} variant={history===key?'filled':'ghost'} aria-pressed={history===key} onClick={()=>setHistory(key)}>{label}</Button>)}
        </div>
        {history==='recorrido' ?
        <><FlowTimeline variant="connected" items={recent.map(item=>({
          key:item.id, title:item.name,
          meta:item.id === step ? [item.zoneLabel,item.occurredAt,item.responsible].filter(Boolean).join(' · ') : undefined
        }))} selectedKey={step} onSelect={selectStep}/></> :
          <div className="cargo-seal-list">{sealGroups.size ? Array.from(sealGroups, ([code,events])=>
            <section key={code} className="cargo-seal">
              <header><h4>{code}</h4><span>{events[0].label}</span></header>
              <ol>{events.map(event=><li key={event.id}>
                <div>{event.event}<small>{event.place}</small></div><small>{event.when}</small>
              </li>)}</ol>
            </section>) : <p>Sin sellos registrados.</p>}</div>}
        <footer className="cargo-history-footer">
          {history==="recorrido" && movements.length>3 && <Button variant="ghost" aria-expanded={expanded} onClick={()=>{setExpanded(!expanded);selectStep(movements[0]?.id);}}>{expanded?"Ver últimos 3 movimientos":"Ver los "+movements.length+" movimientos"}</Button>}
          <Button variant="outlined" onClick={onClose}>{loading?"Cerrar cargue":"Cerrar traza"}</Button>
        </footer>
      </section>
    </div></div>
  </article>;
}

export function ContainerCargo() {
  const [selected, select] = useState(null);
  const [filter, setFilter] = useState(null);
  const visible = rows.filter(row=>filter===null || filter.includes(cargoState(row)));
  const [page,setPage] = useState(1);
  const [pageSize,setPageSize] = useState(10);
  const shown = visible.slice((page-1)*pageSize,page*pageSize);
  const row = shown.find(item=>item.id===selected);
  function closeCargo() {
    const trigger = document.getElementById('cargo-trigger-'+selected);
    select(null);
    trigger?.focus({preventScroll:true});
    trigger?.closest('tr')?.scrollIntoView({block:'center'});
  }
  const columns = [
    {key:'container',header:'Contenedor',render:item=><div className="plan-documents"><strong>{item.containerLabel}</strong><small>{item.containerType || 'Tipo sin registrar'}</small></div>},
    {key:'location',header:'Ubicación',render:item=>item.locationLabel},
    {key:'stage',header:'Etapa',render:item=>{
      const latest = item.trace.reduce((last,entry)=>!last || entry.occurredAtValue > last.occurredAtValue ? entry : last,null);
      return <div className="plan-documents">{item.status}{/programad/i.test(item.status) && <small>Radicación {item.filingNumber}</small>}<small>{latest?.occurredAt || 'Sin fecha de movimiento'}</small></div>;
    }},
    {key:'cargo',header:'Cantidad de pallets',align:'center',render:item=><Button id={"cargo-trigger-"+item.id} variant="ghost" aria-label={`${item.id===selected?'Ocultar':'Ver'} ${item.cargo?'cargue':'traza'} de ${item.containerLabel}`} aria-expanded={item.id===selected} onClick={event=>{event.stopPropagation();if(item.id===selected) closeCargo(); else select(item.id);}}>{item.cargo?.palletQuantity ?? 'Sin dato'} {item.id===selected?'▴':'▾'}</Button>},
    {key:'state',header:<TableColumnFilter label="Estado de carga" options={options} value={filter} onApply={value=>{setFilter(value);setPage(1);select(null)}}/>,render:item=><Chip preset={tones[cargoState(item)]}>{cargoState(item)}</Chip>},
    {key:'week',header:'Semana operativa',render:item=>item.weekNumber+' · '+item.year}
  ];
  return <section className="page cargo-page"><p className="page-eyebrow">Operaciones Puerto / Trazabilidad</p><h1 className="page-title">Trazabilidad de contenedores</h1><article className="card plan-list"><header className="card-header"><h2 className="card-title">Contenedores</h2><Chip preset="info">{visible.length} {visible.length===1?"registro":"registros"}</Chip></header><div className="sial-library-table"><Table rowProps={item=>({className:'cargo-open-row',onClick:()=>{if(selected===item.id) document.getElementById('container-cargo')?.scrollIntoView({block:'start'}); else select(item.id);}})} data={shown} columns={columns} rowKey={item=>item.id} minWidth="940px" emptyState="Sin contenedores para los estados seleccionados."/><Pagination page={page} pageSize={pageSize} total={visible.length} pageSizeOptions={[10,30,50]} onPageChange={next=>{setPage(next);select(null);}} onPageSizeChange={size=>{setPageSize(size);setPage(1);select(null);}}/></div></article>{row && <Cargo key={row.id} row={row} onClose={closeCargo}/>}</section>;
}
