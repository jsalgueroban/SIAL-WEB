import React, { useEffect, useMemo, useRef, useState } from "react";
import { TableFilterReset } from "./table-filter-reset.jsx";
import { Button, Chip, DateInput, Drawer, IconButton, NumberInput, Pagination, SelectInput, Table, TableRowActions, TextInput, Toast, ViewIcon } from "@banasandev/banasan-ui";
import { readSubmittedRequests } from "./materials-order-state.js";

const source = "@banasandev/banasan-ui";
const trackingSeed = [{ id: "PED-2026-10482", farm: "Finca Santa Isabel", status: "En revisión por Materiales", updated: "Hoy · 10:35", source: "Aviso de corte AC-2026-032", recipes: [
  { id: "REC-AGSTDRA-V3", reference: "AGSTDRA", version: "V3", boxes: 1200, pallets: 23, materials: [{ code: "101279", name: "Caja cartón corrugado", unit: "UN", suggested: 1345, requested: 1480, status: "Entrega parcial", approved: 1280, justification: "Aumento de producción confirmado después del cálculo." }, { code: "4925", name: "Zuncho amarillo", unit: "M", suggested: 400, requested: 400, status: "Aprobado", approved: 400, justification: "" }] },
  { id: "REC-20LD7RA-20-V2", reference: "20LD7RA-20", version: "V2", boxes: 804, pallets: 15, materials: [{ code: "101279", name: "Caja cartón corrugado", unit: "UN", suggested: 224, requested: 246, status: "Pendiente de revisión", approved: 0, justification: "Cobertura adicional dentro del margen parametrizado." }] }
] }];
function submittedTrackingOrders() {
  let approvals = [];
  try { const stored = JSON.parse(localStorage.getItem("sial-order-approvals") || "[]"); if (Array.isArray(stored)) approvals = stored; } catch { /* Conserva las solicitudes enviadas. */ }
  return readSubmittedRequests().map((request) => {
    const approval = approvals.find((item) => item.id === request.id);
    return {
      id: request.id, farm: request.farm || "Finca no registrada", status: approval?.status || "En revisión por Materiales", updated: approval?.audit?.at(-1)?.split(" — ")[0] || "Solicitud enviada", source: request.notice ? `Aviso de corte ${request.notice}` : "Pedido sugerido",
      recipes: request.recipes.map((recipe) => ({ ...recipe, materials: recipe.rows.map((row) => {
        const decision = approval?.lines?.find((line) => line.recipeId === recipe.id && line.code === row.code);
        return { ...row, requested: Number(row.requested), status: decision?.decision || "Pendiente de revisión", approved: decision?.approved || 0, justification: row.justification || "" };
      }) }))
    };
  });
}
const recurringSeed = [{ id: "PRC-2026-001", farm: "Finca El Retiro", category: "OPER", required: "2026-09-29", reason: "Reposición mensual de implementos de aseo.", status: "Pendiente de aprobación", created: "25 sep · 08:30", lines: [{ name: "Detergente industrial", quantity: 24, unit: "UN" }, { name: "Palas", quantity: 4, unit: "UN" }] }];
const farms = ["Finca Santa Isabel", "Finca El Retiro", "Finca Las Palmas"];
const fmt = (value) => new Intl.NumberFormat("es-CO").format(value);
function Status({ value }) { return <Chip preset={/Aprobado/.test(value) ? "active" : /Rechazado|Cancelado/.test(value) ? "inactive" : "warning"}>{value}</Chip>; }
function Header({ eyebrow, title, subtitle }) { return <><p className="page-eyebrow">{eyebrow}</p><div className="page-header"><div><h1 className="page-title">{title}</h1><p className="page-subtitle">{subtitle}</p></div></div></>; }
function readStored(key, fallback) { try { const value = JSON.parse(localStorage.getItem(key) || "null"); return Array.isArray(value) ? value : fallback; } catch { return fallback; } }
function MaterialDetail({ order }) { return <article className="card tracking-detail"><div className="card-header"><div><p className="section-kicker">{order.source}</p><h2 className="card-title">{order.id} · {order.farm}</h2><p className="card-subtitle">Última actualización: {order.updated}</p></div><Status value={order.status} /></div><div className="recipe-order-groups">{order.recipes.map((recipe) => <section className="recipe-order-group" key={recipe.id}><div className="recipe-order-header"><div><p className="section-kicker">{recipe.id}</p><h3>{recipe.reference} · {recipe.version}</h3></div><dl><div><dt>Cajas</dt><dd>{fmt(recipe.boxes)}</dd></div><div><dt>Pallets</dt><dd>{fmt(recipe.pallets)}</dd></div></dl></div><div className="order-material-head order-material-head--tracking" aria-hidden="true"><span>Material</span><span>Solicitud</span><span>Respuesta de Materiales</span></div><div className="order-material-list">{recipe.materials.map((item) => <article className="order-material-item" key={`${recipe.id}-${item.code}`}><div className="order-material-row order-material-row--tracking"><div className="materials-record-main"><strong>{item.name}</strong><span>{item.code} · {item.unit}</span></div><div className="order-material-comparison"><span className="order-material-label">Solicitud</span><small>Sugerido: {fmt(item.suggested)} {item.unit}</small><strong>{fmt(item.requested)} {item.unit}</strong></div><div className="order-material-response"><span className="order-material-label">Respuesta de Materiales</span><strong>{item.approved ? `${fmt(item.approved)} ${item.unit}` : "Cantidad pendiente"}</strong><Status value={item.status} /></div></div>{item.justification && <div className="order-material-note"><span>Justificación de la solicitud</span><p>{item.justification}</p></div>}</article>)}</div></section>)}</div></article>; }
export function MaterialsOrderTracking() {
  const [search, setSearch] = useState(""); const [status, setStatus] = useState("all"); const [page, setPage] = useState(1); const [size, setSize] = useState(10); const [selected, setSelected] = useState(null);
  const orders = useMemo(() => { const submitted = submittedTrackingOrders(); return [...submitted, ...trackingSeed.filter((seed) => !submitted.some((item) => item.id === seed.id))]; }, []);
  const filtered = useMemo(() => orders.filter((item) => `${item.id} ${item.farm}`.toLocaleLowerCase("es").includes(search.toLocaleLowerCase("es")) && (status === "all" || item.status === status)), [orders, search, status]);
  const current = Math.min(page, Math.max(1, Math.ceil(filtered.length / size)));
  const statusOptions = [{ value: "all", label: "Todos los estados" }, ...Array.from(new Set(orders.map((item) => item.status))).map((value) => ({ value, label: value }))];
  return <><Header eyebrow="Materiales / Seguimiento de finca" title="Seguimiento de pedidos" subtitle="Consulta el avance y las decisiones de Materiales sin modificar la aprobación." /><article className="card workflow-table-card standard-master-card"><div className="card-header"><div><h2 className="card-title">Pedidos enviados</h2><p className="card-subtitle">Selecciona un pedido para consultar sus recetas y materiales.</p></div><div className="card-actions"><Chip preset="info">{filtered.length} {filtered.length === 1 ? "registro" : "registros"}</Chip></div></div><div className="card-body"><div className="toolbar materials-toolbar"><div data-sial-component="TextInput" data-sial-source={source}><TextInput id="trackingSearch" label="Buscar pedidos enviados" placeholder="Buscar pedido o finca" value={search} onChange={(value) => { setSearch(value); setPage(1); }} /></div><div data-sial-component="SelectInput" data-sial-source={source}><SelectInput id="trackingStatus" label="Estado" value={status} options={statusOptions} onChange={(value) => { setStatus(value); setPage(1); }} /></div><TableFilterReset active={Boolean(search.trim()) || status !== "all"} onReset={() => { setSearch(""); setStatus("all"); setPage(1); }} /></div></div><Table columns={[{ key: "id", header: "Pedido", render: (item) => <strong>{item.id}</strong> }, { key: "farm", header: "Finca", render: (item) => item.farm }, { key: "recipes", header: "Recetas", render: (item) => item.recipes.length }, { key: "updated", header: "Actualización", render: (item) => item.updated }, { key: "status", header: "Estado", render: (item) => <Status value={item.status} /> }]} data={filtered.slice((current - 1) * size, current * size)} rowKey={(item) => item.id} minWidth="750px" emptyState="No hay pedidos para los filtros seleccionados." actionsHeader="Acciones" actions={(item) => <TableRowActions label={`Acciones de ${item.id}`}><IconButton variant="ghost" aria-label={`Ver detalle de ${item.id}`} title="Ver detalle" onClick={() => setSelected(item)}><ViewIcon /></IconButton></TableRowActions>} /><Pagination page={current} pageSize={size} total={filtered.length} pageSizeOptions={[2, 10, 20]} onPageChange={setPage} onPageSizeChange={(value) => { setSize(value); setPage(1); }} /></article>{selected && <section aria-label={`Detalle de ${selected.id}`}><MaterialDetail order={selected} /><div className="form-actions"><Button variant="outlined" onClick={() => setSelected(null)}>Cerrar detalle</Button></div></section>}</>;
}

