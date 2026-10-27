import React, { useState } from "react";
import { Button, Card, Chip, KeyValueGrid, Notice, TextInput } from "@banasandev/banasan-ui";
import { readSubmittedRequest } from "./materials-order-state.js";
import { icon, orders, stageNames, stagePaths, truck } from "./materials-order-trace.jsx";

const queryOrder = () => new URLSearchParams(location.search).get("pedido")?.trim().toUpperCase() || "";
const knownOrder = (id) => Boolean(orders[id] || readSubmittedRequest(id));

export function MaterialsOrderTraceAlternative() {
  const [input, setInput] = useState(queryOrder);
  const [id, setId] = useState(() => knownOrder(queryOrder()) ? queryOrder() : "");
  const [error, setError] = useState(() => queryOrder() && !knownOrder(queryOrder())
    ? `No se encontró el pedido ${queryOrder()}. Verifica el número e inténtalo de nuevo.` : "");
  const [inspected, setInspected] = useState(null);
  const order = orders[id];
  const submitted = id && !order ? readSubmittedRequest(id) : null;
  const current = order?.current ?? 0;
  const inspectedIndex = inspected ?? current;
  const inspectedStage = order?.stages[inspectedIndex];
  const pendingInspection = inspectedIndex > current;

  function updateOrderQuery(orderId) {
    const params = new URLSearchParams(location.search);
    if (orderId) params.set("pedido", orderId);
    else params.delete("pedido");
    history.replaceState({}, "", `${location.pathname}${params.size ? `?${params}` : ""}`);
  }

  function consult(event) {
    event.preventDefault();
    const normalized = input.trim().toUpperCase();
    if (!normalized) {
      setId(""); setError(""); setInspected(null);
      updateOrderQuery("");
      return;
    }
    if (!knownOrder(normalized)) {
      setId(""); setInspected(null);
      setError(`No se encontró el pedido ${normalized}. Verifica el número e inténtalo de nuevo.`);
      document.getElementById("orderSearch")?.focus();
      updateOrderQuery("");
      return;
    }
    setInput(normalized); setId(normalized); setError(""); setInspected(null);
    updateOrderQuery(normalized);
  }

  const orderFacts = order ? [
    { label: "Tipo de pedido", value: order.type },
    { label: "Categoría", value: order.category },
    { label: "Destino", value: order.destination },
    { label: "Cantidad solicitada", value: order.requested },
    { label: "Documento logístico", value: order.document },
    { label: "Origen", value: order.source },
  ] : [];
  const currentStage = order?.stages[current];
  const stateFacts = order ? [
    { label: "Última actualización", value: currentStage[0] },
    { label: "Responsable", value: currentStage[1] },
    { label: "Siguiente condición", value: current === 6 ? "Pedido finalizado" : `Completar ${stageNames[current + 1].toLowerCase()}` },
  ] : [];
  const inspectedStart = inspectedIndex <= current ? inspectedStage?.[0] : "Pendiente";
  const inspectedEnd = inspectedIndex > current ? "Pendiente"
    : inspectedIndex === current ? current === 6 ? inspectedStage[0] : "En curso"
      : order?.stages[inspectedIndex + 1][0];
  const inspectedFacts = inspectedStage ? [
    { label: "Inicio", value: inspectedStart },
    { label: "Fin", value: inspectedEnd },
    { label: pendingInspection ? "Responsable previsto" : "Responsable", value: inspectedStage[1] },
    { label: pendingInspection ? "Ubicación prevista" : "Ubicación", value: inspectedStage[2] },
  ] : [];

  return <>
    <p className="page-eyebrow">Materiales / Pedidos / Trazabilidad</p>
    <div className="page-header"><div>
      <h1 className="page-title">Trazabilidad del pedido</h1>
      <p className="page-subtitle">Consulta el estado actual y los siete hitos de un pedido.</p>
    </div></div>

    <Card className="trace-v2-search">
      <div className="trace-v2-section-heading"><h2>Consultar pedido</h2><p>Busca por número y revisa el estado registrado.</p></div>
      <form className="trace-search" onSubmit={consult} role="search">
        <div className="trace-search-field"><TextInput id="orderSearch" label="Número del pedido" placeholder="Ej. PED-2026-10482" value={input} onChange={(value) => { setInput(value); setError(""); }} /></div>
        <Button type="submit">Consultar pedido</Button>
      </form>
      {error && <p className="field-error trace-v2-error" role="alert">{error}</p>}
    </Card>

    {order ? <div className="trace-v2-result">
      <Card className="trace-v2-order">
        <div className="trace-v2-section-heading"><h2>Datos del pedido</h2><p>{id}</p></div>
        <KeyValueGrid columns={3} items={orderFacts} />
      </Card>

      <Card className="trace-v2-state">
        <div className="trace-v2-state-head">
          <span className="trace-v2-state-icon" aria-hidden="true">{icon(current > 1 && current < 6 ? truck : stagePaths[current])}</span>
          <div className="trace-v2-state-copy">
            <span className="trace-v2-kicker">Estado actual</span>
            <h2>{stageNames[current]}</h2>
            <p>{currentStage[3]}</p>
          </div>
          <Chip preset="info">Etapa {current + 1} de 7</Chip>
        </div>
        <KeyValueGrid columns={3} items={stateFacts} />
      </Card>

      <div className="trace-v2-body">
        <Card className="trace-v2-route">
          <div className="trace-v2-section-heading"><h2>Recorrido de siete etapas</h2><p>Selecciona una etapa para ver su evidencia.</p></div>
          <ol className="trace-v2-steps" aria-label="Etapas del pedido">
            {order.stages.map((item, index) => {
              const start = index <= current ? item[0] : "Pendiente";
              const end = index > current ? "Pendiente" : index === current ? current === 6 ? item[0] : "En curso" : order.stages[index + 1][0];
              const state = index < current ? "complete" : index === current ? "current" : "pending";
              return <li key={stageNames[index]} className={`trace-v2-step is-${state}${inspectedIndex === index ? " is-selected" : ""}`}>
                <button type="button" aria-current={index === current ? "step" : undefined} aria-pressed={inspectedIndex === index} onClick={() => setInspected(index)}>
                  <span className="trace-v2-node" aria-hidden="true" />
                  <span className="trace-v2-step-copy"><strong>{stageNames[index]}</strong><span>Inicio {start}</span><span>Fin {end}</span></span>
                </button>
              </li>;
            })}
          </ol>
        </Card>
        <Card className="trace-v2-inspected" aria-live="polite">
          <span className="trace-v2-kicker">Etapa {inspectedIndex + 1} de 7</span>
          <h2>{stageNames[inspectedIndex]}</h2>
          <p>{inspectedStage[3]}</p>
          <KeyValueGrid columns={2} items={inspectedFacts} />
          <div className="trace-v2-evidence"><span>{pendingInspection ? "Evidencia esperada" : "Evidencia"}</span><strong>{inspectedStage[4]}</strong></div>
        </Card>
      </div>
    </div> : submitted ? <Card className="trace-v2-unavailable">
      <div className="trace-v2-section-heading"><h2>{submitted.id} · {submitted.farm}</h2><p>{submitted.notice} · {submitted.week} · {submitted.recipes.length} {submitted.recipes.length === 1 ? "receta" : "recetas"}</p></div>
      <Notice variant="info" heading="Aún no hay recorrido logístico">La solicitud fue enviada a Materiales. Su ruta aparecerá cuando se registren eventos de despacho y transporte.</Notice>
      <a className="btn btn-secondary" href="seguimiento-pedidos-finca.html">Ver seguimiento de la solicitud</a>
    </Card> : <Card className="trace-v2-empty">
      <span className="trace-v2-kicker">Ruta operativa</span>
      <h2>El recorrido aparecerá después de consultar</h2>
      <p>Ingresa el número del pedido para ver su estado actual y el avance por cada etapa.</p>
      <div className="trace-v2-empty-steps" aria-hidden="true">{stageNames.map((name) => <span key={name} />)}</div>
    </Card>}
  </>;
}
