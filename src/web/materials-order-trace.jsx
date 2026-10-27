import React, { useEffect, useState } from "react";
import { Button, Notice, TextInput } from "@banasandev/banasan-ui";
import { readSubmittedRequest } from "./materials-order-state.js";

export const stageNames = ["Preparación", "Creación", "Despacho", "En salida", "En tránsito", "En finca", "Entrega realizada"];
export const stagePaths = [
  <><path d="m4 7 8-4 8 4-8 4Z" /><path d="M4 7v10l8 4 8-4V7M12 11v10" /></>,
  <><path d="M9 5h6M9 9h6M9 13h4" /><path d="M7 3h10a2 2 0 0 1 2 2v16H5V5a2 2 0 0 1 2-2Z" /></>,
  <><path d="M3 6h18v12H3Z" /><path d="m8 10 4 4 4-4M12 4v10" /></>,
  <><path d="M4 5v14M4 12h13" /><path d="m13 8 4 4-4 4M4 5h6" /></>,
  <><path d="M4 17c3-7 7-10 16-10" /><path d="m16 4 4 3-3 4" /><circle cx="5" cy="17" r="2" /></>,
  <><path d="M4 9 12 4l8 5v11H4Z" /><path d="M8 20v-6h8v6M8 10h8" /></>,
  <><path d="m4 7 8-4 8 4-8 4Z" /><path d="M4 7v10l8 4 8-4V7M12 11v10" /><path d="m8 15 2 2 5-5" /></>
];
export const truck = <><g className="truck-body"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" /><path className="truck-light" d="M18 12h2" /></g><circle className="truck-wheel" cx="7" cy="18" r="2" /><circle className="truck-wheel truck-wheel-rear" cx="18" cy="18" r="2" /></>;
export const icon = (content) => <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{content}</svg>;
export const orders = {
  "PED-2026-10482": {
    type: "Pedido estándar", category: "EMPA · EMPAQUE", destination: "Finca Santa Isabel", requested: "1.480 unidades", document: "RPT-2026-0881", source: "Aviso de corte · Semana 39", current: 4,
    stages: [
      ["23 sep · 07:12", "Planeación", "SIAL Web", "Se consolidaron las cantidades requeridas para iniciar la gestión del pedido.", "Aviso de corte · Semana 39"],
      ["23 sep · 08:05", "Supervisor de materiales", "SIAL Web", "El pedido fue creado con las líneas y cantidades aprobadas.", "Solicitud PED-2026-10482"],
      ["23 sep · 10:46", "Bodega principal", "Centro de distribución", "El pedido fue alistado y entregado al transportador.", "Lista de despacho LD-9021"],
      ["23 sep · 12:05", "Transportes del Caribe", "Centro de distribución", "El vehículo confirmó salida del centro de distribución.", "Orden OTI-546-001"],
      ["23 sep · 12:18", "Transportes del Caribe", "Ruta CD → Santa Isabel", "El vehículo TUL-458 se dirige a Finca Santa Isabel. Sin novedades reportadas.", "Orden OTI-546-001 · GPS activo"],
      ["Pendiente", "Almacén de finca", "Finca Santa Isabel", "El vehículo llegó a la finca y está pendiente la confirmación de descarga.", "Llegada y foto requeridas"],
      ["Pendiente", "Almacén de finca", "Finca Santa Isabel", "La entrega se completa al registrar cantidades, firma y evidencia final.", "POD pendiente"]
    ]
  },
  "PED-2026-10481": {
    type: "Pedido adicional", category: "Sin categoría", destination: "Finca El Retiro", requested: "520 unidades", document: "REM-2026-0184", source: "Solicitud adicional · Semana 39", current: 6,
    stages: [
      ["22 sep · 07:20", "Almacén de finca", "Finca El Retiro", "Necesidad adicional consolidada para gestión.", "Solicitud adicional · Semana 39"],
      ["22 sep · 08:18", "Supervisor de materiales", "SIAL Web", "Pedido adicional creado y aprobado.", "Solicitud PED-2026-10481"],
      ["22 sep · 10:04", "Bodega principal", "Centro de distribución", "Material completo y remisión generada.", "Remisión REM-2026-0184"],
      ["22 sep · 11:50", "Transportes del Caribe", "Centro de distribución", "Vehículo liberado para iniciar recorrido.", "Orden OTI-546-002"],
      ["22 sep · 12:30", "Transportes del Caribe", "Ruta CD → El Retiro", "Recorrido completado sin novedades.", "GPS finalizado"],
      ["22 sep · 14:08", "Laura Pineda", "Finca El Retiro", "Vehículo recibido y descarga verificada.", "Registro de llegada"],
      ["22 sep · 14:12", "Laura Pineda", "Finca El Retiro", "Pedido entregado con cantidades, firma y evidencia completas.", "Foto + firma · POD-682-014"]
    ]
  }
};

