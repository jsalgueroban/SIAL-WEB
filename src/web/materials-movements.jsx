import React, { useMemo, useState } from "react";
import { TableFilterReset } from "./table-filter-reset.jsx";
import {
  Button, Chip, DateInput, Drawer, IconButton, Pagination, SelectInput,
  Table, TableRowActions, TextInput, ViewIcon
} from "@banasandev/banasan-ui";
import { exportRows } from "./materials-inventory.jsx";

const movements = [
  { id: "MOV-8821", sapMaterial: "101279", material: "Caja carton corrugado", type: "ENTRADA", quantity: 1400, unit: "unidad", date: "2026-06-28", dateLabel: "28/06/2026 07:40", reason: "Recepción de proveedor", user: "almacen.santa-isabel", finca: "Finca Santa Isabel", status: "ACTIVO", source: "Inventario de materiales", audit: "Registrar entrada - almacen.santa-isabel|28/06/2026 07:40" },
  { id: "MOV-8814", sapMaterial: "101279", material: "Caja carton corrugado", type: "AJUSTE", quantity: -12, unit: "unidad", date: "2026-06-28", dateLabel: "28/06/2026 07:50", reason: "Daño identificado en conteo", user: "almacen.el-retiro", finca: "Finca El Retiro", status: "REVISION", source: "Inventario de materiales", audit: "Registrar ajuste - almacen.el-retiro|28/06/2026 07:50" },
  { id: "MOV-8808", sapMaterial: "1970", material: "Estiba madera exportacion", type: "SALIDA", quantity: -80, unit: "unidad", date: "2026-06-28", dateLabel: "28/06/2026 06:58", reason: "Despacho de orden OTI-546-001", user: "supervisor.almacen", finca: "Finca Santa Isabel", status: "ACTIVO", source: "Inventario de materiales", audit: "Registrar salida - supervisor.almacen|28/06/2026 06:58" },
  { id: "MOV-8792", sapMaterial: "5418", material: "Separador de pallet", type: "AJUSTE", quantity: -3, unit: "paquete", date: "2026-06-27", dateLabel: "27/06/2026 18:12", reason: "Conteo físico pendiente de validación", user: "almacen.las-palmas", finca: "Finca Las Palmas", status: "REVISION", source: "Inventario de materiales", audit: "Registrar ajuste - almacen.las-palmas|27/06/2026 18:12" }
];
const dayString = (date) => date instanceof Date && !Number.isNaN(date.getTime())
  ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` : "";
const localDate = (value) => value ? new Date(...value.split("-").map((part, index) => Number(part) - (index === 1 ? 1 : 0))) : null;

export function MaterialsMovements() {
  const [search, setSearch] = useState(() => new URLSearchParams(location.search).get("material") || "");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState(null);
  const filtered = useMemo(() => movements.filter((item) => {
    const query = search.trim().toLocaleLowerCase("es-CO");
    return Object.values(item).join(" ").toLocaleLowerCase("es-CO").includes(query)
      && (status === "all" || (item.status === "ACTIVO" ? "active" : "warning") === status)
      && (type === "all" || item.type.toLowerCase() === type)
      && (!from || item.date >= from) && (!to || item.date <= to);
  }), [search, status, type, from, to]);
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / pageSize)));
  const rows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const exportColumns = [
    { key: "id", header: "Movimiento" }, { key: "sapMaterial", header: "Código SAP" },
    { key: "material", header: "Material" }, { key: "type", header: "Tipo" },
    { key: "quantity", header: "Cantidad" }, { key: "unit", header: "Unidad" },
    { key: "dateLabel", header: "Fecha" }, { key: "reason", header: "Motivo" },
    { key: "user", header: "Usuario" }, { key: "status", header: "Estado" }
  ];
  const columns = [
    { key: "id", header: "Movimiento / SAP", render: (item) => <span className="materials-record-main"><strong>{item.id}</strong><span>{item.sapMaterial}</span></span> },
    { key: "material", header: "Material", render: (item) => item.material },
    { key: "type", header: "Tipo", render: (item) => <Chip preset={item.type === "AJUSTE" ? "warning" : "info"}>{item.type}</Chip> },
    { key: "quantity", header: "Cantidad", render: (item) => <strong>{item.quantity} {item.unit}</strong> },
    { key: "dateLabel", header: "Fecha", render: (item) => item.dateLabel },
    { key: "reason", header: "Motivo", render: (item) => item.reason },
    { key: "user", header: "Usuario", render: (item) => item.user },
    { key: "status", header: "Estado", render: (item) => <Chip preset={item.status === "ACTIVO" ? "active" : "warning"}>{item.status === "ACTIVO" ? "Activo" : "Revisión"}</Chip> }
  ];
  return <>
    <p className="page-eyebrow">Materiales / Inventario</p>
    <div className="page-header"><div><h1 className="page-title">Movimientos de inventario</h1>
      <p className="page-subtitle">Historial auditable de entradas, salidas y ajustes de materiales.</p></div></div>
    <article className="card mt-24 standard-master-card">
      <div className="card-header"><div><h2 className="card-title">Historial de movimientos</h2>
        <p className="card-subtitle">Entradas, salidas y ajustes por material, tipo y rango de fechas.</p></div>
        <div className="card-actions materials-inventory-actions"><span data-sial-component="Chip" data-sial-source="@banasandev/banasan-ui"><Chip preset="info" aria-live="polite">{filtered.length} {filtered.length === 1 ? "registro" : "registros"}</Chip></span>
          <span data-sial-component="Button" data-sial-source="@banasandev/banasan-ui"><Button variant="outlined" onClick={() => exportRows(filtered.map((item) => ({ ...item, status: item.status === "ACTIVO" ? "Activo" : "Revisión" })), exportColumns, "movimientos-inventario")}>Exportar</Button></span>
        </div></div>
      <div className="card-body"><div className="toolbar materials-toolbar">
        <div data-sial-component="TextInput" data-sial-source="@banasandev/banasan-ui"><TextInput id="movement-search" label="Buscar movimiento, material o usuario" placeholder="Movimiento, material o usuario"
          value={search} onChange={(value) => { setSearch(value); setPage(1); }} /></div>
        <div data-sial-component="SelectInput" data-sial-source="@banasandev/banasan-ui"><SelectInput id="movement-status" label="Estado" value={status} options={[
          { value: "all", label: "Todos los estados" }, { value: "active", label: "Activos" },
          { value: "warning", label: "Pendientes / revisión" }
        ]} onChange={(value) => { setStatus(value); setPage(1); }} /></div>
        <div data-sial-component="SelectInput" data-sial-source="@banasandev/banasan-ui"><SelectInput id="movement-type" label="Tipo de movimiento" value={type} options={[
          { value: "all", label: "Todos los tipos" }, { value: "entrada", label: "Entradas" },
          { value: "salida", label: "Salidas" }, { value: "ajuste", label: "Ajustes" }
        ]} onChange={(value) => { setType(value); setPage(1); }} /></div>
      </div><div className="materials-date-range">
        <DateInput id="movement-from" label="Desde" value={localDate(from)} onChange={(value) => { setFrom(dayString(value)); setPage(1); }} />
        <DateInput id="movement-to" label="Hasta" value={localDate(to)} onChange={(value) => { setTo(dayString(value)); setPage(1); }} />
        <TableFilterReset active={Boolean(search.trim()) || status !== "all" || type !== "all" || Boolean(from) || Boolean(to)} onReset={() => { setSearch(""); setStatus("all"); setType("all"); setFrom(""); setTo(""); setPage(1); }} />
      </div></div>
      <div data-sial-component="Table" data-sial-source="@banasandev/banasan-ui"><Table columns={columns} data={rows} rowKey={(item) => item.id} minWidth="1000px"
        emptyState="No hay registros que coincidan con los filtros." actionsHeader="Acciones" actionsWidth="120px"
        actions={(item) => <TableRowActions label={`Acciones de ${item.id}`}>
          <IconButton variant="ghost" aria-label={`Visualizar detalle de ${item.id}`} title="Visualizar detalle" onClick={() => setSelected(item)}><ViewIcon/></IconButton>
        </TableRowActions>} /></div>
      <div data-sial-component="Pagination" data-sial-source="@banasandev/banasan-ui"><Pagination page={currentPage} pageSize={pageSize} total={filtered.length} pageSizeOptions={[2, 10, 20]}
        onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} /></div>
    </article>
    {selected && <Drawer show onClose={() => setSelected(null)} title="Detalle de movimiento"
      subtitle={`${selected.id} · ${selected.sapMaterial}`}
      data={[
        ["Movimiento", selected.id], ["Código SAP", selected.sapMaterial], ["Material", selected.material],
        ["Tipo", selected.type], ["Cantidad", `${selected.quantity} ${selected.unit}`], ["Fecha", selected.dateLabel],
        ["Finca", selected.finca], ["Motivo", selected.reason], ["Usuario", selected.user],
        ["Estado", <Chip preset={selected.status === "ACTIVO" ? "active" : "warning"}>{selected.status === "ACTIVO" ? "Activo" : "Revisión"}</Chip>],
        ["Fuente", selected.source], ["Auditoría", selected.audit?.replace("|", " · ")]
      ].map(([label, value]) => ({ label, children: value || "No registrado" }))} />}
  </>;
}
