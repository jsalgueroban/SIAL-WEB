import React, { useMemo, useState } from "react";
import { TableFilterReset } from "./table-filter-reset.jsx";
import { Button, Card, Chip, IconButton, KeyValueGrid, NumberInput, Pagination, SelectInput, Table, TableRowActions, TextInput, Toast, ViewIcon } from "@banasandev/banasan-ui";

const base = { id: "PED-SUG-2026-32-014", notice: "AC-2026-032", farm: "La Ceiba", farmCode: "FIN-014", reference: "AGSTDRA", week: "SEM-2026-32", status: "Validado", category: "EMPA" };
const materials = [
  { code: "MAT-CAR-001", name: "Caja de cartón corrugado", unit: "unidades", base: 790, stock: 1280 },
  { code: "MAT-TAP-001", name: "Tapa de cartón", unit: "unidades", base: 925, stock: 900 },
  { code: "MAT-ETQ-001", name: "Etiqueta de trazabilidad", unit: "rollos", base: 25, stock: 12 },
  { code: "MAT-EST-001", name: "Estiba de exportación", unit: "unidades", base: 28, stock: 12 }
];
const seed = [
  { id: "PAD-2026-32-002", base: base.id, notice: base.notice, farm: base.farm, week: base.week, sequence: 2, lines: 2, quantity: "160 unidades", reason: "Incremento extraordinario del corte", status: "Pendiente de validación", updated: "Hoy, 10:42", document: "Pendiente de clasificación" },
  { id: "PAD-2026-32-001", base: base.id, notice: base.notice, farm: base.farm, week: base.week, sequence: 1, lines: 1, quantity: "80 unidades", reason: "Diferencia de inventario", status: "Aprobado", updated: "Ayer, 16:10", document: "Remisión pendiente" },
  { id: "PAD-2026-31-004", base: "PED-SUG-2026-31-009", notice: "AC-2026-031", farm: "Vijagual", week: "SEM-2026-31", sequence: 4, lines: 2, quantity: "240 unidades", reason: "Entrega incompleta del proveedor", status: "En preparación", updated: "01/08/2026, 11:25", document: "REM-2026-0192" },
  { id: "PAD-2026-31-003", base: "PED-SUG-2026-31-006", notice: "AC-2026-031", farm: "Marte", week: "SEM-2026-31", sequence: 3, lines: 1, quantity: "40 unidades", reason: "Cambio operativo", status: "Entregado", updated: "31/07/2026, 17:40", document: "RPT-2026-0894" }
];
const saveKey = `sial-hu666-additional:${base.id}`;
const draftKey = `sial-hu666-draft:${base.id}`;
const reasons = [
  { value: "incremento-corte", label: "Incremento extraordinario del corte" },
  { value: "inventario", label: "Diferencia de inventario" },
  { value: "entrega-incompleta", label: "Entrega incompleta del proveedor" },
  { value: "dano", label: "Material dañado o no utilizable" },
  { value: "otro", label: "Otra necesidad operativa" }
];
const fmt = (value) => new Intl.NumberFormat("es-CO").format(value);
const displayCreatedAt = (item) => item.createdAt
  ? new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Bogota" }).format(new Date(item.createdAt))
  : item.updated;
