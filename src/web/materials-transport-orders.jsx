import React, { useEffect, useMemo, useRef, useState } from "react";
import { TableFilterReset } from "./table-filter-reset.jsx";
import { deliveries } from "./materials-operations.jsx";
import { createPrototypeDocumentPdf } from "./prototype-document-pdf.js";
import {
  ArrowRightIcon, Button, ChevronDownIcon, ChevronRightIcon, Chip, DateInput, DocumentFileIcon,
  Drawer, IconButton, Pagination, SelectInput, TextInput, Toast, ViewIcon
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
    id: "PED-2026-10482", document: "AC-2026-032", finca: "Finca Santa Isabel", approved: "28/06/2026 · 08:20",
    lines: [
      { id: "L01", code: "101279", material: "Caja cartón corrugado", quantity: 1480, unit: "UN" },
      { id: "L02", code: "1970", material: "Estiba de madera", quantity: 80, unit: "UN" },
      { id: "L03", code: "4925", material: "Zuncho amarillo", quantity: 400, unit: "M" },
      { id: "L04", code: "102247", material: "Tapa de cartón", quantity: 1480, unit: "UN" }
    ]
  },
  {
    id: "PED-2026-10493", document: "AC-2026-034", finca: "Finca El Retiro", approved: "29/06/2026 · 09:40",
    lines: [
      { id: "L01", code: "101279", material: "Caja cartón corrugado", quantity: 520, unit: "UN" },
      { id: "L02", code: "5418", material: "Separador de pallet", quantity: 35, unit: "PAQ" },
      { id: "L03", code: "4925", material: "Zuncho amarillo", quantity: 180, unit: "M" }
    ]
  }
];
const legacySeeds = [
  { id: "OTI-546-001", document: "RPT-2026-0881", docType: "RPT", finca: "Finca Santa Isabel", vehicle: "TUL458", driver: "Carlos Mendoza", materials: "Caja cartón corrugado, Estiba madera", quantity: "1480 unidades", status: "NOTIFICADO", audit: "Notificar - sistema|28/06/2026 10:30" },
  { id: "OTI-546-002", document: "REM-2026-0184", docType: "Remisión", finca: "Finca El Retiro", vehicle: "CAM-102", driver: "Ana Ramirez", materials: "Caja cartón corrugado", quantity: "520 unidades", status: "LISTO_DESPACHO", audit: "Crear - usuario.logistico|28/06/2026 11:05" },
  { id: "OTI-546-003", document: "RES-2026-0045", docType: "Reserva", finca: "Finca Las Palmas", vehicle: "Sin asignar", driver: "—", materials: "Separador de pallet", quantity: "35 paquetes", status: "ASIGNADO", audit: "Asignar - almacen.pedidos|28/06/2026 12:12" }
];
const statusLabels = { CREADO: "Creado", NOTIFICADO: "Notificado", LISTO_DESPACHO: "Listo para despacho", ASIGNADO: "Asignado" };
const blankGroup = (id) => ({ id, origin: "Bodega principal", destination: "", window: "", responsible: "", modality: "", carrier: "" });
const initialDraft = () => ({ sourceId: "", groups: [blankGroup(1), blankGroup(2)], allocation: {} });
function readArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch { return []; }
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
function materialCount(item) {
  return item.lines?.length ?? String(item.materials || "").split(",").filter((value) => value.trim()).length;
}
function relatedDocuments(item) {
  const documents = [];
  const delivery = deliveries.find((record) => record.order === item.id && record.document === item.document);
  const deliveryHref = delivery ? `seguimiento-entregas.html?entrega=${encodeURIComponent(delivery.id)}` : null;
  if (item.parentOrderId) {
    documents.push({
      kind: "Pedido aprobado", code: item.parentOrderId,
      href: item.parentOrderId === "PED-2026-10482"
        ? `aprobacion-pedidos-materiales.html?pedido=${encodeURIComponent(item.parentOrderId)}`
        : "aprobacion-pedidos-materiales.html",
      destination: "Aprobación de pedidos"
    });
  }
  if (item.document) {
    const isNotice = item.document.startsWith("AC-");
    documents.push({
      kind: isNotice ? "Aviso de corte" : "Documento de origen", code: item.document,
      href: isNotice
        ? item.document === "AC-2026-032"
          ? `../Gestion%20de%20Planeacion/consultar-aviso-corte.html?aviso=${encodeURIComponent(item.document)}`
          : "../Gestion%20de%20Planeacion/gestion-avisos-corte.html"
        : deliveryHref,
      destination: isNotice ? "Gestión de avisos de corte" : "Seguimiento de entregas y POD"
    });
  }
  if (delivery) {
    documents.push({ kind: "Entrega de insumos", code: delivery.id, href: deliveryHref, destination: "Seguimiento de entregas y POD" });
    if (delivery.pod && delivery.pod !== "Pendiente") {
      documents.push({ kind: "POD", code: delivery.pod, href: deliveryHref, destination: "Seguimiento de entregas y POD" });
    }
  }
  return documents;
}
function exportTransportRows(rows, columns) {
  const values = rows.map((item) => ({
    ...item,
    route: `${item.origin || "Origen no registrado"} → ${item.destination || item.finca} · ${item.window ? compactDate(item.window) : "Ventana no registrada"}`,
    materials: `${materialCount(item)} ${materialCount(item) === 1 ? "ítem" : "ítems"} · ${item.materials}`,
    status: statusLabels[item.status] || item.status,
    audit: String(item.audit || "—").replace("|", " · ")
  }));
  exportRows(values, columns, "ordenes-transporte-insumos");
}

