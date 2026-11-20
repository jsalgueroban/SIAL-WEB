import { icon, stagePaths } from "./materials-order-trace.jsx";
import React, {useState, useEffect, useRef} from "react";
import {Card, CloseIcon, IconButton, TableRowActions, ViewIcon, Button, Chip, DateInput, Pagination, SelectInput, Table, TextInput, EditIcon, UsersIcon, ArrowRightIcon} from "@banasandev/banasan-ui";
import {TableFilterReset} from "./table-filter-reset.jsx";


const stages = ["Pendiente","Programado","En preparación","Despachado","Entregado"];
const milestones = ["Solicitud", "Programación", "Preparación", "Despacho", "Entrega"];
const receptionFormat = new Intl.DateTimeFormat("es-CO", {day:"numeric", month:"short", year:"numeric"});
const stops = ["CCOL","OPSM","OPSP","TECB","TIND"];
const farms = ["El Rubí","La Bacota","Plantación","Villa Beatriz","Despensa","Plantación","Porvenir","Las Mercedes","Arenal","La Ceiba"];
const quantity = [55,69,7,159,75,35,48,5,24,96];
const seeds = farms.map((farm,i) => ({
  week: 47, type: "Semanal", id: "PED-"+String(i+1).padStart(3,"0"), farm, stop: stops[[0,0,0,0,1,2,2,3,4,2][i]],
  carton: i<4 || i===9 ? quantity[i] : 0, pallets: i>=4 && i<9 ? quantity[i] : 0,
  status: stages[[0,0,0,1,2,1,1,0,0,2][i]], owner:"", date:"2026-11-18", time:i<4?"17:04":"11:53"
}));
const labels = {id:"Pedido",farm:"Finca",stop:"Lugar de cargue",carton:"Cartón",pallets:"Estibas",time:"Recepción",owner:"Responsable",status:"Estado"};
const options = values => values.map(value=>({value,label:value}));
const display = (item,key) => key==="owner" ? item.owner || "Sin asignar" : key==="time" ? "18 nov. · "+item.time : item[key] || "—";
function exportList(rows){
  const keys=Object.keys(labels);
  const quote=value=>'"'+String(value).replaceAll('"','""')+'"';
  const contents=[Object.values(labels),...rows.map(row=>keys.map(key=>display(row,key)))].map(row=>row.map(quote).join(",")).join("\r\n");
  const url=URL.createObjectURL(new Blob(["\uFEFF",contents],{type:"text/csv;charset=utf-8"}));
  const link=document.createElement("a");
  link.href=url;
  link.download="programacion-pedidos.csv";
  link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function detailData(item, preset) {
  return [
    {label:"Estado",children:<Chip preset={preset[item.status]}>{item.status}</Chip>},
    {label:"Responsable",children:display(item,"owner")},
    {label:"Recepción",children:receptionFormat.format(new Date(item.date+"T12:00:00"))+" · "+item.time},
    {label:"Semana",children:item.week}, {label:"Tipo de pedido",children:item.type},
    {label:"Lugar de cargue",children:item.stop},
    {label:"Cartón",children:display(item,"carton")}, {label:"Estibas",children:display(item,"pallets")}
  ];
}
export function MaterialsScheduling(){
  const [rows,setRows]=useState(seeds), [week,setWeek]=useState("47"), [query,search]=useState(""), [stop,setStop]=useState(""), [status,setStatus]=useState(""), [kind,setKind]=useState("Todos"), [date,setDate]=useState("");
  const [id,select]=useState(null), [editing,edit]=useState(false), [owner,assign]=useState(""), [origin,changeOrigin]=useState("");
  const [inspected,setInspected]=useState(null);
  const [moreFilters,setMoreFilters]=useState(false);
  const secondaryFilterCount=Number(kind!=="Todos")+Number(Boolean(stop))+Number(Boolean(date));
  const [page,setPage]=useState(1), [size,setSize]=useState(10);
  const weekly=week==="47"?rows:[];
  const filtered=weekly.filter(r=>r.farm.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()) && (!stop||r.stop===stop) && (!status||r.status===status) && (!date||r.date===date) && (kind==="Todos" || (kind==="Cartón"?r.carton:r.pallets)>0));

  const update=changes=>setRows(current=>current.map(r=>r.id===id?{...r,...changes}:r));
  const sum=key=>weekly.reduce((total,r)=>total+r[key],0);
  const metrics=[["Pedidos en programación",weekly.length,"Total de la semana seleccionada."],["Fincas con pedidos",new Set(weekly.map(r=>r.farm)).size,"Fincas de la semana seleccionada."],["Cartón solicitado",sum("carton"),"Total de la semana seleccionada."],["Estibas solicitadas",sum("pallets"),"Total de la semana seleccionada."]];
  function open(row){setInspected(null);select(row.id);edit(false);assign(row.owner);changeOrigin(row.stop);}
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / size)));
  const visible = filtered.slice((currentPage - 1) * size, currentPage * size);
  const item = rows.find(row=>row.id===id);
  const preset = {Pendiente:"warning", Programado:"info", "En preparación":"info", Despachado:"info", Entregado:"active"};
  const columns = Object.entries(labels).map(([key, header]) => ({
    key, header,
    render: row => key === "status"
      ? <Chip preset={preset[row.status]}>{row.status}</Chip>
      : display(row, key)
  }));
  function filter(change) {
    return value => { change(value); setPage(1); };
  }
  function clear() {
    search(""); setStop(""); setStatus(""); setDate(""); setKind("Todos"); setPage(1);
  }
  const activeStage = item ? stages.indexOf(item.status) : -1;
  const detailRef = useRef(null);
  useEffect(() => {
    if (item && detailRef.current && !detailRef.current.open) detailRef.current.showModal();
  }, [item]);
  function closeDetail(){ detailRef.current?.close(); select(null); requestAnimationFrame(()=>document.getElementById("action-"+id)?.focus({preventScroll:true})); }
  return <>
    <p className="page-eyebrow">Materiales / Programación</p>
    <header className="page-header">
      <div><h1 className="page-title">Programación de pedidos de insumos</h1>
        <p className="page-subtitle">Planea los pedidos semanales por finca y lugar de cargue.</p></div>
    </header>
    <section className="schedule-summary" aria-label="Resumen semanal">{metrics.map(([title,value,description])=>
      <Card key={title} variant="stats" title={title} value={value} description={description} />)}</section>
    <div className="schedule-review">
    <article className="card standard-master-card schedule-master">
      <div className="card-header"><div><h2 className="card-title">Pedidos de la semana</h2></div>
        <div className="card-actions"><Chip preset="info">{filtered.length} pedidos</Chip>
          <Button variant="outlined" disabled={!filtered.length} onClick={()=>exportList(filtered)}>Exportar</Button>
          <Button onClick={()=>location.assign("gestion-pedidos-materiales.html")}>Gestionar pedidos</Button></div></div>
      <div className="card-body schedule-filter-grid">
      <SelectInput id="scheduleWeek" label="Semana de programación" value={week} onChange={filter(setWeek)}
        options={[{value:"47",label:"Semana 47 · 16–22 nov. 2026"},{value:"48",label:"Semana 48 · 23–29 nov. 2026"}]} />
        <TextInput id="scheduleFarm" label="Buscar finca" placeholder="Nombre de la finca" value={query} onChange={filter(search)} />
        <SelectInput id="scheduleState" label="Estado" value={status} options={[{value:"",label:"Todos"},...options(stages)]} onChange={filter(setStatus)} />
        <div className="schedule-filter-actions">
          <Button variant="outlined" aria-expanded={moreFilters} aria-controls="schedule-more-filters" onClick={()=>setMoreFilters(value=>!value)}>
            {moreFilters ? "Menos filtros" : "Más filtros"}{secondaryFilterCount ? ` (${secondaryFilterCount})` : ""}
          </Button>
        <TableFilterReset active={Boolean(query || stop || status || date || kind!=="Todos")} onReset={clear} />
        </div>
      </div>
      <div id="schedule-more-filters" className="schedule-secondary-filters" hidden={!moreFilters}>
        <SelectInput id="scheduleKind" label="Insumo" value={kind} options={options(["Todos","Cartón","Estibas"])} onChange={filter(setKind)} />
        <SelectInput id="scheduleStop" label="Lugar de cargue" value={stop} options={[{value:"",label:"Todos"},...options(stops)]} onChange={filter(setStop)} />
        <DateInput id="scheduleDate" label="Fecha de recepción" value={date ? new Date(date+"T12:00:00") : null}
          onChange={value=>filter(setDate)(value ? [value.getFullYear(), String(value.getMonth()+1).padStart(2,"0"), String(value.getDate()).padStart(2,"0")].join("-") : "")} />
      </div>
      <div className="schedule-list">
      <Table columns={columns} data={visible} rowKey={row=>row.id} minWidth="1000px"
        emptyState="No hay pedidos para esta selección." actionsHeader="Acciones" actionsWidth="80px"
        actions={row=><TableRowActions label={"Acciones de "+row.id}>
          <IconButton id={"action-"+row.id} variant="ghost" aria-label={"Ver detalle de "+row.id}
            title="Ver detalle" onClick={()=>open(row)}><ViewIcon /></IconButton>
        </TableRowActions>} />
      <Pagination page={currentPage} pageSize={size} total={filtered.length} pageSizeOptions={[5,10,20]}
        onPageChange={setPage} onPageSizeChange={value=>{setSize(value);setPage(1);}} />
      </div>
    </article>
      </div>
    {item && <dialog ref={detailRef} className="schedule-dialog" aria-labelledby="schedule-dialog-title"
      onCancel={event=>{event.preventDefault();closeDetail();}}
      onClick={event=>{if(event.target===event.currentTarget){const r=event.currentTarget.getBoundingClientRect();if(event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom)closeDetail();}}}>
      <header className="schedule-dialog-header"><div><h2 id="schedule-dialog-title" className="card-title">Detalle del pedido</h2>
        <p className="card-subtitle">{item.id} · {item.farm}</p></div>
        <IconButton variant="ghost" aria-label="Cerrar detalle" onClick={closeDetail}><CloseIcon /></IconButton></header>
      <div className="schedule-dialog-body">
        <section aria-labelledby="schedule-data-title" className="schedule-facts-section">
          <div className="schedule-section-heading"><h3 id="schedule-data-title">Información del pedido</h3><Chip preset={preset[item.status]}>{item.status}</Chip></div>
          <dl className="schedule-facts">{detailData(item,preset).filter(field=>field.label!=="Estado").map(({label,children})=>
            <div key={label}><dt>{label}</dt><dd>{children}</dd></div>)}</dl>
        </section>
        <section className="schedule-progress" aria-labelledby="schedule-progress-title">
          <h3 id="schedule-progress-title" className="card-title">Ruta operativa</h3>
          <div className="schedule-operational-route">
            
            <div className="journey-scroll"><ol className="journey" aria-label="Etapas del pedido"
              style={{"--progress":(activeStage/milestones.length*100)+"%"}}>
              {milestones.map((title,index)=>{
                const received=receptionFormat.format(new Date(item.date+"T12:00:00"))+" · "+item.time;
                const start=index===0 ? received : index>activeStage ? "Pendiente" : "Sin registro";
                const end=index>activeStage ? "Pendiente" : index===activeStage ? "En curso" : "Sin registro";
                return <li key={title}><button type="button"
                  className={"journey-step "+(index<activeStage?"is-complete":index===activeStage?"is-current":"is-pending")+(inspected===index?" is-inspected":"")}
                  aria-current={index===activeStage?"step":undefined} aria-label={"Consultar etapa "+title}
                  onClick={()=>setInspected(inspected===index?null:index)}>
                  {index===activeStage && <span className="schedule-current-label">ACTUAL</span>}<span className="journey-marker">{icon(stagePaths[[1,0,2,3,6][index]])}</span>
                  <span className="journey-label">{title}</span>
                  <span className="journey-time"><span><b>Inicio</b>{start}</span><span><b>Fin</b>{end}</span></span>
                </button></li>;
              })}
            </ol></div>
          </div>
          {inspected!==null && <div className="schedule-stage-detail" aria-live="polite">
            <strong>{milestones[inspected]}</strong>
            <span>{inspected<activeStage ? "Completada" : inspected===activeStage ? "Etapa actual" : "Por realizar"}</span>
            {inspected===0 && <p>Recepción del pedido · {receptionFormat.format(new Date(item.date+"T12:00:00"))} · {item.time}</p>}
          </div>}
        </section>
        {editing==="owner" && <TextInput id="scheduleOwner" label="Responsable" value={owner} onChange={assign} />}
        {editing==="stop" && <SelectInput id="editScheduleStop" label="Lugar de cargue" value={origin} onChange={changeOrigin} options={options(stops)} />}
        <div className="card-actions workflow-actions">{editing ? <>
          <Button variant="outlined" onClick={()=>edit(false)}>Cancelar</Button>
          <Button disabled={editing==="owner" && !owner.trim()} onClick={()=>{
            update(editing==="owner" ? {owner:owner.trim()} : {stop:origin}); edit(false);
          }}>Guardar cambios</Button>
        </> : <>
          <Button variant="outlined" onClick={()=>{changeOrigin(item.stop);edit("stop");}}><EditIcon /> Editar cargue</Button>
          <Button variant="outlined" onClick={()=>{assign(item.owner);edit("owner");}}><UsersIcon /> {item.owner ? "Cambiar responsable" : "Asignar responsable"}</Button>
          <Button disabled={activeStage===stages.length-1} onClick={()=>update({status:stages[activeStage+1]})}>Avanzar estado <ArrowRightIcon /></Button>
        </>}</div>
      </div></dialog>}
  </>;
}