const empty = () => ({ category: "", lines: [{ material: materials[0].code, quantity: "" }], reason: "", observation: "" });
function readJson(key, fallback) { try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch { return fallback; } }
function readSaved() { const value = readJson(saveKey, []); return Array.isArray(value) ? value : value ? [value] : []; }
function statusPreset(value) { return /Entregado|Aprobado/.test(value) ? "active" : /Rechaz/.test(value) ? "inactive" : "warning"; }
function Status({ value }) { return <Chip preset={statusPreset(value)}>{value}</Chip>; }
function Header({ title, subtitle, eyebrow = "Materiales / Pedidos adicionales", action }) { return <><p className="page-eyebrow">{eyebrow}</p><div className="page-header additional-page-header"><div><h1 className="page-title">{title}</h1><p className="page-subtitle">{subtitle}</p></div>{action}</div></>; }
function lineResult(line) {
  const material = materials.find((item) => item.code === line.material);
  const quantity = Number(line.quantity);
  if (!material || String(line.quantity).trim() === "" || !Number.isInteger(quantity) || quantity <= 0) return { type: "blocked", title: "Cantidad requerida", text: "Ingresa un entero mayor que cero." };
  if (quantity > material.stock) return { type: "warning", title: "Stock insuficiente", text: `Faltan ${fmt(quantity - material.stock)} ${material.unit}; requiere validación de abastecimiento.` };
  return { type: "ok", title: "Stock disponible", text: `Quedarían ${fmt(material.stock - quantity)} ${material.unit} visibles.` };
}
function Result({ result }) { return <div className="additional-line-result"><Chip preset={result.type === "ok" ? "active" : result.type === "warning" ? "warning" : "inactive"}>{result.title}</Chip><small>{result.text}</small></div>; }
function OriginTrail({ item }) {
  return <ol className="additional-origin-trail" aria-label="Procedencia del pedido adicional">
    <li><span>Aviso de corte</span><strong>{item.notice}</strong></li>
    <li><span>Pedido base</span><strong>{item.base}</strong></li>
    <li aria-current="step"><span>Pedido adicional</span><strong>{item.id}</strong></li>
  </ol>;
}
function DetailReworked({ item }) {
  const lines = item.detailLines || [];
  const steps = ["Registrado", "Pendiente de validación", "Aprobado", "En preparación", "Entregado"];
  const current = Math.max(1, steps.indexOf(item.status));
  const progress = steps.map((title, index) => ({
    key: title, title,
    status: index < current ? "completed" : index === current ? "active" : "pending",
    description: index === current ? (
      index === 0 ? "Solicitud vinculada al pedido base." :
      index === 1 ? "Revisión de cantidades, stock y motivo." :
      index === 2 ? "Decisión registrada por el responsable autorizado." :
      index === 3 ? "Clasificación documental y preparación logística." :
      "Entrega y soportes disponibles."
    ) : undefined
  }));
  const facts = [
    { label: "Motivo", value: item.reason },
    { label: "Categoría", value: item.category || base.category },
    { label: "Registrado", value: displayCreatedAt(item) },
    { label: "Finca", value: item.farm },
    { label: "Semana", value: item.week },
    { label: "Documento", value: item.document }
  ];
  const quantityText = (line) => fmt(Number(line.quantity)) + " " + line.unit;
  const stockText = (line) => fmt(Number(line.stock)) + " " + line.unit;
  return <div className="additional-dossier-page">
    <Header title={item.id} subtitle="Consulta la solicitud, su procedencia y estado." eyebrow="Materiales / Pedidos adicionales / Detalle" action={<div className="card-actions"><Status value={item.status} /><a className="btn btn-secondary" href="pedidos-adicionales.html">Volver a pedidos adicionales</a></div>} />
    <Card className="additional-dossier">
      <div className="additional-dossier-content">
        <section className="additional-dossier-materials" aria-labelledby="additional-detail-materials">
          <header className="additional-dossier-section-head"><h2 id="additional-detail-materials">Materiales solicitados</h2><p>Cantidades y disponibilidad consultada al registrar el pedido.</p></header>
          {lines.length ? <>
            <div className="additional-dossier-table"><Table columns={[
              { key: "name", header: "Material", render: (line) => <div className="materials-record-main"><strong>{line.name}</strong><span>{line.code}</span></div> },
              { key: "quantity", header: "Cantidad adicional", render: quantityText },
              { key: "stock", header: "Stock consultado", render: stockText },
              { key: "result", header: "Resultado inicial", render: (line) => <Result result={lineResult({ material: line.code, quantity: line.quantity })} /> }
            ]} data={lines} rowKey={(line) => line.code} minWidth="680px" /></div>
            <div className="additional-dossier-mobile-materials">{lines.map((line) => <article className="additional-dossier-material" key={line.code}>
              <div className="materials-record-main"><strong>{line.name}</strong><span>{line.code}</span></div>
              <dl><div><dt>Cantidad adicional</dt><dd>{quantityText(line)}</dd></div><div><dt>Stock consultado</dt><dd>{stockText(line)}</dd></div></dl>
              <Result result={lineResult({ material: line.code, quantity: line.quantity })} />
            </article>)}</div>
          </> : <div className="additional-dossier-summary"><p>El desglose de materiales no está disponible para esta solicitud.</p><KeyValueGrid columns={2} items={[{ label: "Materiales", value: String(item.lines) }, { label: "Cantidad registrada", value: item.quantity }]} /></div>}
        </section>
        <aside className="additional-dossier-context" aria-labelledby="additional-detail-context">
          <header className="additional-dossier-section-head"><h2 id="additional-detail-context">Datos de la solicitud</h2><p>Contexto necesario para revisar este adicional.</p></header>
          <KeyValueGrid columns={2} items={facts} />
          <div className="additional-dossier-origin"><h3>Procedencia</h3><OriginTrail item={item} /></div>
        </aside>
        <section className="additional-dossier-progress" aria-labelledby="additional-detail-progress">
        <header className="additional-dossier-section-head"><h2 id="additional-detail-progress">Avance del pedido</h2><p>Etapa registrada para esta solicitud.</p></header>
        <ol className="additional-process">{progress.map((step) => <li className={"is-" + step.status} key={step.key} aria-current={step.status === "active" ? "step" : undefined}><span className="additional-process-node" aria-hidden="true" /><strong>{step.title}</strong>{step.description && <p>{step.description}</p>}</li>)}</ol>
        </section>
      </div>
    </Card>
  </div>;
}
function AdditionalUnavailable({ title, description, href, action }) {
  return <Card className="additional-state-card"><h2>{title}</h2><p>{description}</p><a className="btn btn-secondary" href={href}>{action}</a></Card>;
}