const emptyForm = { farm: "", category: "", required: "", product: "", quantity: "1", unit: "UN", reason: "" };
export function MaterialsRecurringOrders() {
  const key = "sial-recurring-orders";
  const [orders, setOrders] = useState(() => readStored(key, recurringSeed)); const [search, setSearch] = useState(""); const [status, setStatus] = useState("all"); const [page, setPage] = useState(1); const [size, setSize] = useState(10); const [panel, setPanel] = useState(null); const [form, setForm] = useState(emptyForm); const [error, setError] = useState(""); const [feedback, setFeedback] = useState("");
  const previousPanel = useRef(null);
  const panelTrigger = useRef(null);
  useEffect(() => {
    if (panel && previousPanel.current === null) panelTrigger.current = document.activeElement;
    if (panel === "new") requestAnimationFrame(() => document.getElementById("recurring-farm")?.focus());
    else if (panel) requestAnimationFrame(() => {
      const review = document.querySelector('section[aria-label^="Revisión de "]');
      review?.setAttribute("tabindex", "-1");
      review?.focus();
      const table = document.querySelector(".workflow-table-card .bui-table-wrapper");
      if (table) table.scrollLeft = 0;
    });
    else if (previousPanel.current !== null) requestAnimationFrame(() => {
      const trigger = panelTrigger.current;
      if (trigger?.isConnected) trigger.focus();
      else document.querySelector(".workflow-table-card .card-actions button")?.focus();
    });
    previousPanel.current = panel;
  }, [panel]);
  useEffect(() => {
    if (!feedback) return undefined;
    const timer = window.setTimeout(() => setFeedback(""), 5000);
    return () => window.clearTimeout(timer);
  }, [feedback]);
  const categories = useMemo(() => readStored("sial-order-categories", []).filter((item) => item.status === "ACTIVO").map((item) => ({ value: item.code, label: `${item.code} · ${item.name}` })), []);
  const categoryOptions = categories.length ? categories : [{ value: "ETIQ", label: "ETIQ · ETIQUETA" }, { value: "OPER", label: "OPER · OPERATIVO" }, { value: "EMPA", label: "EMPA · EMPAQUE" }];
  const filtered = useMemo(() => orders.filter((item) => `${item.id} ${item.farm} ${item.reason} ${item.lines.map((line) => line.name).join(" ")}`.toLocaleLowerCase("es").includes(search.toLocaleLowerCase("es")) && (status === "all" || item.status === status)), [orders, search, status]);
  const current = Math.min(page, Math.max(1, Math.ceil(filtered.length / size)));
  const selected = orders.find((item) => item.id === panel);
  function save(next) { setOrders(next); localStorage.setItem(key, JSON.stringify(next)); }
  function changeStatus(value) { if (!selected || selected.status !== "Pendiente de aprobación") return; save(orders.map((item) => item.id === selected.id ? { ...item, status: value } : item)); setFeedback(`${selected.id}: ${value.toLocaleLowerCase("es")}.`); }
  function submit(event) {
    event.preventDefault();
    const required = [
      ["farm", !form.farm], ["category", !form.category], ["required", !form.required],
      ["product", !form.product.trim()], ["reason", !form.reason.trim()]
    ];
    const missing = required.find(([, invalid]) => invalid);
    if (missing) {
      setError("Completa todos los campos obligatorios.");
      document.getElementById(`recurring-${missing[0]}`)?.focus();
      return;
    }
    const quantity = Number(form.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      setError("Ingresa una cantidad entera mayor que cero.");
      document.getElementById("recurring-quantity")?.focus();
      return;
    }
    const nextNumber = Math.max(0, ...orders.map((item) => Number(item.id.match(/(\d+)$/)?.[1] || 0))) + 1;
    const item = {
      id: `PRC-2026-${String(nextNumber).padStart(3, "0")}`, farm: form.farm,
      category: form.category, required: form.required, reason: form.reason.trim(),
      status: "Pendiente de aprobación", created: "Ahora",
      lines: [{ name: form.product.trim(), quantity, unit: form.unit }]
    };
    save([item, ...orders]);
    setPanel(item.id); setError("");
    setFeedback(`${item.id} fue enviado a aprobación de Materiales.`);
  }
  const update = (field, value) => { setForm((previous) => ({ ...previous, [field]: value })); setError(""); };
  return <><Header eyebrow="Materiales / Pedidos" title="Pedidos recurrentes" subtitle="Registra necesidades operativas sin aviso de corte ni pedido semanal base." /><article className="card workflow-table-card standard-master-card"><div className="card-header"><div><h2 className="card-title">Pedidos recurrentes registrados</h2><p className="card-subtitle">Consulta la finca, categoría, necesidad y estado de aprobación.</p></div><div className="card-actions"><Chip preset="info">{filtered.length} {filtered.length === 1 ? "registro" : "registros"}</Chip><Button onClick={() => { setForm(emptyForm); setPanel("new"); setError(""); }}>Nueva solicitud</Button></div></div>{feedback && <Toast visible variant="success" title="Resultado" description={feedback} onClose={() => setFeedback("")} />}<div className="card-body"><div className="toolbar materials-toolbar"><TextInput id="recurringSearch" label="Buscar pedidos recurrentes" placeholder="Buscar pedido, finca o necesidad" value={search} onChange={(value) => { setSearch(value); setPage(1); }} /><SelectInput id="recurringStatus" label="Estado" value={status} options={[{ value: "all", label: "Todos los estados" }, ...["Borrador", "Pendiente de aprobación", "En revisión", "Aprobado", "Rechazado"].map((value) => ({ value, label: value }))]} onChange={(value) => { setStatus(value); setPage(1); }} /><TableFilterReset active={Boolean(search.trim()) || status !== "all"} onReset={() => { setSearch(""); setStatus("all"); setPage(1); }} /></div></div>{panel === "new" && <section className="inline-form-panel materials-inline-form" aria-label="Nueva solicitud recurrente"><div className="form-heading"><h3>Nueva solicitud recurrente</h3><p>Registra una necesidad operativa sin aviso de corte ni pedido semanal base.</p></div><form className="form-body" onSubmit={submit} noValidate><div className="grid recurring-form-grid"><div className="field span-4"><SelectInput id="recurring-farm" label="Finca" required value={form.farm} options={[{ value: "", label: "Seleccionar" }, ...farms.map((value) => ({ value, label: value }))]} onChange={(value) => update("farm", value)} /></div><div className="field span-4"><SelectInput id="recurring-category" label="Categoría" required value={form.category} options={[{ value: "", label: "Seleccionar" }, ...categoryOptions]} onChange={(value) => update("category", value)} /></div><div className="field span-4"><DateInput id="recurring-required" label="Fecha requerida" required value={form.required ? new Date(`${form.required}T12:00:00`) : null} onChange={(value) => update("required", value ? `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}` : "")} /></div><div className="field span-6"><TextInput id="recurring-product" label="Producto" required value={form.product} onChange={(value) => update("product", value)} /></div><div className="field span-3"><NumberInput id="recurring-quantity" label="Cantidad" required min={1} value={form.quantity} onChange={(value) => update("quantity", value)} /></div><div className="field span-3"><SelectInput id="recurring-unit" label="Unidad" value={form.unit} options={["UN", "PAR", "CAJA", "L"].map((value) => ({ value, label: value }))} onChange={(value) => update("unit", value)} /></div><div className="field span-12"><label className="label" htmlFor="recurring-reason">Justificación <span className="required">*</span></label><textarea className="textarea" id="recurring-reason" rows="3" value={form.reason} onChange={(event) => update("reason", event.target.value)} /></div></div>{error && <p className="field-error" role="alert">{error}</p>}<div className="form-actions"><Button variant="outlined" type="button" onClick={() => setPanel(null)}>Cancelar</Button><Button type="submit">Enviar a aprobación</Button></div></form></section>}<Table columns={[{ key: "id", header: "Pedido", render: (item) => <span className="materials-record-main"><strong>{item.id}</strong><span>{item.created}</span></span> }, { key: "farm", header: "Finca", render: (item) => item.farm }, { key: "category", header: "Categoría", render: (item) => item.category }, { key: "lines", header: "Necesidad", render: (item) => item.lines.map((line) => <span className="block" key={`${line.name}-${line.unit}`}>{line.name} · {line.quantity} {line.unit}</span>) }, { key: "required", header: "Fecha requerida", render: (item) => item.required }, { key: "status", header: "Estado", render: (item) => <Status value={item.status} /> }]} data={filtered.slice((current - 1) * size, current * size)} rowKey={(item) => item.id} minWidth="900px" emptyState="No hay pedidos recurrentes para los filtros seleccionados." actionsHeader="Acciones" actions={(item) => <TableRowActions label={`Acciones de ${item.id}`}><IconButton variant="ghost" aria-label={`Abrir pedido ${item.id}`} title="Abrir solicitud" onClick={() => setPanel(item.id)}><ViewIcon /></IconButton></TableRowActions>} /><Pagination page={current} pageSize={size} total={filtered.length} pageSizeOptions={[2, 10, 20]} onPageChange={setPage} onPageSizeChange={(value) => { setSize(value); setPage(1); }} /></article>{selected && <section className="inline-form-panel materials-inline-form" aria-label={`Revisión de ${selected.id}`}><div className="form-heading recurring-review-heading"><div><p className="section-kicker">Solicitud recurrente</p><h2>Revisión de {selected.id}</h2><p>Consulta la necesidad y registra la decisión de Materiales.</p></div><Status value={selected.status} /></div><div className="form-body recurring-review-body"><div className="recurring-review-summary"><div><span className="detail-label">Finca</span><strong>{selected.farm}</strong></div><div><span className="detail-label">Categoría</span><strong>{selected.category}</strong></div><div><span className="detail-label">Fecha requerida</span><strong>{selected.required}</strong></div></div><div className="recurring-review-reason"><span className="detail-label">Necesidad</span>{selected.lines.map((line) => <p key={`${line.name}-${line.unit}`}>{line.name} · {line.quantity} {line.unit}</p>)}</div><div className="recurring-review-reason"><span className="detail-label">Justificación</span><p>{selected.reason}</p></div><div className="form-actions"><Button variant="outlined" onClick={() => setPanel(null)}>Cerrar</Button>{selected.status === "Pendiente de aprobación" && <><Button variant="outlined" onClick={() => changeStatus("Rechazado")}>Rechazar</Button><Button onClick={() => changeStatus("Aprobado")}>Aprobar directamente</Button></>}</div></div></section>}</>;
}
