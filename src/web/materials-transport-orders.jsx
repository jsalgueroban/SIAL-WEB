import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Button, Chip, DateInput, IconButton, Pagination, SelectInput, Table,
  TableRowActions, TextInput, Toast, ViewIcon, EditIcon
} from "@banasandev/banasan-ui";


function exportRows(rows, columns, filename) {
  const quote = (value) => '"' + String(value ?? "").replaceAll('"', '""') + '"';
  const csv = [columns.map((column) => quote(column.header)).join(","),
    ...rows.map((row) => columns.map((column) => quote(row[column.key])).join(","))].join("\r\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename + ".csv";
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const orderKey = "sial-hu546-transport-orders";
const partitionKey = "sial-hu546-partitioned-sources";
const sourceOrders = [
  {
    id: "PED-2026-10482", document: "RET-2026-001", docType: "Retiro de materiales", cutNotice: "AC-2026-032", finca: "Finca Santa Isabel", approved: "28/06/2026 · 08:20",
    lines: [
      { id: "L01", code: "101279", material: "Caja cartón corrugado", quantity: 1480, unit: "UN" },
      { id: "L02", code: "1970", material: "Estiba de madera", quantity: 80, unit: "UN" },
      { id: "L03", code: "4925", material: "Zuncho amarillo", quantity: 400, unit: "M" },
      { id: "L04", code: "102247", material: "Tapa de cartón", quantity: 1480, unit: "UN" }
    ]
  },
  {
    id: "PED-2026-10493", document: "RET-2026-002", docType: "Retiro de materiales", cutNotice: "AC-2026-034", finca: "Finca El Retiro", approved: "29/06/2026 · 09:40",
    lines: [
      { id: "L01", code: "101279", material: "Caja cartón corrugado", quantity: 520, unit: "UN" },
      { id: "L02", code: "5418", material: "Separador de pallet", quantity: 35, unit: "PAQ" },
      { id: "L03", code: "4925", material: "Zuncho amarillo", quantity: 180, unit: "M" }
    ]
  }
];
const exampleOrders = [
  { id: "OTI-546-001", parentOrderId: sourceOrders[0].id, partition: 1, document: sourceOrders[0].document, docType: sourceOrders[0].docType, finca: sourceOrders[0].finca, origin: "Bodega principal", destination: sourceOrders[0].finca, window: "2026-10-25T08:00", responsible: "Coordinación de Transporte", modality: "propio", carrier: "", vehicle: "Pendiente de asignación", driver: "Pendiente de asignación", lines: sourceOrders[0].lines.slice(0, 2), status: "CREADO", operationStarted: false, audit: "Crear - datos de ejemplo|21/10/2026 08:00" },
  { id: "OTI-546-002", parentOrderId: sourceOrders[0].id, partition: 2, document: sourceOrders[0].document, docType: sourceOrders[0].docType, finca: sourceOrders[0].finca, origin: "Bodega principal", destination: sourceOrders[0].finca, window: "2026-10-25T10:00", responsible: "Coordinación de Transporte", modality: "propio", carrier: "", vehicle: "Pendiente de asignación", driver: "Pendiente de asignación", lines: sourceOrders[0].lines.slice(2), status: "CREADO", operationStarted: false, audit: "Crear - datos de ejemplo|21/10/2026 08:00" }
].map((order) => ({ ...order, materials: order.lines.map((line) => line.material).join(", "), quantity: lineSummary(order.lines) }));
const statusLabels = { CREADO: "Creado", NOTIFICADO: "Notificado", LISTO_DESPACHO: "Listo para despacho", ASIGNADO: "Asignado" };
const blankGroup = (id) => ({ id, origin: "Bodega principal", destination: "", window: "", responsible: "", modality: "", carrier: "" });
const initialDraft = () => ({ sourceId: "", groups: [blankGroup(1), blankGroup(2)], allocation: {} });
function readArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch { return []; }
}
function readOrders() {
  if (localStorage.getItem(orderKey) === null) return exampleOrders;
  return readArray(orderKey).map((order) => {
    const source = sourceOrders.find((item) => item.id === order.parentOrderId);
    return source && order.document === source.cutNotice
      ? { ...order, document: source.document, docType: source.docType }
      : order;
  });
}
function compactDate(value) {
  return value ? new Date(value).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" }) : "—";
}
function windowDate(value) {
  const [year, month, day] = (value.split("T")[0] || "").split("-").map(Number);
  return year && month && day ? new Date(year, month - 1, day, 12) : null;
}
function localDate(value) {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
}
function statusPreset(value) { return value === "NOTIFICADO" ? "active" : value === "CREADO" ? "info" : "warning"; }
function lineSummary(lines) {
  return lines.map((line) => `${line.material} · ${line.quantity.toLocaleString("es-CO")} ${line.unit}`).join(" / ");
}

export function MaterialsTransportOrders() {
  const [saved, setSaved] = useState(readOrders);
  const [mode, setMode] = useState("list");
  const [draft, setDraft] = useState(initialDraft);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState("");
  useEffect(() => {
    if (!feedback) return undefined;
    const timeout = window.setTimeout(() => setFeedback(""), 5000);
    return () => window.clearTimeout(timeout);
  }, [feedback]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeSourceId, setActiveSourceId] = useState("all");
  const [pickedLineId, setPickedLineId] = useState(null);
  const [dragLineId, setDragLineId] = useState(null);
  const [dropZone, setDropZone] = useState(null);
  const [arrivingLineId, setArrivingLineId] = useState(null);
  const dragPreviewRef = useRef(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const records = saved;
  const source = sourceOrders.find((item) => item.id === draft.sourceId);
  const availableSources = sourceOrders.filter((item) => !saved.some((order) => order.parentOrderId === item.id));
  const assigned = source?.lines.filter((line) => draft.allocation[line.id]) || [];
  const pending = source?.lines.filter((line) => !draft.allocation[line.id]) || [];
  const selected = records.find((item) => item.id === selectedId);
  const filtered = useMemo(() => records.filter((item) => {
    const haystack = [item.id, item.parentOrderId, item.document, item.finca, item.destination, item.materials, item.vehicle].join(" ").toLocaleLowerCase("es");
    return (activeSourceId === "all" || item.parentOrderId === activeSourceId) && haystack.includes(search.toLocaleLowerCase("es")) && (status === "all" || item.status === status);
  }), [records, activeSourceId, search, status]);
  const current = Math.min(page, Math.max(1, Math.ceil(filtered.length / size)));

  function openCreate() {
    setDraft(initialDraft());
    setErrors({});
    setPickedLineId(null);
    setMode("create");
  }
  function canEdit(item) {
    if (!item?.parentOrderId || item.operationStarted !== false) return false;
    const siblings = saved.filter((candidate) => candidate.parentOrderId === item.parentOrderId);
    return siblings.length >= 2 && siblings.every((candidate) => candidate.operationStarted === false && Array.isArray(candidate.lines));
  }
  function openEdit(item) {
    if (!canEdit(item)) return;
    const siblings = saved.filter((candidate) => candidate.parentOrderId === item.parentOrderId).sort((a, b) => a.partition - b.partition);
    const allocation = Object.fromEntries(siblings.flatMap((sibling, index) => sibling.lines.map((line) => [line.id, index + 1])));
    setDraft({
      sourceId: item.parentOrderId,
      groups: siblings.map((sibling, index) => ({ ...blankGroup(index + 1), id: index + 1, orderId: sibling.id, origin: sibling.origin, destination: sibling.destination, window: sibling.window, responsible: sibling.responsible, modality: sibling.modality, carrier: sibling.carrier || "" })),
      allocation
    });
    setErrors({}); setPickedLineId(null); setSelectedId(null); setMode("edit");
  }
  function updateGroup(id, key, value) {
    setDraft((previous) => ({ ...previous, groups: previous.groups.map((group) => group.id === id ? { ...group, [key]: value } : group) }));
    setErrors((previous) => ({ ...previous, [`${id}-${key}`]: "" }));
  }
  function updateWindow(id, part, value) {
    const group = draft.groups.find((item) => item.id === id);
    const [date = "", time = ""] = (group?.window || "").split("T");
    updateGroup(id, "window", `${part === "date" ? value : date}T${part === "time" ? value : time}`);
    setErrors((previous) => ({ ...previous, [`${id}-window${part === "date" ? "Date" : "Time"}`]: "" }));
  }
  function assign(lineId, groupId, animate = true) {
    setDraft((previous) => ({ ...previous, allocation: { ...previous.allocation, [lineId]: groupId } }));
    setErrors((previous) => ({ ...previous, allocation: "", groups: "" }));
    setArrivingLineId(animate ? lineId : null);
    setPickedLineId(null);
    setDropZone(null);
  }
  useEffect(() => {
    if (!arrivingLineId) return undefined;
    const element = document.querySelector('[data-transport-line="' + arrivingLineId + '"]');
    if (!element) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timeout = window.setTimeout(() => setArrivingLineId(null), 120);
      return () => window.clearTimeout(timeout);
    }
    const animation = element.animate([
      { opacity: 0.45, transform: "translateY(-8px) scale(0.92)" },
      { opacity: 1, transform: "translateY(0) scale(1)" }
    ], { duration: 260, easing: "cubic-bezier(0.23, 1, 0.32, 1)" });
    animation.onfinish = () => setArrivingLineId(null);
    return () => animation.cancel();
  }, [arrivingLineId, draft.allocation]);
  function beginDrag(event, lineId) {
    event.dataTransfer.setData("text/plain", lineId);
    event.dataTransfer.effectAllowed = "move";
    if (dragPreviewRef.current) event.dataTransfer.setDragImage(dragPreviewRef.current, 28, 28);
    setDragLineId(lineId);
    setPickedLineId(null);
  }
  function allowDrop(event, zone) {
    if (!dragLineId) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDropZone(zone);
  }
  function finishDrop(event, groupId) {
    event.preventDefault();
    const lineId = event.dataTransfer.getData("text/plain");
    if (source?.lines.some((line) => line.id === lineId)) assign(lineId, groupId);
    setDragLineId(null);
    setDropZone(null);
  }
  function leaveDrop(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) setDropZone(null);
  }
  function togglePicked(lineId) {
    setPickedLineId((previous) => previous === lineId ? null : lineId);
  }
  useEffect(() => {
    if (!pickedLineId) return undefined;
    const cancelSelection = (event) => {
      if (event.key === "Escape") setPickedLineId(null);
    };
    window.addEventListener("keydown", cancelSelection);
    return () => window.removeEventListener("keydown", cancelSelection);
  }, [pickedLineId]);
  function draggableLineProps(line) {
    return {
      draggable: true,
      onDragStart: (event) => beginDrag(event, line.id),
      onDragEnd: () => { setDragLineId(null); setDropZone(null); },
      onClick: () => togglePicked(line.id),
      "aria-pressed": pickedLineId === line.id,
      "aria-label": line.material + ", " + line.quantity + " " + line.unit + ". " + (pickedLineId === line.id ? "Seleccionado; elige una orden o pendientes." : "Seleccionar para mover o arrastrar.")
    };
  }
  function addGroup() {
    setDraft((previous) => ({ ...previous, groups: [...previous.groups, blankGroup(Math.max(...previous.groups.map((group) => group.id)) + 1)] }));
  }
  function removeGroup(groupId) {
    setDraft((previous) => ({
      ...previous,
      groups: previous.groups.filter((group) => group.id !== groupId),
      allocation: Object.fromEntries(Object.entries(previous.allocation).filter(([, value]) => value !== groupId))
    }));
  }
  function chooseSource(value) {
    setDraft({ ...initialDraft(), sourceId: value });
    setErrors({});
    setPickedLineId(null);
  }
  function validateDraft() {
    const nextErrors = {};
    if (!source) nextErrors.source = "Selecciona un pedido aprobado.";
    if (source && pending.length) nextErrors.allocation = `Asigna los ${pending.length} ítems pendientes antes de crear las órdenes.`;
    const active = draft.groups.filter((group) => Object.values(draft.allocation).includes(group.id));
    if (source && active.length < 2) nextErrors.groups = "Distribuye los ítems en al menos dos órdenes de transporte.";
    if (mode === "edit" && active.length !== draft.groups.length) nextErrors.groups = "Cada orden consolidada debe conservar al menos un ítem.";
    active.forEach((group) => {
      for (const field of ["origin", "destination", "responsible", "modality"]) {
        if (!group[field].trim()) nextErrors[`${group.id}-${field}`] = "Completa este dato para crear la orden.";
      }
      const [date, time] = group.window.split("T");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "")) nextErrors[`${group.id}-windowDate`] = "Selecciona la fecha prevista.";
      if (!/^\d{2}:\d{2}$/.test(time || "")) nextErrors[`${group.id}-windowTime`] = "Indica la hora prevista.";
      if (group.modality === "tercero" && !group.carrier.trim()) nextErrors[`${group.id}-carrier`] = "Indica el transportador tercero.";
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length ? null : active;
  }
  function savePartition() {
    const active = validateDraft();
    if (!active) return;
    const existingNumbers = records.map((item) => Number(item.id.match(/(\d+)$/)?.[1] || 0));
    const start = Math.max(0, ...existingNumbers) + 1;
    const createdAt = new Date().toISOString();
    const created = active.map((group, index) => {
      const lines = source.lines.filter((line) => draft.allocation[line.id] === group.id);
      return {
        id: `OTI-546-${String(start + index).padStart(3, "0")}`,
        parentOrderId: source.id, partition: index + 1, document: source.document, docType: source.docType,
        finca: source.finca, origin: group.origin.trim(), destination: group.destination.trim(),
        window: group.window, responsible: group.responsible.trim(), modality: group.modality,
        carrier: group.carrier.trim(), vehicle: "Pendiente de asignación", driver: "Pendiente de asignación",
        lines, materials: lines.map((line) => line.material).join(", "), quantity: lineSummary(lines),
        status: "CREADO", operationStarted: false, audit: `Crear - propuesta local|${compactDate(createdAt)}`, createdAt
      };
    });
    const next = [...created, ...saved];
    localStorage.setItem(orderKey, JSON.stringify(next));
    localStorage.setItem(partitionKey, JSON.stringify([...new Set([...readArray(partitionKey), source.id])]));
    setSaved(next);
    setActiveSourceId(source.id);
    setDraft(initialDraft());
    setMode("list");
    setFeedback(`${created.length} órdenes de transporte creadas desde ${source.id}. Todos los ítems quedaron asignados.`);
  }
  function saveEdit() {
    const active = validateDraft();
    if (!active || !source) return;
    const currentOrders = saved.filter((item) => item.parentOrderId === source.id);
    if (currentOrders.length !== draft.groups.length || !currentOrders.every(canEdit)) {
      setErrors({ groups: "La edición ya no está disponible para estas órdenes. Vuelve a la consulta." });
      return;
    }
    const updatedAt = new Date().toISOString();
    const updates = new Map(active.map((group) => {
      const lines = source.lines.filter((line) => draft.allocation[line.id] === group.id);
      return [group.orderId, { origin: group.origin.trim(), destination: group.destination.trim(), window: group.window,
        responsible: group.responsible.trim(), modality: group.modality, carrier: group.carrier.trim(), lines,
        materials: lines.map((line) => line.material).join(", "), quantity: lineSummary(lines),
        audit: `Editar - propuesta local|${compactDate(updatedAt)}` }];
    }));
    const next = saved.map((item) => updates.has(item.id) ? { ...item, ...updates.get(item.id) } : item);
    localStorage.setItem(orderKey, JSON.stringify(next));
    setSaved(next); setActiveSourceId(source.id); setDraft(initialDraft()); setMode("list");
    setFeedback(`${active.length} órdenes actualizadas. Todos los ítems siguen asignados a una orden.`);
  }
  const columns = [
    { key: "id", header: "Orden de transporte", render: (item) => <span className="materials-record-main"><strong>{item.id}</strong><span>{item.parentOrderId ? `${item.parentOrderId} · Partición ${item.partition}` : "Registro anterior"}</span></span> },
    { key: "document", header: "Documento de retiro", render: (item) => <span className="materials-record-main"><strong>{item.document}</strong><span>{item.docType || "Documento de retiro"}</span></span> },
    { key: "route", header: "Trayecto", render: (item) => <span className="materials-record-main"><strong>{item.origin || "Origen no registrado"} → {item.destination || item.finca}</strong><span>{item.window ? compactDate(item.window) : "Ventana no registrada"}</span></span> },
    { key: "materials", header: "Carga", render: (item) => <span className="materials-record-main"><strong>{item.lines?.length ? `${item.lines.length} ${item.lines.length === 1 ? "ítem" : "ítems"}` : "Carga registrada"}</strong><span>{item.materials}</span></span> },
    { key: "status", header: "Estado", render: (item) => <Chip preset={statusPreset(item.status)}>{statusLabels[item.status] || item.status}</Chip> },
    { key: "audit", header: "Último evento", render: (item) => String(item.audit || "—").replace("|", " · ") }
  ];

  return <>
    <div ref={dragPreviewRef} className="transport-drag-preview" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><path d="M24 5 42 15v18L24 43 6 33V15L24 5Z" stroke="currentColor" strokeWidth="2.5"/><path d="m6 15 18 10 18-10M24 25v18" stroke="currentColor" strokeWidth="2.5"/></svg><span>Ítem</span></div>
    <p className="page-eyebrow">Materiales / Transporte</p>
    <div className="page-header"><div><h1 className="page-title">{mode === "list" ? "Órdenes de transporte de insumos" : mode === "edit" ? "Editar órdenes consolidadas" : "Particionar pedido de materiales"}</h1><p className="page-subtitle">{mode === "list" ? "Consulta las particiones creadas desde cada pedido aprobado y su documento de retiro." : mode === "edit" ? "Ajusta la distribución y los datos de las órdenes antes del inicio de la operación." : "Distribuye todos los ítems completos de un pedido aprobado entre las órdenes que atenderá Transporte."}</p></div></div>
    {feedback && <div className="transport-feedback-toast" role="status"><Toast visible variant="success" title="Operación completada" description={feedback} onClose={() => setFeedback("")} /></div>}
    {mode === "list" ? <article className="card mt-24 standard-master-card">
      <div className="card-header"><div><h2 className="card-title">Órdenes registradas</h2><p className="card-subtitle">Cada orden conserva su pedido de origen y el documento de retiro de materiales.</p></div><div className="card-actions"><Chip preset="info">{records.length} {records.length === 1 ? "orden" : "órdenes"}</Chip><Button variant="outlined" onClick={() => exportRows(filtered, columns, "ordenes-transporte-insumos")}>Exportar</Button><Button onClick={openCreate}>Particionar pedido</Button></div></div>
      <div className="card-body"><div className="toolbar materials-toolbar"><TextInput id="transportSearch" label="Buscar orden o material" placeholder="Código de orden o material" value={search} onChange={(value) => { setSearch(value); setPage(1); }} /><SelectInput id="transportSourceFilter" label="Pedido / documento de retiro" value={activeSourceId} options={[{ value: "all", label: "Todos los pedidos" }, ...sourceOrders.map((item) => ({ value: item.id, label: `${item.id} · ${item.document}` }))]} onChange={(value) => { setActiveSourceId(value); setPage(1); }} /><SelectInput id="transportStatus" label="Estado" value={status} options={[{ value: "all", label: "Todos los estados" }, ...Object.entries(statusLabels).map(([value, label]) => ({ value, label }))]} onChange={(value) => { setStatus(value); setPage(1); }} /></div></div>
      <Table columns={columns} data={filtered.slice((current - 1) * size, current * size)} rowKey={(item) => item.id} minWidth="900px" emptyState="No hay órdenes que coincidan con la búsqueda en este documento." actionsHeader="Acciones" actions={(item) => <TableRowActions label={`Acciones de ${item.id}`}><IconButton variant="ghost" aria-label={`Ver detalle de ${item.id}`} title="Ver detalle" onClick={() => setSelectedId(item.id)}><ViewIcon /></IconButton>{canEdit(item) && <IconButton variant="ghost" aria-label={`Editar órdenes del documento ${item.document}`} title="Editar órdenes consolidadas" onClick={() => openEdit(item)}><EditIcon /></IconButton>}</TableRowActions>} />
      <Pagination page={current} pageSize={size} total={filtered.length} pageSizeOptions={[10, 20, 50]} onPageChange={setPage} onPageSizeChange={(value) => { setSize(value); setPage(1); }} />
    </article> : <div className="transport-create">
      <section className="card transport-source-card"><div className="card-body">
        <div className="transport-section-head"><h2>Pedido de origen</h2><span className="transport-section-note">{mode === "edit" ? "Documento consolidado · edición previa a operación" : "Solo pedidos aprobados sin partición previa"}</span></div>
        {mode === "edit" ? <div className="transport-edit-source"><strong>{source?.document} · {source?.id}</strong><span>{source?.finca} · {source?.lines.length} ítems completos</span></div> : <SelectInput id="transportSource" label="Pedido aprobado" required value={draft.sourceId} options={[{ value: "", label: "Seleccionar pedido" }, ...availableSources.map((item) => ({ value: item.id, label: `${item.id} · ${item.finca} · ${item.lines.length} ítems` }))]} onChange={chooseSource} />}
        {errors.source && <p className="field-error" role="alert">{errors.source}</p>}
        {source && <div className="transport-source-meta">{mode === "create" && <span><strong>Documento de retiro (ejemplo):</strong> {source.document}</span>}<span><strong>Aviso de corte:</strong> {source.cutNotice}</span><span><strong>Aprobado:</strong> {source.approved}</span></div>}
        {mode === "create" && !availableSources.length && <p className="transport-help">Todos los pedidos de ejemplo ya fueron particionados. Las órdenes creadas permanecen en la vista de consulta.</p>}
      </div></section>
      {source && <>
        <section className="card transport-allocation-card"><div className="card-body">
          <div className="transport-section-head"><h2>Distribuir ítems</h2><Chip preset={pending.length ? "warning" : "active"}>{assigned.length} de {source.lines.length} asignados</Chip></div>
          <p className="transport-help">Arrastra cada ítem a una orden. En pantalla táctil o con teclado, selecciónalo y pulsa «Colocar aquí». Su cantidad no se divide.</p>
          {pickedLineId && <p className="transport-pick-hint" role="status">Ítem seleccionado: {source.lines.find((line) => line.id === pickedLineId)?.material}. Elige una orden o devuélvelo a pendientes.</p>}
          {errors.allocation && <p className="field-error" role="alert">{errors.allocation}</p>}
          {errors.groups && <p className="field-error" role="alert">{errors.groups}</p>}
          <div className="transport-allocation-grid">
            <div className={"transport-pending transport-drop-zone" + (dropZone === "pending" ? " is-drop-target" : "")} onDragOver={(event) => allowDrop(event, "pending")} onDragLeave={leaveDrop} onDrop={(event) => finishDrop(event, null)}><div className="transport-column-head"><div><span className="transport-column-kicker">POR DISTRIBUIR</span><h3>Ítems del pedido</h3></div><strong>{pending.length} {pending.length === 1 ? "pendiente" : "pendientes"}</strong></div>{pickedLineId && draft.allocation[pickedLineId] && <div className="transport-drop-action"><Button variant="outlined" type="button" onClick={(event) => assign(pickedLineId, null, event.detail !== 0)}>Devolver a pendientes</Button></div>}{pending.length ? <div className="transport-pending-list">{pending.map((line) => <div className="transport-item" key={line.id}><button type="button" data-transport-line={line.id} className={"transport-drag-item" + (pickedLineId === line.id ? " is-picked" : "") + (dragLineId === line.id ? " is-dragging" : "")} {...draggableLineProps(line)}><span className="transport-item-index">{line.id}</span><span className="transport-item-copy"><strong>{line.material}</strong><small>Código {line.code}</small></span><span className="transport-item-quantity">{line.quantity.toLocaleString("es-CO")} <small>{line.unit}</small></span></button></div>)}</div> : <p className="transport-empty transport-pending-complete">Todos los ítems están distribuidos. Puedes devolver uno aquí.</p>}</div>
            <div className="transport-groups"><div className="transport-groups-heading"><div><span className="transport-column-kicker">{mode === "edit" ? "ÓRDENES CONSOLIDADAS" : "RESULTADO DE LA PARTICIÓN"}</span><h3>{mode === "edit" ? "Distribución del documento" : "Órdenes en construcción"}</h3></div>{mode === "create" && <Button variant="outlined" type="button" onClick={addGroup}>Agregar orden</Button>}</div>
              {draft.groups.map((group) => {
                const lines = source.lines.filter((line) => draft.allocation[line.id] === group.id);
                return <section className={"transport-group transport-drop-zone" + (lines.length ? " has-items" : "") + (dropZone === group.id ? " is-drop-target" : "")} key={group.id} aria-label={"Orden " + group.id} onDragOver={(event) => allowDrop(event, group.id)} onDragLeave={leaveDrop} onDrop={(event) => finishDrop(event, group.id)}><div className="transport-group-head"><div><span>{mode === "edit" ? "ORDEN CONSOLIDADA" : "ORDEN EN PREPARACIÓN"}</span><h4>{group.orderId || `Orden ${group.id}`}</h4></div><strong>{lines.length} {lines.length === 1 ? "ítem" : "ítems"}</strong></div>
                  {pickedLineId && draft.allocation[pickedLineId] !== group.id && <div className="transport-drop-action"><Button variant="outlined" type="button" onClick={(event) => assign(pickedLineId, group.id, event.detail !== 0)}>Colocar aquí</Button></div>}
                  {lines.length ? <ul className="transport-assigned-list">{lines.map((line) => <li key={line.id}><button type="button" data-transport-line={line.id} className={"transport-drag-item" + (pickedLineId === line.id ? " is-picked" : "") + (dragLineId === line.id ? " is-dragging" : "")} {...draggableLineProps(line)}><span className="transport-item-copy"><strong>{line.material}</strong><small>{line.code} · {line.quantity.toLocaleString("es-CO")} {line.unit}</small></span></button></li>)}</ul> : <p className="transport-empty">Arrastra aquí los ítems que viajarán juntos.</p>}
                  <div className="transport-group-foot"><span>{lines.length ? "Los ítems se trasladarán juntos." : "Selecciona ítems del pedido para conformarla."}</span>{mode === "create" && draft.groups.length > 2 && !lines.length && <Button variant="outlined" type="button" onClick={() => removeGroup(group.id)}>Eliminar orden vacía</Button>}</div>
                </section>;
              })}
            </div>
          </div>
          <div className={`transport-allocation-summary${pending.length ? "" : " is-complete"}`} aria-live="polite"><div><strong>{pending.length ? `${pending.length} ${pending.length === 1 ? "ítem pendiente" : "ítems pendientes"}` : "Distribución completa"}</strong><span>{pending.length ? "Asigna cada ítem completo a una de las órdenes." : `Los ${source.lines.length} ítems del pedido quedaron en ${draft.groups.filter((group) => Object.values(draft.allocation).includes(group.id)).length} órdenes.`}</span></div><span>{assigned.length} / {source.lines.length}</span></div>
        </div></section>
        <section className="card transport-details-card"><div className="card-body"><div className="transport-section-head"><h2>Datos de cada orden</h2><span className="transport-section-note">{mode === "edit" ? "Modifica solo antes del inicio de operación" : "Se registrarán como creadas, pendientes de asignación operativa"}</span></div>
          {draft.groups.filter((group) => Object.values(draft.allocation).includes(group.id)).map((group) => <div className="transport-detail-group" key={group.id}><h3>{group.orderId || `Orden ${group.id}`}</h3><div className="transport-fields">
            <div><TextInput id={`origin-${group.id}`} label="Origen" required value={group.origin} onChange={(value) => updateGroup(group.id, "origin", value)} />{errors[`${group.id}-origin`] && <p className="field-error" role="alert">{errors[`${group.id}-origin`]}</p>}</div>
            <div><TextInput id={`destination-${group.id}`} label="Destino" required value={group.destination} placeholder={source.finca} onChange={(value) => updateGroup(group.id, "destination", value)} />{errors[`${group.id}-destination`] && <p className="field-error" role="alert">{errors[`${group.id}-destination`]}</p>}</div>
            <div><DateInput id={`window-date-${group.id}`} label="Fecha prevista" required value={windowDate(group.window)} onChange={(value) => updateWindow(group.id, "date", value ? localDate(value) : "")} />{errors[`${group.id}-windowDate`] && <p className="field-error" role="alert">{errors[`${group.id}-windowDate`]}</p>}</div>
            <div className="transport-native-field"><label htmlFor={`window-time-${group.id}`}>Hora prevista <span aria-hidden="true">*</span></label><input id={`window-time-${group.id}`} type="time" required value={group.window.split("T")[1] || ""} onChange={(event) => updateWindow(group.id, "time", event.target.value)} />{errors[`${group.id}-windowTime`] && <p className="field-error" role="alert">{errors[`${group.id}-windowTime`]}</p>}</div>
            <div><TextInput id={`responsible-${group.id}`} label="Responsable" required value={group.responsible} placeholder="Nombre del responsable" onChange={(value) => updateGroup(group.id, "responsible", value)} />{errors[`${group.id}-responsible`] && <p className="field-error" role="alert">{errors[`${group.id}-responsible`]}</p>}</div>
            <div><SelectInput id={`modality-${group.id}`} label="Modalidad" required value={group.modality} options={[{ value: "", label: "Seleccionar modalidad" }, { value: "propio", label: "Transporte propio" }, { value: "tercero", label: "Transportador tercero" }]} onChange={(value) => updateGroup(group.id, "modality", value)} />{errors[`${group.id}-modality`] && <p className="field-error" role="alert">{errors[`${group.id}-modality`]}</p>}</div>
            {group.modality === "tercero" && <div><TextInput id={`carrier-${group.id}`} label="Transportador" required value={group.carrier} onChange={(value) => updateGroup(group.id, "carrier", value)} />{errors[`${group.id}-carrier`] && <p className="field-error" role="alert">{errors[`${group.id}-carrier`]}</p>}</div>}
          </div></div>)}
        </div></section>
      </>}
      <div className="transport-create-actions"><Button variant="outlined" type="button" onClick={() => { setMode("list"); setDraft(initialDraft()); setErrors({}); }}>Cancelar</Button><Button type="button" onClick={mode === "edit" ? saveEdit : savePartition} disabled={!source}>{mode === "edit" ? "Guardar cambios" : "Crear órdenes de transporte"}</Button></div>
    </div>}
    {selected && <div className="transport-detail-overlay" role="presentation" onClick={() => setSelectedId(null)}><section className="transport-detail-panel" role="dialog" aria-modal="true" aria-labelledby="transportDetailTitle" onClick={(event) => event.stopPropagation()}><div className="transport-detail-header"><div><span>ORDEN DE TRANSPORTE</span><h2 id="transportDetailTitle">{selected.id}</h2><p>{selected.parentOrderId ? `${selected.parentOrderId} · Partición ${selected.partition}` : "Registro anterior a la partición"}</p></div><button type="button" aria-label="Cerrar detalle" onClick={() => setSelectedId(null)}>×</button></div><div className="transport-detail-body"><Chip preset={statusPreset(selected.status)}>{statusLabels[selected.status] || selected.status}</Chip><dl><div><dt>Documento de retiro</dt><dd>{selected.document}</dd></div><div><dt>Trayecto</dt><dd>{selected.origin || "No registrado"} → {selected.destination || selected.finca}</dd></div><div><dt>Fecha prevista</dt><dd>{selected.window ? compactDate(selected.window) : "No registrada"}</dd></div><div><dt>Modalidad</dt><dd>{selected.modality === "tercero" ? `Tercero · ${selected.carrier}` : selected.modality === "propio" ? "Transporte propio" : "No registrada"}</dd></div><div><dt>Responsable</dt><dd>{selected.responsible || "No registrado"}</dd></div><div><dt>Asignación</dt><dd>{selected.vehicle || "Pendiente"} · {selected.driver || "Pendiente"}</dd></div></dl><h3>Ítems de la orden</h3>{selected.lines?.length ? <ul className="transport-detail-lines">{selected.lines.map((line) => <li key={line.id}><strong>{line.material}</strong><span>{line.code} · {line.quantity.toLocaleString("es-CO")} {line.unit}</span></li>)}</ul> : <p>{selected.quantity || selected.materials}</p>}<h3>Último evento</h3><p>{String(selected.audit || "Sin evento").replace("|", " · ")}</p></div><div className="transport-detail-footer">{canEdit(selected) && <Button onClick={() => openEdit(selected)}>Editar órdenes del documento</Button>}<Button variant="outlined" onClick={() => setSelectedId(null)}>Cerrar</Button></div></section></div>}
  </>;
}