export function MaterialsTransportOrders() {
  const [saved, setSaved] = useState(() => readArray(orderKey));
  const [partitioned, setPartitioned] = useState(() => readArray(partitionKey));
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
  const [pdfPreview, setPdfPreview] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  useEffect(() => {
    if (!pdfPreview) { setPdfUrl(""); return undefined; }
    const url = URL.createObjectURL(createPrototypeDocumentPdf(pdfPreview));
    setPdfUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [pdfPreview]);
  const [expandedId, setExpandedId] = useState(null);
  const [pickedLineId, setPickedLineId] = useState(null);
  const [dragLineId, setDragLineId] = useState(null);
  const [dropZone, setDropZone] = useState(null);
  const [arrivingLineId, setArrivingLineId] = useState(null);
  const dragPreviewRef = useRef(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const records = useMemo(() => [...saved, ...legacySeeds], [saved]);
  const source = sourceOrders.find((item) => item.id === draft.sourceId);
  const availableSources = sourceOrders.filter((item) => !partitioned.includes(item.id));
  const assigned = source?.lines.filter((line) => draft.allocation[line.id]) || [];
  const pending = source?.lines.filter((line) => !draft.allocation[line.id]) || [];
  const selected = records.find((item) => item.id === selectedId);
  const filtered = useMemo(() => records.filter((item) => {
    const haystack = [item.id, item.parentOrderId, item.document, item.finca, item.destination, item.materials, item.vehicle,
      ...relatedDocuments(item).map((document) => document.code)].join(" ").toLocaleLowerCase("es");
    return haystack.includes(search.toLocaleLowerCase("es")) && (status === "all" || item.status === status);
  }), [records, search, status]);
  const current = Math.min(page, Math.max(1, Math.ceil(filtered.length / size)));
  const visibleRows = filtered.slice((current - 1) * size, current * size);

  function openDocumentPdf(item, document) {
    setPdfPreview({
      kind: document.kind, code: document.code, orderId: item.id,
      finca: item.finca, origin: item.document,
      status: statusLabels[item.status] || item.status
    });
  }

  function openCreate() {
    setExpandedId(null);
    setDraft(initialDraft());
    setErrors({});
    setPickedLineId(null);
    setMode("create");
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
  function savePartition() {
    const nextErrors = {};
    if (!source) nextErrors.source = "Selecciona un pedido aprobado.";
    if (source && pending.length) nextErrors.allocation = `Asigna los ${pending.length} ítems pendientes antes de crear las órdenes.`;
    const active = draft.groups.filter((group) => Object.values(draft.allocation).includes(group.id));
    if (source && active.length < 2) nextErrors.groups = "Distribuye los ítems en al menos dos órdenes de transporte.";
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
    if (Object.keys(nextErrors).length) return;
    const existingNumbers = records.map((item) => Number(item.id.match(/(\d+)$/)?.[1] || 0));
    const start = Math.max(0, ...existingNumbers) + 1;
    const createdAt = new Date().toISOString();
    const created = active.map((group, index) => {
      const lines = source.lines.filter((line) => draft.allocation[line.id] === group.id);
      return {
        id: `OTI-546-${String(start + index).padStart(3, "0")}`,
        parentOrderId: source.id, partition: index + 1, document: source.document, docType: "Aviso de corte",
        finca: source.finca, origin: group.origin.trim(), destination: group.destination.trim(),
        window: group.window, responsible: group.responsible.trim(), modality: group.modality,
        carrier: group.carrier.trim(), vehicle: "Pendiente de asignación", driver: "Pendiente de asignación",
        lines, materials: lines.map((line) => line.material).join(", "), quantity: lineSummary(lines),
        status: "CREADO", audit: `Crear - propuesta local|${compactDate(createdAt)}`, createdAt
      };
    });
    const next = [...created, ...saved];
    localStorage.setItem(orderKey, JSON.stringify(next));
    localStorage.setItem(partitionKey, JSON.stringify([...partitioned, source.id]));
    setSaved(next);
    setPartitioned((previous) => [...previous, source.id]);
    setDraft(initialDraft());
    setMode("list");
    setFeedback(`${created.length} órdenes de transporte creadas desde ${source.id}. Todos los ítems quedaron asignados.`);
  }
  const exportColumns = [
    { key: "id", header: "Orden de transporte" }, { key: "document", header: "Documento origen" },
    { key: "route", header: "Trayecto" }, { key: "materials", header: "Carga" },
    { key: "status", header: "Estado" }, { key: "audit", header: "Último evento" }
  ];

  return <>
    <div ref={dragPreviewRef} className="transport-drag-preview" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><path d="M24 5 42 15v18L24 43 6 33V15L24 5Z" stroke="currentColor" strokeWidth="2.5"/><path d="m6 15 18 10 18-10M24 25v18" stroke="currentColor" strokeWidth="2.5"/></svg><span>Ítem</span></div>
    <p className="page-eyebrow">Materiales / Transporte</p>
    <div className="page-header"><div><h1 className="page-title">{mode === "list" ? "Órdenes de transporte de insumos" : "Particionar pedido de materiales"}</h1><p className="page-subtitle">{mode === "list" ? "Consulta las órdenes creadas a partir de pedidos de materiales y su estado operativo." : "Distribuye todos los ítems completos de un pedido aprobado entre las órdenes que atenderá Transporte."}</p></div></div>
    {feedback && <div className="transport-feedback-toast" role="status"><Toast visible variant="success" title="Órdenes registradas" description={feedback} onClose={() => setFeedback("")} /></div>}
    {mode === "list" ? <article className="card mt-24 standard-master-card">
      <div className="card-header"><div><h2 className="card-title">Órdenes registradas</h2><p className="card-subtitle">Selecciona una orden para consultar los documentos de su proceso.</p></div><div className="card-actions"><Chip preset="info">{filtered.length} {filtered.length === 1 ? "registro" : "registros"}</Chip><Button variant="outlined" onClick={() => exportTransportRows(filtered, exportColumns)}>Exportar</Button><Button onClick={openCreate}>Particionar pedido</Button></div></div>
      <div className="card-body"><div className="toolbar materials-toolbar"><TextInput id="transportSearch" label="Buscar orden" placeholder="Orden, pedido, documento o material" value={search} onChange={(value) => { setSearch(value); setPage(1); setExpandedId(null); }} /><SelectInput id="transportStatus" label="Estado" value={status} options={[{ value: "all", label: "Todos los estados" }, ...Object.entries(statusLabels).map(([value, label]) => ({ value, label }))]} onChange={(value) => { setStatus(value); setPage(1); setExpandedId(null); }} /><TableFilterReset active={Boolean(search.trim()) || status !== "all"} onReset={() => { setSearch(""); setStatus("all"); setPage(1); setExpandedId(null); }} /></div></div>
      <div className="table-wrap transport-orders-table-wrap" data-sial-component="feature-local-table" data-sial-source="HU546: fila expandible no soportada por Table 1.4.0"><table className="transport-orders-table"><thead><tr><th scope="col"><span className="sr-only">Desplegar</span></th><th scope="col">Orden de transporte</th><th scope="col">Finca</th><th scope="col">Documentos</th><th scope="col">Estado</th><th scope="col">Último evento</th><th scope="col">Acciones</th></tr></thead><tbody>
        {visibleRows.length ? visibleRows.map((item) => {
          const documents = relatedDocuments(item);
          const expanded = expandedId === item.id;
          const panelId = `transport-documents-${item.id}`;
          return <React.Fragment key={item.id}>
            <tr className={expanded ? "transport-order-row is-expanded" : "transport-order-row"} onClick={(event) => {
              if (event.target instanceof Element && event.target.closest("button, a")) return;
              setExpandedId(expanded ? null : item.id);
            }}>
              <td className="transport-disclosure-cell"><IconButton className="transport-order-toggle" variant="ghost" aria-expanded={expanded} aria-controls={expanded ? panelId : undefined} aria-label={`${expanded ? "Ocultar" : "Mostrar"} documentos de ${item.id}`} onClick={() => setExpandedId(expanded ? null : item.id)}>{expanded ? <ChevronDownIcon size={18} /> : <ChevronRightIcon size={18} />}</IconButton></td>
              <td><span className="materials-record-main"><strong>{item.id}</strong><span>{item.parentOrderId ? `${item.parentOrderId} · Partición ${item.partition}` : "Registro anterior"}</span></span></td>
              <td>{item.finca}</td><td>{documents.length} {documents.length === 1 ? "documento" : "documentos"}</td>
              <td><Chip preset={statusPreset(item.status)}>{statusLabels[item.status] || item.status}</Chip></td>
              <td>{String(item.audit || "—").replace("|", " · ")}</td>
              <td><IconButton variant="ghost" aria-label={`Ver detalle de ${item.id}`} title="Ver detalle" onClick={() => setSelectedId(item.id)}><ViewIcon /></IconButton></td>
            </tr>
            {expanded && <tr className="transport-documents-row"><td colSpan={7}><section className="transport-documents-panel" id={panelId} aria-label={`Documentos asociados a ${item.id}`}><div className="transport-documents-head"><div><h3>Documentos del proceso</h3><p>Consulta el PDF de muestra o abre la vista que gestiona cada etapa.</p></div><span>{documents.length} {documents.length === 1 ? "documento" : "documentos"}</span></div><div className="transport-document-list">{documents.map((document) => <div className="transport-document" key={`${document.kind}-${document.code}`}><div className="transport-document-main"><span className="transport-document-icon" aria-hidden="true"><DocumentFileIcon size={18} /></span><div className="transport-document-copy"><span className="transport-document-kind">{document.kind}</span><strong>{document.code}</strong><small>{document.destination}</small></div></div><div className="transport-document-actions"><Button variant="outlined" onClick={() => openDocumentPdf(item, document)}><ViewIcon size={15} /> Ver PDF</Button>{document.href ? <a className="transport-document-open" href={document.href} aria-label={`Abrir ${document.kind} ${document.code} en ${document.destination}`}>Abrir proceso <ArrowRightIcon size={14} aria-hidden="true" /></a> : <span className="transport-document-unavailable">Sin vista vinculada</span>}</div></div>)}</div></section></td></tr>}
          </React.Fragment>;
        }) : <tr><td colSpan={7} className="transport-orders-empty">No hay órdenes que coincidan con la búsqueda.</td></tr>}
      </tbody></table></div>
      <Pagination page={current} pageSize={size} total={filtered.length} pageSizeOptions={[10, 20, 50]} onPageChange={(value) => { setPage(value); setExpandedId(null); }} onPageSizeChange={(value) => { setSize(value); setPage(1); setExpandedId(null); }} />
    </article> : <div className="transport-create">
      <section className="card transport-source-card"><div className="card-body">
        <div className="transport-section-head"><h2>Pedido de origen</h2><span className="transport-section-note">Solo pedidos aprobados sin partición previa</span></div>
        <SelectInput id="transportSource" label="Pedido aprobado" required value={draft.sourceId} options={[{ value: "", label: "Seleccionar pedido" }, ...availableSources.map((item) => ({ value: item.id, label: `${item.id} · ${item.finca} · ${item.lines.length} ítems` }))]} onChange={chooseSource} />
        {errors.source && <p className="field-error" role="alert">{errors.source}</p>}
        {source && <div className="transport-source-meta"><span><strong>Documento:</strong> {source.document}</span><span><strong>Destino de referencia:</strong> {source.finca}</span><span><strong>Aprobado:</strong> {source.approved}</span></div>}
        {!availableSources.length && <p className="transport-help">Todos los pedidos de ejemplo ya fueron particionados. Las órdenes creadas permanecen en la vista de consulta.</p>}
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
            <div className="transport-groups"><div className="transport-groups-heading"><div><span className="transport-column-kicker">RESULTADO DE LA PARTICIÓN</span><h3>Órdenes en construcción</h3></div><Button variant="outlined" type="button" onClick={addGroup}>Agregar orden</Button></div>
              {draft.groups.map((group) => {
                const lines = source.lines.filter((line) => draft.allocation[line.id] === group.id);
                return <section className={"transport-group transport-drop-zone" + (lines.length ? " has-items" : "") + (dropZone === group.id ? " is-drop-target" : "")} key={group.id} aria-label={"Orden " + group.id} onDragOver={(event) => allowDrop(event, group.id)} onDragLeave={leaveDrop} onDrop={(event) => finishDrop(event, group.id)}><div className="transport-group-head"><div><span>ORDEN EN PREPARACIÓN</span><h4>Orden {group.id}</h4></div><strong>{lines.length} {lines.length === 1 ? "ítem" : "ítems"}</strong></div>
                  {pickedLineId && draft.allocation[pickedLineId] !== group.id && <div className="transport-drop-action"><Button variant="outlined" type="button" onClick={(event) => assign(pickedLineId, group.id, event.detail !== 0)}>Colocar aquí</Button></div>}
                  {lines.length ? <ul className="transport-assigned-list">{lines.map((line) => <li key={line.id}><button type="button" data-transport-line={line.id} className={"transport-drag-item" + (pickedLineId === line.id ? " is-picked" : "") + (dragLineId === line.id ? " is-dragging" : "")} {...draggableLineProps(line)}><span className="transport-item-copy"><strong>{line.material}</strong><small>{line.code} · {line.quantity.toLocaleString("es-CO")} {line.unit}</small></span></button></li>)}</ul> : <p className="transport-empty">Arrastra aquí los ítems que viajarán juntos.</p>}
                  <div className="transport-group-foot"><span>{lines.length ? "Los ítems se trasladarán juntos." : "Selecciona ítems del pedido para conformarla."}</span>{draft.groups.length > 2 && !lines.length && <Button variant="outlined" type="button" onClick={() => removeGroup(group.id)}>Eliminar orden vacía</Button>}</div>
                </section>;
              })}
            </div>
          </div>
          <div className={`transport-allocation-summary${pending.length ? "" : " is-complete"}`} aria-live="polite"><div><strong>{pending.length ? `${pending.length} ${pending.length === 1 ? "ítem pendiente" : "ítems pendientes"}` : "Distribución completa"}</strong><span>{pending.length ? "Asigna cada ítem completo a una de las órdenes." : `Los ${source.lines.length} ítems del pedido quedaron en ${draft.groups.filter((group) => Object.values(draft.allocation).includes(group.id)).length} órdenes.`}</span></div><span>{assigned.length} / {source.lines.length}</span></div>
        </div></section>
        <section className="card transport-details-card"><div className="card-body"><div className="transport-section-head"><h2>Datos de cada orden</h2><span className="transport-section-note">Se registrarán como creadas, pendientes de asignación operativa</span></div>
          {draft.groups.filter((group) => Object.values(draft.allocation).includes(group.id)).map((group) => <div className="transport-detail-group" key={group.id}><h3>Orden {group.id}</h3><div className="transport-fields">
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
      <div className="transport-create-actions"><Button variant="outlined" type="button" onClick={() => { setMode("list"); setDraft(initialDraft()); setErrors({}); }}>Cancelar</Button><Button type="button" onClick={savePartition} disabled={!source}>Crear órdenes de transporte</Button></div>
    </div>}
    {selected && <Drawer show onClose={() => setSelectedId(null)} title={selected.id} subtitle={selected.parentOrderId ? selected.parentOrderId + " · Partición " + selected.partition : "Registro anterior a la partición"} ariaLabel={"Detalle de " + selected.id} width="480px" data={[
      { label: "Estado", children: <Chip preset={statusPreset(selected.status)}>{statusLabels[selected.status] || selected.status}</Chip> },
      { label: "Documento origen", children: selected.document },
      { label: "Trayecto", children: <>{selected.origin || "No registrado"} → {selected.destination || selected.finca}</> },
      { label: "Fecha prevista", children: selected.window ? compactDate(selected.window) : "No registrada" },
      { label: "Modalidad", children: selected.modality === "tercero" ? "Tercero · " + selected.carrier : selected.modality === "propio" ? "Transporte propio" : "No registrada" },
      { label: "Responsable", children: selected.responsible || "No registrado" },
      { label: "Asignación", children: (selected.vehicle || "Pendiente") + " · " + (selected.driver || "Pendiente") }
    ]}>
      <div className="transport-drawer-extra"><h3>Ítems de la orden</h3>
        {selected.lines?.length ? <ul className="transport-detail-lines">{selected.lines.map((line) => <li key={line.id}><strong>{line.material}</strong><span>{line.code} · {line.quantity.toLocaleString("es-CO")} {line.unit}</span></li>)}</ul> : <p>{selected.quantity || selected.materials}</p>}
        <h3>Último evento</h3><p>{String(selected.audit || "Sin evento").replace("|", " · ")}</p>
      </div>
    </Drawer>}
    {pdfPreview && <Drawer show onClose={() => setPdfPreview(null)} title={`PDF · ${pdfPreview.code}`} subtitle={pdfPreview.kind} ariaLabel={`Vista previa PDF de ${pdfPreview.code}`} width="1000px"><div className="transport-pdf-preview"><p>Vista de muestra generada con datos de la propuesta. El PDF original no está adjunto.</p>{pdfUrl ? <><iframe title={`PDF de muestra ${pdfPreview.code}`} src={pdfUrl} /><a href={pdfUrl} target="_blank" rel="noopener noreferrer">Abrir PDF en otra pestaña <ArrowRightIcon size={14} aria-hidden="true" /></a></> : <p role="status">Preparando vista previa…</p>}</div></Drawer>}
  </>;
}
