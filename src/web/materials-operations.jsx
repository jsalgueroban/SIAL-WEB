import React, { useMemo, useState } from "react";
import { TableFilterReset } from "./table-filter-reset.jsx";
import {
  Button, CheckIcon, Chip, CloseIcon, Drawer, IconButton, NotificationIcon, Pagination, SelectInput, Table,
  TableRowActions, TextInput, Toast, ViewIcon
} from "@banasandev/banasan-ui";
import { exportRows } from "./materials-inventory.jsx";

const source = "@banasandev/banasan-ui";
const summaries = [
  { id: "RES-668-001", provider: "Cartonera Caribe", period: "28/06/2026", ordersCount: 2, materials: "Caja carton corrugado", quantities: "1920 unidades", destination: "Santa Isabel / El Retiro", status: "NOTIFICADO", generated: "28/06/2026 13:00", sent: "28/06/2026 13:04", source: "Resumen de pedidos" },
  { id: "RES-668-002", provider: "Estibas del Norte", period: "Semana 27 - 2026", ordersCount: 1, materials: "Estiba madera exportacion", quantities: "80 unidades", destination: "Finca Santa Isabel", status: "LISTO_DESPACHO", generated: "28/06/2026 13:10", sent: "Pendiente", source: "Resumen de pedidos" },
  { id: "RES-668-003", provider: "Suministros Banasan", period: "Semana 27 - 2026", ordersCount: 1, materials: "Separador de pallet", quantities: "35 paquetes", destination: "Finca Las Palmas", status: "PENDIENTE_VALIDACION", generated: "Pendiente", sent: "Pendiente", source: "Resumen de pedidos" }
];
const deliveries = [
  { id: "ENT-681-001", order: "OTI-546-001", document: "RPT-2026-0881", finca: "Finca Santa Isabel", driver: "Carlos Mendoza", receiver: "Laura Pineda", deliveredAt: "28/06/2026 15:40", status: "ENTREGADA", evidence: "Foto receptor + firma digital", pod: "POD-682-001", source: "Entrega de insumos", audit: "Entregar - transportista.app|28/06/2026 15:40" },
  { id: "ENT-681-002", order: "OTI-546-002", document: "REM-2026-0184", finca: "Finca El Retiro", driver: "Ana Ramirez", receiver: "Pendiente", deliveredAt: "Pendiente", status: "EN_TRANSITO", evidence: "Requerida para cierre", pod: "Pendiente", source: "Entrega de insumos", audit: "Salida - transporte|28/06/2026 13:20" },
  { id: "ENT-547-001", order: "OTI-546-003", document: "RES-2026-0045", finca: "Finca Las Palmas", driver: "Sin asignar", receiver: "Pendiente", deliveredAt: "Pendiente", status: "ASIGNADO", evidence: "Foto obligatoria", pod: "Pendiente", source: "Entrega de insumos", audit: "Asignar - almacen.pedidos|28/06/2026 12:12" }
];
const statusLabels = { NOTIFICADO: "Notificado", LISTO_DESPACHO: "Listo despacho", PENDIENTE_VALIDACION: "Pendiente validación", ENTREGADA: "Entregada", EN_TRANSITO: "En tránsito", ASIGNADO: "Asignado", INACTIVO: "Inactivo" };
const activeStatuses = new Set(["NOTIFICADO", "ENTREGADA"]);
function Status({ value }) {
  return <Chip preset={value === "INACTIVO" ? "inactive" : activeStatuses.has(value) ? "active" : "warning"}>{statusLabels[value] || value}</Chip>;
}
function RecordValue({ primary, secondary }) {
  return <span className="materials-record-main"><strong>{primary}</strong>{secondary && <span>{secondary}</span>}</span>;
}

