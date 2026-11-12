// Banasan UI · PR 2243 · cf38b49da6d504ad16be24e2be21221793ba40c4
import React, { useState } from "react";
import { Button, Card, Chip, IconButton, MenuShortIcon, Pagination, SelectInput, Table, TableColumnFilter, TableContextMenu, TableRowActions, TextInput, ViewIcon } from "banasan-ui-pr2243";
import { TableFilterReset } from "./table-filter-reset.jsx";
const coordinator = "Coordinación de Transporte";
const recipients = {
  Finca: "Santa Isabel", Puerto: "Terminal portuaria", Transportador: "Transportes Caribe",
  Conductor: "Carlos Mendoza", Seguridad: "Portería central", Operación: "Operación logística"
};
const options = values => values.map(value => ({ label: value, value }));
const first = { fecha: "12 nov 2026", ventana: "08:00–09:00", origen: "Almacén central", destino: "Santa Isabel", placa: "TUL458", conductor: "Carlos Mendoza" };
const plans = [
  { id: "PRO-532-001", order: "OTI-546-001", material: "Cajas de cartón y estibas", document: "RPT-2026-0881", restriction: "Ingreso por portería de insumos", roles: Object.keys(recipients),
    versions: [
      { ...first, published: "10 nov · 15:20" },
      { ...first, ventana: "10:00–11:00", placa: "TUL482", published: "11 nov · 07:45" }
    ] },
  { id: "PRO-532-002", order: "OTI-546-002", material: "Estibas de madera", document: "REM-2026-0184", restriction: "Presentar remisión al ingreso", roles: ["Seguridad", "Operación", "Transportador"],
    versions: [{ ...first, destino: "El Retiro", placa: "CAM102", conductor: "Ana Ramírez", ventana: "13:00–14:00", published: "11 nov · 08:10" }] }
];
const channel = role => role === "Finca" ? "Correo" : "SIAL Web";
function initialEvents(plan, version, role) {
  const failed = plan === plans[0] && version === 2 && role === "Finca";
  const received = version < plan.versions.length || role === "Seguridad";
  const at = plan.versions[version - 1].published;
  return [{ status: failed ? "Fallido" : "Enviado", at, user: "Distribución SIAL", note: failed ? "El servidor de correo no respondió." : "Versión entregada al canal." },
    ...(received ? [{ status: "Acusado", at, user: recipients[role], note: "Recepción confirmada." }] : [])];
}
const storage = "sial-hu532-deliveries-v1";
function readEvents() {
  try { return JSON.parse(localStorage.getItem(storage)) || {}; } catch { return {}; }
}
const fields = { fecha: "Fecha", ventana: "Ventana", origen: "Origen", destino: "Destino", placa: "Vehículo", conductor: "Conductor" };
function Status({ value }) {
  return <Chip preset={value === "Acusado" ? "active" : value === "Fallido" ? "error" : "info"}>{value}</Chip>;
}
export function PublishedSchedules() {
  const [profile, setProfile] = useState(coordinator);
  const [query, setQuery] = useState("");
  const [plan, setPlan] = useState(null);
  const [inspectedRole, setInspectedRole] = useState("Finca");
  const [section, setSection] = useState("Viajes");
  const [version, setVersion] = useState(1);
  const [saved, setSaved] = useState(readEvents);
  const manager = profile === coordinator;
  const [destinations, setDestinations] = useState(null);
  const scoped = plans.filter(p => manager || p.roles.includes(profile));
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const roles = p => manager ? p.roles : [profile];
  const key = (p,v,r) => [p.id,v,r].join("/");
  const events = (p,v,r) => saved[key(p,v,r)] || initialEvents(p,v,r);
  const status = (p,v,r) => events(p,v,r).at(-1).status;
  const [receiptFilter, setReceiptFilter] = useState("");
  function receipt(p) {
    if (!manager) return status(p,p.versions.length,profile);
    const states = roles(p).map(r=>status(p,p.versions.length,r));
    if (states.includes("Fallido")) return "Fallido";
    return states.every(value=>value==="Acusado") ? "Acusado" : "En seguimiento";
  }
  const visible = scoped.filter(p=>{
    const latest = p.versions.at(-1);
    const searchable = [p.id,p.order,p.document,p.material,...Object.values(latest)].join(" ").toLocaleLowerCase("es");
    return (!destinations || destinations.includes(latest.destino))
      && (!receiptFilter || receipt(p)===receiptFilter)
      && searchable.includes(query.trim().toLocaleLowerCase("es"));
  });
  const currentPage = Math.min(page, Math.max(1, Math.ceil(visible.length/pageSize)));
  const rows = visible.slice((currentPage-1)*pageSize,currentPage*pageSize);
  function record(role, retry) {
    const id = key(plan,version,role);
    const current = readEvents();
    const history = current[id] || initialEvents(plan,version,role);
    if (version !== plan.versions.length || history.at(-1).status !== (retry ? "Fallido" : "Enviado")) return;
    const entry = { status: retry ? "Enviado" : "Acusado", at: new Date().toLocaleString("es-CO"), user: retry ? coordinator : recipients[role], note: retry ? "Reenvío de la misma versión." : "Recepción confirmada." };
    const next = {...current, [id]: [...history,entry]};
    localStorage.setItem(storage,JSON.stringify(next));
    setSaved(next);
  }
  function open(p, tab) { setPlan(p); setVersion(p.versions.length); setSection(tab); }
  const [menu, setMenu] = useState(null);
  const sections = ["Viajes", "Versiones", "Recepción"];
  function showActions(event, item, pointer = false) {
    event.preventDefault();
    event.stopPropagation();
    const trigger = event.currentTarget.closest("tr").querySelector("[aria-haspopup=menu]");
    const rect = trigger.getBoundingClientRect();
    setMenu({ item, trigger, position: pointer ? {x:event.clientX,y:event.clientY} : {x:rect.left,y:rect.bottom} });
  }
  function go(item, tab) {
    setMenu(null);
    open(item, tab);
    requestAnimationFrame(()=>{
      document.getElementById("pub-heading")?.focus({preventScroll:true});
      document.getElementById("pub-detail")?.scrollIntoView({block:"start",behavior:"instant"});
    });
  }
  function back() {
    const id = plan.id;
    setPlan(null);
    requestAnimationFrame(()=>{
      document.getElementById("actions-"+id)?.focus({preventScroll:true});
      document.getElementById("pub-list")?.scrollIntoView({block:"start",behavior:"instant"});
    });
  }
  const columns = [
    {key:"order",header:"Programación",render:p=><div className="plan-documents"><strong>{p.id}</strong><small>{p.order} · V{p.versions.length}</small></div>},
    {key:"vehicle",header:"Vehículo / conductor",render:p=><div className="plan-documents">{p.versions.at(-1).placa}<small>{p.versions.at(-1).conductor}</small></div>},
    {key:"destination",header:<TableColumnFilter label="Destino" options={options([...new Set(scoped.map(p=>p.versions.at(-1).destino))])} value={destinations} onApply={value=>{setDestinations(value);setPage(1);}}/>,render:p=>p.versions.at(-1).destino},
    {key:"window",header:"Fecha y ventana",render:p=><div className="plan-documents">{p.versions.at(-1).fecha}<small>{p.versions.at(-1).ventana}</small></div>},
    ...(manager ? [{key:"count",header:"Acuses",align:"center",render:p=>p.roles.filter(r=>status(p,p.versions.length,r)==="Acusado").length+" / "+p.roles.length}] : []),
    {key:"delivery",header:"Estado de recepción",render:p=><Status value={receipt(p)}/>}
  ];
  const snapshot = plan?.versions[version-1];
  const previous = plan?.versions[version-2];
  const list = <><p className="page-eyebrow"><a href="plan-operacional.html">Transporte / Plan operacional</a></p>
    <header className="page-header"><div><h1 className="page-title">Programaciones publicadas</h1><p className="page-subtitle">Consulta los viajes vigentes y la recepción de cada publicación.</p></div></header>
    <article className="card plan-list" id="pub-list">
      <div className="card-header"><div><h2 className="card-title">Bandeja de programaciones</h2><p className="card-subtitle">Viajes y acuses de la versión vigente.</p></div><div className="card-actions"><SelectInput id="pub-profile" label="Simular perfil" options={options([coordinator,...Object.keys(recipients),"Sin acceso"])} value={profile} onChange={v=>{setPlan(null);setProfile(v);setQuery("");setReceiptFilter("");setDestinations(null);setPage(1);}}/><Chip preset="info" aria-live="polite">{visible.length} {visible.length===1?"registro":"registros"}</Chip></div></div>
      {profile!=="Sin acceso" && <div className="card-body"><div className="toolbar plan-toolbar sial-filter-toolbar" data-sial-filter-fields="2">
        <div className="sial-library-search"><TextInput id="pub-query" label="Buscar programación" placeholder="Buscar por orden, placa, conductor o documento" value={query} onChange={v=>{setQuery(v);setPage(1);}}/></div>
        <div className="field plan-filter"><SelectInput id="pub-receipt" label="Estado de recepción" options={[{value:"",label:"Todos los estados"},...options(manager?["En seguimiento","Acusado","Fallido"]:["Enviado","Acusado","Fallido"])]} value={receiptFilter} onChange={v=>{setReceiptFilter(v);setPage(1);}}/></div>
        <TableFilterReset active={Boolean(query || receiptFilter) || destinations!==null} onReset={()=>{setQuery("");setReceiptFilter("");setDestinations(null);setPage(1);}}/>
      </div></div>}
    {profile === "Sin acceso" ? <p className="card-body" role="status">Acceso denegado.</p> : <div className="sial-library-table" data-sial-component="Table"><Table columns={columns} data={rows} rowKey={p=>p.id} minWidth="900px" emptyState="No hay publicaciones para esta consulta." actionsHeader="Acciones" actionsWidth="160px"
      rowProps={p=>({tabIndex:0,"data-selected":(menu?.item ?? plan)===p || undefined,onContextMenu:e=>showActions(e,p,true),onKeyDown:e=>{if(e.key==="ContextMenu" || (e.shiftKey && e.key==="F10")) showActions(e,p);}})}
      actions={p=><TableRowActions label={"Acciones de "+p.order}><IconButton variant="ghost" aria-label={"Ver viajes de "+p.order} title="Ver viajes" onClick={()=>go(p,"Viajes")}><ViewIcon/></IconButton><IconButton id={"actions-"+p.id} variant="ghost" aria-haspopup="menu" aria-expanded={menu?.item===p} aria-label={"Opciones de "+p.order} title="Opciones de la programación" onClick={e=>showActions(e,p)}><MenuShortIcon/></IconButton></TableRowActions>}/></div>}
    {profile!=="Sin acceso" && <Pagination page={currentPage} pageSize={pageSize} total={visible.length} pageSizeOptions={[10,30,50]} onPageChange={setPage} onPageSizeChange={size=>{setPageSize(size);setPage(1);}}/>}</article>
    {menu && <TableContextMenu key={menu.item.id} open position={menu.position} label={menu.item.order} returnFocusTo={menu.trigger}
      onClose={()=>setMenu(null)} items={sections.map((tab,i)=>({id:tab,label:["Ver viajes","Consultar versiones","Seguir recepción"][i],onSelect:()=>go(menu.item,tab)}))}/>}</>;
  if (!plan || !rows.includes(plan)) return list;
  const audience = roles(plan);
  const changed = previous ? Object.keys(fields).filter(k=>previous[k]!==snapshot[k]) : [];
  return <>{list}<section className="pub-inline" id="pub-detail" aria-labelledby="pub-heading"><Card className="card" style={{padding:0}}>
    <div className="pub-head">
      <nav className="pub-nav" aria-label="Secciones de la programación">{sections.map(tab=><Button key={tab} variant={section===tab?"filled":"ghost"} aria-pressed={section===tab} onClick={()=>setSection(tab)}>{tab}</Button>)}</nav>
      <SelectInput id="pub-version" label="Versión publicada" value={String(version)} options={plan.versions.map((v,i)=>({value:String(i+1),label:"V"+(i+1)+(i+1===plan.versions.length?" · Vigente":" · Histórica")+" · "+v.published})).reverse()} onChange={v=>setVersion(Number(v))}/>
    </div>
    <header className="card-header pub-order-header"><div><h2 className="card-title" tabIndex="-1" id="pub-heading">{plan.order}</h2><p className="page-subtitle">{plan.id} · {plan.material} · {profile}</p></div><Button variant="outlined" onClick={back}>Cerrar detalle</Button></header>
    <div className="pub-body">
      {section==="Viajes" && <>
        <p className="pub-caption">Viaje 1 · {plan.document}</p>
        <h3>{snapshot.origen} → {snapshot.destino}</h3>
        <dl className="pub-facts">{[["Fecha",snapshot.fecha],["Ventana",snapshot.ventana],["Vehículo",snapshot.placa],["Conductor",snapshot.conductor],["Materiales",plan.material],["Restricción de ingreso",plan.restriction]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      </>}
      {section==="Versiones" && <>
        <p className="pub-caption">Viaje 1 · {plan.document} · Publicada el {snapshot.published}</p>
        <h3>{previous ? "Cambios de V"+(version-1)+" a V"+version : "Primera publicación"}</h3>
        {previous && changed.length ? <dl className="pub-diff">{changed.map(k=><div key={k}><dt>{fields[k]}</dt><dd><span aria-label="Anterior">{previous[k]}</span><span aria-hidden="true"> → </span><strong aria-label="Publicado">{snapshot[k]}</strong></dd></div>)}</dl> : <p>{previous?"Sin cambios en el viaje.":"Viaje publicado con destino a "+snapshot.destino+"."}</p>}
      </>}
      {section==="Recepción" && <>
        <p className="pub-caption">Banasan · Plan operacional · V{version}</p><h3>Recepción por destinatario</h3>
        <ul className="pub-deliveries">{audience.map(role=>{
          const selected = inspectedRole===role;
          const result = status(plan,version,role);
          return <li key={role}><div className="pub-delivery-row"><div><strong>{recipients[role]}</strong><small>{role} · {channel(role)}</small></div><Status value={result}/><Button variant="ghost" aria-expanded={selected} onClick={()=>setInspectedRole(selected?null:role)}>{selected?"Ocultar historial":"Ver historial"}</Button></div>
          {selected && <div className="pub-log"><ol>{events(plan,version,role).map((e,i)=><li key={i}><strong>{e.status}</strong> · {e.at} · {e.user}<small>{e.note}</small></li>)}</ol>
          {version===plan.versions.length && manager && result==="Fallido" && <Button onClick={()=>record(role,true)}>Reintentar envío</Button>}
          {version===plan.versions.length && !manager && result==="Enviado" && <Button onClick={()=>record(role,false)}>Confirmar recepción</Button>}</div>}</li>;
        })}</ul>
      </>}
    </div></Card></section></>;
}