export function MaterialsAdditionalOrders() {
  const params = new URLSearchParams(location.search);
  const mode = params.get("access") === "denied" ? "denied" : params.get("pedido") ? "detail" : params.get("nuevo") === "1" ? "create" : "list";
  const [saved, setSaved] = useState(readSaved);
  const [model, setModel] = useState(() => ({ ...empty(), ...readJson(draftKey, {}) }));
  const [search, setSearch] = useState(""); const [state, setState] = useState(""); const [page, setPage] = useState(1); const [size, setSize] = useState(10); const [touched, setTouched] = useState(false); const [feedback, setFeedback] = useState(null);
  const orders = useMemo(() => { const ids = new Set(saved.map((item) => item.id)); return [...saved, ...seed.filter((item) => !ids.has(item.id))]; }, [saved]);
  const filtered = orders.filter((item) => (!search || [item.id, item.base, item.notice, item.farm, item.reason].join(" ").toLocaleLowerCase("es").includes(search.toLocaleLowerCase("es"))) && (!state || item.status === state));
  const current = Math.min(page, Math.max(1, Math.ceil(filtered.length / size)));
  const nextSequence = () => Math.max(0, ...orders.filter((item) => item.base === base.id && item.week === base.week).map((item) => Number(item.sequence) || 0)) + 1;
  const results = model.lines.map(lineResult); const blocked = results.filter((item) => item.type === "blocked").length; const shortages = results.filter((item) => item.type === "warning").length; const valid = !blocked && Boolean(model.category) && Boolean(model.reason);
  const update = (field, value) => setModel((previous) => ({ ...previous, [field]: value }));
  const updateLine = (index, values) => setModel((previous) => ({ ...previous, lines: previous.lines.map((line, currentIndex) => currentIndex === index ? { ...line, ...values } : line) }));
  function saveDraft() { localStorage.setItem(draftKey, JSON.stringify(model)); setFeedback({ title: "Borrador guardado", description: "El borrador quedó guardado en este dispositivo.", variant: "success" }); }
  function submit(event) {
    event.preventDefault(); setTouched(true); if (!valid) return;
    const idempotencyKey = `${base.id}|${base.farmCode}|${model.reason}|${model.lines.map((line) => `${line.material}:${Number(line.quantity)}`).sort().join(",")}`;
    const existing = saved.find((item) => item.idempotencyKey === idempotencyKey);
    if (existing) { setFeedback({ title: "Solicitud existente", description: `El pedido ${existing.id} ya fue registrado. No se creó un duplicado.`, variant: "info" }); return; }
    const sequence = nextSequence(); const now = new Date();
    const item = { id: `PAD-2026-32-${String(sequence).padStart(3, "0")}`, base: base.id, notice: base.notice, farm: base.farm, farmCode: base.farmCode, week: base.week, reference: base.reference, sequence, lines: model.lines.length, quantity: model.lines.map((line) => { const material = materials.find((entry) => entry.code === line.material); return `${fmt(Number(line.quantity))} ${material?.unit || ""}`; }).join(" · "), reason: reasons.find((reason) => reason.value === model.reason)?.label || model.reason, reasonCode: model.reason, observation: model.observation, category: model.category, status: "Pendiente de validación", updated: "Ahora", createdAt: now.toISOString(), actor: "QA Materiales · Web", document: "Pendiente de clasificación", shortages, idempotencyKey, detailLines: model.lines.map((line) => ({ ...line, ...materials.find((material) => material.code === line.material) })) };
    const next = [...saved, item]; localStorage.setItem(saveKey, JSON.stringify(next)); localStorage.removeItem(draftKey); setSaved(next); location.href = `pedidos-adicionales.html?pedido=${encodeURIComponent(item.id)}`;
  }
  if (mode === "denied") return <><Header title="Pedidos adicionales" subtitle="Consulta restringida al alcance de tu usuario." /><AdditionalUnavailable title="Información no disponible" description="No existen pedidos visibles dentro de tu compañía y fincas autorizadas." href="gestion-pedidos-materiales.html" action="Volver a Pedidos" /></>;
  if (mode === "detail") { const item = orders.find((order) => order.id === params.get("pedido")); return item ? <DetailReworked item={item} /> : <><Header title="Consultar pedido adicional" subtitle="La solicitud debe estar dentro de tu alcance." eyebrow="Materiales / Pedidos adicionales / Detalle" /><AdditionalUnavailable title="Pedido no disponible" description="No existe información para mostrar dentro de tu compañía y fincas autorizadas." href="pedidos-adicionales.html" action="Volver a pedidos adicionales" /></>; }
  if (mode === "list") return <><Header title="Pedidos adicionales" subtitle="Consulta solicitudes excepcionales sin perder su relación con el pedido semanal." /><article className="card additional-list-card"><div className="card-header"><div><h2 className="card-title">Gestión de solicitudes</h2><p className="card-subtitle">Cada adicional conserva el pedido base, su motivo y el estado del procesamiento.</p></div><div className="card-actions"><Chip preset="info">{filtered.length} {filtered.length === 1 ? "registro" : "registros"}</Chip><a className="btn btn-primary" href={`pedidos-adicionales.html?nuevo=1&base=${encodeURIComponent(base.id)}`}>Nuevo pedido adicional</a></div></div><div className="card-body"><div className="toolbar additional-list-toolbar"><TextInput id="additionalSearch" label="Buscar pedidos adicionales" placeholder="Buscar pedido, finca, aviso o motivo" value={search} onChange={(value) => { setSearch(value); setPage(1); }} /><SelectInput id="additionalStatus" label="Estado" value={state} options={[{ value: "", label: "Todos los estados" }, ...Array.from(new Set(orders.map((item) => item.status))).map((value) => ({ value, label: value }))]} onChange={(value) => { setState(value); setPage(1); }} /><TableFilterReset active={Boolean(search.trim()) || Boolean(state)} onReset={() => { setSearch(""); setState(""); setPage(1); }} /></div></div><Table columns={[{ key: "id", header: "Pedido adicional", render: (item) => <div className="materials-record-main"><strong>{item.id}</strong><span>Adicional {item.sequence} de {item.week}</span></div> }, { key: "base", header: "Pedido base", render: (item) => <div className="materials-record-main"><strong>{item.base}</strong><span>{item.notice} · {item.farm}</span></div> }, { key: "quantity", header: "Solicitud", render: (item) => <><strong>{item.lines} {item.lines === 1 ? "material" : "materiales"}</strong><span className="muted block">{item.quantity}</span></> }, { key: "reason", header: "Motivo", render: (item) => item.reason }, { key: "status", header: "Estado", render: (item) => <Status value={item.status} /> }, { key: "updated", header: "Última actualización", render: (item) => item.updated }]} data={filtered.slice((current - 1) * size, current * size)} rowKey={(item) => item.id} minWidth="950px" emptyState="No hay pedidos para los filtros seleccionados." actionsHeader="Acciones" actions={(item) => <TableRowActions label={`Acciones de ${item.id}`}><a className="icon-btn" href={`pedidos-adicionales.html?pedido=${encodeURIComponent(item.id)}`} aria-label={`Consultar ${item.id}`} title="Consultar pedido"><ViewIcon /></a></TableRowActions>} /><Pagination page={current} pageSize={size} total={filtered.length} pageSizeOptions={[10, 30, 50]} onPageChange={setPage} onPageSizeChange={(value) => { setSize(value); setPage(1); }} /></article></>;
  if (params.get("base") && params.get("base") !== base.id) return <><Header title="Nuevo pedido adicional" subtitle="La solicitud debe partir de un pedido válido." eyebrow="Materiales / Pedidos adicionales / Registro" /><AdditionalUnavailable title="Pedido base no disponible" description="No existe información para mostrar dentro de tu alcance autorizado." href="pedidos-adicionales.html" action="Volver a pedidos adicionales" /></>;
  let categoryOptions = [{ value: "EMPA", label: "EMPA · EMPAQUE" }, { value: "ETIQ", label: "ETIQ · ETIQUETA" }, { value: "OPER", label: "OPER · OPERATIVO" }];
  try { const active = new Set(readJson("sial-order-categories", []).filter((item) => item.status === "ACTIVO").map((item) => item.code)); if (active.size) categoryOptions = categoryOptions.filter((item) => active.has(item.value)); } catch { /* Conserva categorías iniciales. */ }
  const used = new Set(model.lines.map((line) => line.material)); const next = materials.find((item) => !used.has(item.code));
  return <><Header title="Nuevo pedido adicional" subtitle="Registra solo la necesidad que no quedó cubierta por el pedido semanal." eyebrow="Materiales / Pedidos adicionales / Registro" action={<a className="btn btn-secondary" href="pedidos-adicionales.html">Volver a pedidos adicionales</a>} /><form className="card additional-form" onSubmit={submit} noValidate><section className="additional-source-context" aria-labelledby="additional-source-title"><header className="additional-source-header"><div><span className="additional-section-kicker">Pedido base</span><h2 id="additional-source-title" className="card-title">{base.id}</h2><p className="card-subtitle">Esta solicitud conserva el origen del pedido semanal para su validación.</p></div><Status value={base.status} /></header><dl className="additional-source-details"><div><dt>Aviso de corte</dt><dd>{base.notice}</dd></div><div><dt>Finca</dt><dd>{base.farm}</dd></div><div><dt>Referencia</dt><dd>{base.reference}</dd></div><div><dt>Semana</dt><dd>{base.week}</dd></div></dl></section><section className="additional-form-section additional-materials-section" aria-labelledby="additional-materials-title"><header className="additional-section-header"><div><h2 id="additional-materials-title" className="card-title">Materiales solicitados</h2><p className="card-subtitle">Indica únicamente los materiales y cantidades que no cubrió el pedido base.</p></div><Button variant="outlined" type="button" disabled={!next} onClick={() => next && update("lines", [...model.lines, { material: next.code, quantity: "" }])}>Agregar material</Button></header><div className="additional-material-lines">{model.lines.map((line, index) => { const material = materials.find((item) => item.code === line.material) || materials[0]; return <article className="additional-material-line" key={`${index}-${line.material}`}><div className="additional-material-line-main"><div className="field additional-material-field"><SelectInput id={`lineMaterial${index}`} label="Material" value={line.material} options={materials.map((option) => ({ value: option.code, label: option.name, disabled: model.lines.some((other, otherIndex) => otherIndex !== index && other.material === option.code) }))} onChange={(value) => { if (!model.lines.some((other, otherIndex) => otherIndex !== index && other.material === value)) updateLine(index, { material: value }); }} /><small>{material.code} · {material.unit}</small><dl className="additional-material-facts"><div><dt>Pedido base</dt><dd>{fmt(material.base)} {material.unit}</dd></div><div><dt>Stock visible</dt><dd>{fmt(material.stock)} {material.unit}</dd></div></dl></div><div className="field additional-quantity-field"><NumberInput id={`lineQuantity${index}`} label={`Cantidad adicional de ${material.name}`} min={1} step={1} value={line.quantity} onChange={(value) => updateLine(index, { quantity: value })} /><Result result={results[index]} /></div><IconButton variant="ghost" aria-label={`Quitar ${material.name}`} title="Quitar material" disabled={model.lines.length === 1} onClick={() => update("lines", model.lines.filter((_, otherIndex) => otherIndex !== index))}><svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v6m4-6v6"/></svg></IconButton></div></article>; })}</div></section><section className="additional-form-section additional-reason-section" aria-labelledby="additional-reason-title"><header className="additional-section-header"><div><h2 id="additional-reason-title" className="card-title">Motivo y detalle</h2><p className="card-subtitle">Explica por qué esta necesidad no quedó cubierta por el pedido base.</p></div></header><div className="additional-reason-fields"><SelectInput id="additionalCategory" label="Categoría del pedido" required value={model.category} options={[{ value: "", label: "Seleccionar categoría" }, ...categoryOptions]} onChange={(value) => update("category", value)} /><SelectInput id="additionalReason" label="Motivo de la solicitud" required value={model.reason} options={[{ value: "", label: "Seleccionar motivo" }, ...reasons]} onChange={(value) => update("reason", value)} /><div className="field"><label className="label" htmlFor="additionalObservation">Detalle <span className="additional-optional">Opcional</span></label><textarea className="input additional-textarea" id="additionalObservation" rows="3" placeholder="Agrega información útil para la validación." value={model.observation} onChange={(event) => update("observation", event.target.value)} /></div></div>{touched && !model.category && <span className="field-error" role="alert">Selecciona una categoría activa.</span>}{touched && !model.reason && <span className="field-error" role="alert">Selecciona el motivo de la solicitud.</span>}</section><footer className="form-actions additional-submit-bar"><div className={`additional-form-summary ${blocked ? "is-error" : valid ? shortages ? "is-warning" : "is-success" : "is-warning"}`} aria-live="polite"><strong>{blocked ? "Completa las cantidades" : !model.category ? "Falta la categoría" : !model.reason ? "Falta el motivo" : shortages ? `${shortages} ${shortages === 1 ? "material supera" : "materiales superan"} el stock visible` : "Solicitud lista"}</strong></div><div className="additional-submit-actions"><Button type="button" variant="outlined" onClick={saveDraft}>Guardar borrador</Button><Button type="submit" disabled={!valid}>Enviar a validación</Button></div></footer></form>{feedback && <Toast visible variant={feedback.variant} title={feedback.title} description={feedback.description} onClose={() => setFeedback(null)} />}</>;
}