const configs = {
  summaries: {
    eyebrow: "Materiales / Proveedores externos", title: "Resumen para proveedores externos",
    subtitle: "Consulta y comparte las necesidades de materiales con cada proveedor.",
    cardTitle: "Resúmenes digitales", cardSubtitle: "Revisa periodo, materiales, destino y estado del envío.",
    data: summaries, searchLabel: "Buscar proveedor, periodo o material", contextLabel: "Proveedor", contextKey: "provider",
    exportName: "resumen-proveedores", columns: [
      { key: "provider", header: "Proveedor", render: (item) => <RecordValue primary={item.provider} /> },
      { key: "period", header: "Periodo" }, { key: "ordersCount", header: "Órdenes" },
      { key: "materials", header: "Materiales / cantidades", render: (item) => <RecordValue primary={item.materials} secondary={item.quantities} /> },
      { key: "destination", header: "Destino" }, { key: "status", header: "Estado", render: (item) => <Status value={item.status} /> },
      { key: "generated", header: "Generación / envío", render: (item) => <RecordValue primary={`Generado: ${item.generated}`} secondary={`Enviado: ${item.sent}`} /> }
    ]
  },
  deliveries: {
    eyebrow: "Materiales / Entregas", title: "Seguimiento de entregas y POD",
    subtitle: "Consulta el avance de cada entrega de insumos.",
    cardTitle: "Entregas y evidencias POD", cardSubtitle: "Revisa quién recibió la carga y qué evidencia quedó registrada.",
    data: deliveries, searchLabel: "Buscar orden, documento o finca", contextLabel: "Finca", contextKey: "finca",
    exportName: "seguimiento-entregas", columns: [
      { key: "order", header: "Orden", render: (item) => <RecordValue primary={item.order} /> },
      { key: "document", header: "Documento" }, { key: "finca", header: "Finca" },
      { key: "driver", header: "Transportista" },
      { key: "receiver", header: "Recepción", render: (item) => <RecordValue primary={item.receiver} secondary={item.deliveredAt} /> },
      { key: "evidence", header: "Evidencia", render: (item) => <RecordValue primary={item.evidence} secondary={item.pod} /> },
      { key: "status", header: "Estado", render: (item) => <Status value={item.status} /> },
      { key: "audit", header: "Auditoría", render: (item) => item.audit.replace("|", " · ") }
    ]
  }
};

export function MaterialsOperations({ kind }) {
  const config = configs[kind];
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [context, setContext] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [overrides, setOverrides] = useState({});
  const records = config.data.map((item) => ({ ...item, status: overrides[item.id] || item.status }));
  const contexts = [...new Set(config.data.map((item) => item[config.contextKey]))];
  const filtered = useMemo(() => records.filter((item) => {
    const match = Object.values(item).join(" ").toLocaleLowerCase("es-CO").includes(search.trim().toLocaleLowerCase("es-CO"));
    return match && (status === "all" || item.status === status)
      && (context === "all" || item[config.contextKey] === context);
  }), [records, search, status, context]);
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / pageSize)));
  const rows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const columns = config.columns.map((column) => ({ ...column, render: column.render || ((item) => item[column.key]) }));
  const statusOptions = [...new Set(records.map((item) => item.status))].map((value) => ({ value, label: statusLabels[value] || value }));
  function communicate(record) {
    setFeedback(record ? `Resumen ${record.id} generado y enviado.` : "Resumen digital generado y enviado.");
  }
  return <>
    <p className="page-eyebrow">{config.eyebrow}</p>
    <div className="page-header"><div><h1 className="page-title">{config.title}</h1><p className="page-subtitle">{config.subtitle}</p></div></div>
    <article className="card mt-24 standard-master-card">
      <div className="card-header"><div><h2 className="card-title">{config.cardTitle}</h2><p className="card-subtitle">{config.cardSubtitle}</p></div>
        <div className="card-actions"><span data-sial-component="Chip" data-sial-source={source}><Chip preset="info" aria-live="polite">{filtered.length} {filtered.length === 1 ? "registro" : "registros"}</Chip></span>
          <span data-sial-component="Button" data-sial-source={source}><Button variant="outlined" onClick={() => exportRows(filtered, config.columns, config.exportName)}>Exportar</Button></span>
          {kind === "summaries" ? <Button onClick={() => communicate(null)}>Generar resumen</Button>
            : <Button variant="outlined" onClick={() => { location.href = "../Trazabilidad/auditoria-operativa.html"; }}>Ver auditoría</Button>}
        </div>
      </div>
      {feedback && <Toast visible variant="success" title="Resultado de la operación" description={feedback} onClose={() => setFeedback("")} />}
      <div className="card-body"><div className="toolbar materials-toolbar">
        <div data-sial-component="TextInput" data-sial-source={source}><TextInput id={`${kind}-search`} label={config.searchLabel} placeholder={config.searchLabel}
          value={search} onChange={(value) => { setSearch(value); setPage(1); }} /></div>
        <div data-sial-component="SelectInput" data-sial-source={source}><SelectInput id={`${kind}-status`} label="Estado" value={status}
          options={[{ value: "all", label: "Todos los estados" }, ...statusOptions]}
          onChange={(value) => { setStatus(value); setPage(1); }} /></div>
        <div data-sial-component="SelectInput" data-sial-source={source}><SelectInput id={`${kind}-context`} label={config.contextLabel} value={context}
          options={[{ value: "all", label: kind === "summaries" ? "Todos los proveedores" : "Todas las fincas" }, ...contexts.map((value) => ({ value, label: value }))]}
          onChange={(value) => { setContext(value); setPage(1); }} /></div>
      <TableFilterReset active={Boolean(search.trim()) || status !== "all" || context !== "all"} onReset={() => { setSearch(""); setStatus("all"); setContext("all"); setPage(1); }} /></div></div>
      <div data-sial-component="Table" data-sial-source={source}><Table columns={columns} data={rows} rowKey={(item) => item.id} minWidth="1050px"
        emptyState="No hay registros que coincidan con los filtros." actionsHeader="Acciones" actionsWidth="130px"
        actions={(item) => <TableRowActions label={`Acciones de ${item.id}`}>
          <IconButton variant="ghost" aria-label={`Ver detalle de ${item.id}`} title="Ver detalle" onClick={() => setSelected(item)}><ViewIcon/></IconButton>
          {kind === "summaries" && <IconButton variant="ghost" aria-label={`Generar y compartir ${item.id}`} title="Generar y compartir" onClick={() => communicate(item)}><NotificationIcon/></IconButton>}
          {kind === "summaries" && <IconButton variant="ghost" aria-label={`${item.status === "INACTIVO" ? "Activar" : "Inactivar"} resumen ${item.id}`}
            title={item.status === "INACTIVO" ? "Activar resumen" : "Inactivar resumen"}
            onClick={() => { setOverrides((previous) => ({ ...previous, [item.id]: item.status === "INACTIVO" ? config.data.find((record) => record.id === item.id).status : "INACTIVO" }));
              setFeedback(`Resumen ${item.id} ${item.status === "INACTIVO" ? "activado" : "inactivado"}.`); }}>
            {item.status === "INACTIVO" ? <CheckIcon/> : <CloseIcon/>}</IconButton>}
        </TableRowActions>} /></div>
      <div data-sial-component="Pagination" data-sial-source={source}><Pagination page={currentPage} pageSize={pageSize} total={filtered.length} pageSizeOptions={[2, 10, 20]}
        onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} /></div>
    </article>
    {selected && <Drawer show onClose={() => setSelected(null)} title={kind === "summaries" ? "Detalle del resumen" : "Detalle de entrega"}
      subtitle={selected.id} data={Object.entries(selected).map(([key, value]) => ({
        label: config.columns.find((column) => column.key === key)?.header || key,
        children: key === "status" ? <Status value={value} /> : String(value)
      }))} />}
  </>;
}