export function MaterialsOrderTrace() {
  const [input, setInput] = useState(() => new URLSearchParams(location.search).get("pedido") || "");
  const [id, setId] = useState("");
  const [error, setError] = useState("");
  const [current, setCurrent] = useState(0);
  const [inspected, setInspected] = useState(null);
  const order = orders[id];
  const submitted = id && !order ? readSubmittedRequest(id) : null;
  const stage = order?.stages[current];
  useEffect(() => {
    const requested = new URLSearchParams(location.search).get("pedido")?.trim().toUpperCase();
    if (!requested) return;
    if (!orders[requested] && !readSubmittedRequest(requested)) { setError(`No se encontró el pedido ${requested}. Verifica el número e inténtalo de nuevo.`); return; }
    setInput(requested); setId(requested); if (orders[requested]) setCurrent(orders[requested].current);
  }, []);
  function updateOrderQuery(orderId) {
    const params = new URLSearchParams(location.search);
    if (orderId) params.set("pedido", orderId);
    else params.delete("pedido");
    history.replaceState({}, "", `${location.pathname}${params.size ? `?${params}` : ""}`);
  }
  function consult(event) {
    event.preventDefault();
    const normalized = input.trim().toUpperCase();
    if (!normalized) { setId(""); setError(""); setInspected(null); updateOrderQuery(""); return; }
    if (!orders[normalized] && !readSubmittedRequest(normalized)) { setId(""); setError(`No se encontró el pedido ${normalized}. Verifica el número e inténtalo de nuevo.`); setInspected(null); updateOrderQuery(""); return; }
    setError(""); setId(normalized); if (orders[normalized]) setCurrent(orders[normalized].current); setInspected(null);
    updateOrderQuery(normalized);
  }
  const context = order && [["Tipo de pedido", order.type], ["Categoría", order.category], ["Destino", order.destination], ["Cantidad solicitada", order.requested], ["Documento logístico", order.document], ["Origen", order.source]];
  const lastUpdate = stage?.[0];
  const position = ((current + 0.5) / 7) * 100;
  return <>
    <p className="page-eyebrow">Materiales / Pedidos / Trazabilidad</p>
    <div className="page-header"><div><h1 className="page-title">Trazabilidad del pedido</h1><p className="page-subtitle">Consulta un pedido y sigue su recorrido completo, con el estado actual y lo que necesita para avanzar.</p></div></div>
    <article className="card trace-search-card"><div className="card-body">
      <form className="trace-search" onSubmit={consult} role="search"><div className="trace-search-field"><TextInput id="orderSearch" label="Número del pedido" placeholder="Ej. PED-2026-10482" value={input} onChange={setInput} /></div><Button type="submit">Consultar pedido</Button></form>
      {error && <p className="field-error" role="alert">{error}</p>}
      {order && <dl className="trace-order-data">{context.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
    </div></article>
    {!order ? submitted ? <article className="card"><div className="card-header"><div><p className="section-kicker">Pedido consultado</p><h2 className="card-title">{submitted.id} · {submitted.farm}</h2><p className="card-subtitle">{submitted.notice} · {submitted.week} · {submitted.recipes.length} {submitted.recipes.length === 1 ? "receta" : "recetas"}</p></div></div><div className="card-body"><Notice variant="info" heading="Aún no hay recorrido logístico">La solicitud fue enviada a Materiales. Su ruta aparecerá cuando se registren eventos de despacho y transporte.</Notice><a className="btn btn-secondary" href="seguimiento-pedidos-finca.html">Ver seguimiento de la solicitud</a></div></article> : <div className="trace-empty"><div className="trace-empty-route" aria-hidden="true"><span className="trace-empty-line" />{stageNames.map((name) => <i key={name} />)}</div><div className="trace-empty-copy"><span className="trace-empty-kicker">Ruta operativa</span><strong>El recorrido aparecerá después de consultar</strong><span>Ingresa el número del pedido para ver su estado actual y el avance por cada etapa.</span></div></div> :
      <section className="trace-result"><article className="card trace-overview">
        <div className="current-state" aria-labelledby="currentStateTitle"><div className="current-state-main">
          <div className={`state-orbit${current > 1 && current < 6 ? " is-driving" : ""}`} aria-hidden="true">{icon(current > 1 && current < 6 ? truck : stagePaths[current])}</div>
          <div className="state-copy"><div className="state-overline"><span className="state-kicker">Estado actual</span><span className="state-stage">Etapa <b>{current + 1}</b> de 7</span></div><div className="state-title-row"><h2 id="currentStateTitle">{stageNames[current]}</h2></div><p>{stage[3]}</p><div className="state-live"><span className="live-dot" />{current === 6 ? "Seguimiento finalizado" : "Seguimiento activo"} · última actualización {lastUpdate}</div></div>
        </div><div className="state-facts"><div><span>Responsable actual</span><strong>{stage[1]}</strong></div><div><span>Tiempo en esta etapa</span><strong>{current === 6 ? "Cerrado" : "1 h 24 min"}</strong></div><div><span>Siguiente condición</span><strong>{current === 6 ? "Pedido finalizado" : `Completar ${stageNames[current + 1].toLowerCase()}`}</strong></div></div></div>
        <section className="journey-card" aria-labelledby="journeyTitle"><div className="journey-heading"><div><span>Pedido <b>{id}</b></span><h2 id="journeyTitle">Ruta operativa</h2></div></div>
          <div className="journey-scroll"><ol className="journey" aria-label="Etapas del pedido" style={{ "--progress": `${position}%`, "--vehicle-progress": `${position}%`, "--vehicle-step": current }}>
            <li className={`journey-vehicle${current > 1 && current < 6 ? " is-driving" : ""}${current === 6 ? " is-delivered" : ""}`} aria-hidden="true">{icon(current > 1 && current < 6 ? truck : stagePaths[current])}</li>
            {order.stages.map((item, index) => {
              const start = index <= current ? item[0] : "Pendiente";
              const end = index > current ? "Pendiente" : index === current ? (current === 6 ? item[0] : "En curso") : order.stages[index + 1][0];
              return <li key={stageNames[index]}><button className={`journey-step ${index < current ? "is-complete" : index === current ? "is-current" : "is-pending"}${inspected === index ? " is-inspected" : ""}`} type="button" style={{ "--stage-index": index }} aria-current={index === current ? "step" : undefined} aria-label={`${stageNames[index]}. Inicio ${start}. Fin ${end}`} onClick={() => setInspected(inspected === index ? null : index)}><span className="journey-marker">{icon(stagePaths[index])}</span><span className="journey-label">{stageNames[index]}</span><span className="journey-time"><span><b>Inicio</b>{start}</span><span><b>Fin</b>{end}</span></span></button></li>;
            })}
          </ol></div>
          {inspected !== null && <div className="trace-inspected-detail"><h3>{stageNames[inspected]}</h3><p>{order.stages[inspected][3]}</p><dl className="trace-inspected-facts"><div><dt>Responsable</dt><dd>{order.stages[inspected][1]}</dd></div><div><dt>Ubicación</dt><dd>{order.stages[inspected][2]}</dd></div><div><dt>Evidencia</dt><dd>{order.stages[inspected][4]}</dd></div></dl></div>}
        </section>
      </article></section>}
  </>;
}