const dashboardGroups = [
  { title: "Configuración", links: [["Catálogo de materiales", "gestion-materiales.html"], ["Categorías de pedido", "categorias-pedido.html"], ["Recetas de materiales", "recetas-materiales.html"], ["Proveedores", "gestion-proveedores.html"], ["Reglas documentales", "reglas-documentales.html"]] },
  { title: "Pedidos e inventario", links: [["Gestionar pedidos", "gestion-pedidos-materiales.html"], ["Seguimiento de pedidos", "seguimiento-pedidos-finca.html"], ["Aprobar pedidos", "aprobacion-pedidos-materiales.html"], ["Pedidos recurrentes", "pedidos-recurrentes.html"], ["Inventario de materiales", "inventario-materiales-finca.html"], ["Movimientos de inventario", "movimientos-inventario.html"], ["Inventario de pallets", "inventario-pallets.html"]] },
  { title: "Despacho y seguimiento", links: [["Órdenes de transporte", "ordenes-transporte-insumos.html"], ["Resumen para proveedores", "resumen-proveedores.html"], ["Entregas y evidencias", "seguimiento-entregas.html"], ["Trazabilidad de pedidos", "trazabilidad-pedido.html"]] }
];
export function MaterialsDashboard() {
  return <>
    <p className="page-eyebrow">Gestión / Materiales y suministros</p>
    <div className="page-header"><div><h1 className="page-title">Materiales y suministros</h1>
      <p className="page-subtitle">Centro operativo para pedidos, stock, órdenes, proveedores, entregas y trazabilidad documental.</p></div></div>
    <article className="card materials-navigation-card"><div className="card-header"><div><h2 className="card-title">Operación de materiales</h2>
      <p className="card-subtitle">Selecciona la actividad que necesitas gestionar o consultar.</p></div></div>
      <div className="card-body materials-navigation-grid">{dashboardGroups.map((group, index) => <section className="materials-navigation-group" key={group.title} aria-labelledby={`materials-group-${index}`}>
        <h3 id={`materials-group-${index}`}>{group.title}</h3>{group.links.map(([label, href]) => <a key={href} className={`btn ${label === "Gestionar pedidos" ? "btn-primary" : "btn-secondary"}`} href={href}>{label}</a>)}
      </section>)}</div></article>
  </>;
}
