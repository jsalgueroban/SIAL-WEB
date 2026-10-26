import React, { useMemo, useState } from "react";
import {
  Button, Chip, Drawer, IconButton, Pagination, SelectInput, Table,
  TableRowActions, TextInput, ViewIcon
} from "@banasandev/banasan-ui";
import { TableFilterReset } from "./table-filter-reset.jsx";

const source = "@banasandev/banasan-ui";
const stock = [
  { id: "STK-001", finca: "Finca Santa Isabel", sapMaterial: "101279", material: "Caja carton corrugado", available: 1280, reserved: 120, total: 1400, damaged: 0, unit: "unidad", updated: "28/06/2026 07:40", lastMovement: "Entrada por recepción · MOV-8821", status: "ACTIVO", coverage: "2.4 dias", source: "Movimientos de inventario" },
  { id: "STK-002", finca: "Finca El Retiro", sapMaterial: "101279", material: "Caja carton corrugado", available: 360, reserved: 40, total: 412, damaged: 12, unit: "unidad", updated: "28/06/2026 07:50", lastMovement: "Ajuste por daño · MOV-8814", status: "REVISION", coverage: "0.8 dias", source: "Movimientos de inventario" },
  { id: "STK-003", finca: "Finca Santa Isabel", sapMaterial: "1970", material: "Estiba madera exportacion", available: 94, reserved: 12, total: 106, damaged: 2, unit: "unidad", updated: "28/06/2026 06:58", lastMovement: "Salida a orden OTI-546-001", status: "ACTIVO", coverage: "3.1 dias", source: "Movimientos de inventario" },
  { id: "STK-004", finca: "Finca Las Palmas", sapMaterial: "5418", material: "Separador de pallet", available: 18, reserved: 0, total: 21, damaged: 3, unit: "paquete", updated: "27/06/2026 18:12", lastMovement: "Conteo pendiente · MOV-8792", status: "REVISION", coverage: "Stock bajo", source: "Conteo pendiente" }
];
const pallets = [
  { id: "PAL-559-001", reference: "BAN-REF-001", finca: "Finca Santa Isabel", pallets: 18, boxesLeft: 0, destination: "Contenedor SIALU1234567", status: "ACTIVO", type: "Completo", source: "Registro de pallets" },
  { id: "PAL-559-002", reference: "BAN-REF-004", finca: "Finca El Retiro", pallets: 9, boxesLeft: 0, destination: "ZE Puerto Norte", status: "ACTIVO", type: "Completo", source: "Registro de pallets" },
  { id: "PAL-560-001", reference: "BAN-REF-011", finca: "Finca Las Palmas", pallets: 1, boxesLeft: 14, destination: "Consolidacion posterior", status: "REVISION", type: "Mocho", source: "Registro de pallets" },
  { id: "PAL-560-002", reference: "BAN-REF-014", finca: "Finca Santa Isabel", pallets: 1, boxesLeft: 8, destination: "Consolidacion posterior", status: "REVISION", type: "Mocho", source: "Registro de pallets" }
];

function Status({ value }) {
  return <Chip preset={value === "ACTIVO" ? "active" : "warning"}>{value === "ACTIVO" ? "Activo" : "Revisión"}</Chip>;
}

export function exportRows(rows, columns, filename) {
  const quote = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const csv = [columns.map((column) => quote(column.header)).join(","),
    ...rows.map((row) => columns.map((column) => quote(row[column.key])).join(","))].join("\r\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${filename}.csv`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function MaterialsInventory({ kind }) {
  const isStock = kind === "stock";
  const data = isStock ? stock : pallets;
  const title = isStock ? "Inventario de materiales" : "Inventario de pallets";
  const description = isStock
    ? "Consulta existencias disponibles, reservadas y totales por material y finca."
    : "Pallets completos y mochos para planificar cargues y consolidaciones.";
  const [search, setSearch] = useState(() => isStock ? new URLSearchParams(location.search).get("material") || "" : "");
  const [status, setStatus] = useState("all");
  const [context, setContext] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState(null);

  const contextKey = isStock ? "finca" : "type";
  const contexts = [...new Set(data.map((item) => item[contextKey]))];
  const filtered = useMemo(() => data.filter((item) => {
    const text = Object.values(item).join(" ").toLocaleLowerCase("es-CO");
    const query = search.trim().toLocaleLowerCase("es-CO");
    const state = item.status === "ACTIVO" ? "active" : "warning";
    return text.includes(query) && (status === "all" || status === state)
      && (context === "all" || context === item[contextKey]);
  }), [data, search, status, context]);
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / pageSize)));
  const rows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const exportColumns = isStock ? [
    { key: "sapMaterial", header: "Código SAP" }, { key: "finca", header: "Finca" },
    { key: "material", header: "Material" }, { key: "unit", header: "Unidad" },
    { key: "available", header: "Disponible" }, { key: "reserved", header: "Reservado" },
    { key: "total", header: "Total" }, { key: "lastMovement", header: "Último movimiento" },
    { key: "updated", header: "Actualización" }
  ] : [
    { key: "reference", header: "Referencia" }, { key: "type", header: "Tipo" },
    { key: "finca", header: "Finca origen" }, { key: "pallets", header: "Pallets" },
    { key: "boxesLeft", header: "Cajas restantes" }, { key: "destination", header: "Destino" },
    { key: "status", header: "Estado" }, { key: "source", header: "Fuente" }
  ];
  const columns = isStock ? [
    { key: "sapMaterial", header: "Código SAP / finca", width: "18%", render: (item) => <span className="materials-record-main"><strong>{item.sapMaterial}</strong><span>{item.finca}</span></span> },
    { key: "material", header: "Material" }, { key: "unit", header: "Unidad" },
    { key: "available", header: "Disponible", render: (item) => <strong>{item.available}</strong> },
    { key: "reserved", header: "Reservado" },
    { key: "total", header: "Total", render: (item) => <><strong>{item.total}</strong><br/><span className="muted">Informado por saldo</span></> },
    { key: "lastMovement", header: "Último movimiento / actualización", render: (item) => <>{item.lastMovement}<br/><span className="muted">{item.updated}</span></> }
  ] : [
    { key: "reference", header: "Referencia", width: "17%", render: (item) => <strong>{item.reference}</strong> },
    { key: "type", header: "Tipo" }, { key: "finca", header: "Finca origen" },
    { key: "pallets", header: "Pallets" }, { key: "boxesLeft", header: "Cajas restantes" },
    { key: "destination", header: "Destino" },
    { key: "status", header: "Estado", render: (item) => <Status value={item.status} /> },
    { key: "updated", header: "Auditoría", render: () => <span className="muted">Actualizar - operacion.movilidad<br/>28/06/2026 08:30</span> }
  ];

  return <>
    <p className="page-eyebrow">Materiales / {isStock ? "Inventario" : "Pallets"}</p>
    <div className="page-header"><div><h1 className="page-title">{title}</h1><p className="page-subtitle">{description}</p></div></div>
    <article className="card mt-24 standard-master-card">
      <div className="card-header"><div><h2 className="card-title">{isStock ? "Existencias de materiales" : "Pallets completos e incompletos"}</h2>
        <p className="card-subtitle">{isStock ? "Inventario por finca con saldo disponible, reservado y total informado." : "Inventario ZE para planificar cargue de contenedores y consolidación posterior."}</p></div>
        <div className="card-actions"><span data-sial-component="Chip" data-sial-source={source}><Chip preset="info" aria-live="polite">{filtered.length} {filtered.length === 1 ? "registro" : "registros"}</Chip></span>
          <span data-sial-component="Button" data-sial-source={source}><Button variant="outlined" onClick={() => exportRows(filtered, exportColumns, isStock ? "inventario-materiales" : "inventario-pallets")}>Exportar</Button></span>
          {!isStock && <Button variant="outlined" onClick={() => { location.href = "../pallets/armar-pallet.html"; }}>Ver flujo móvil</Button>}
        </div>
      </div>
      <div className="card-body"><div className="toolbar materials-toolbar">
        <div data-sial-component="TextInput" data-sial-source={source}><TextInput id={`${kind}-search`} label={isStock ? "Buscar material, código SAP o finca" : "Buscar referencia, finca o destino"}
          placeholder={isStock ? "Material, código SAP o finca" : "Referencia, finca o destino"} value={search}
          onChange={(value) => { setSearch(value); setPage(1); }} /></div>
        <div data-sial-component="SelectInput" data-sial-source={source}><SelectInput id={`${kind}-status`} label="Estado" value={status} options={[
          { value: "all", label: "Todos los estados" }, { value: "active", label: "Activos" },
          { value: "warning", label: "Pendientes / revisión" }
        ]} onChange={(value) => { setStatus(value); setPage(1); }} /></div>
        <div data-sial-component="SelectInput" data-sial-source={source}><SelectInput id={`${kind}-context`} label={isStock ? "Finca" : "Tipo de pallet"} value={context}
          options={[{ value: "all", label: isStock ? "Todas las fincas" : "Todos los tipos" }, ...contexts.map((value) => ({ value, label: value }))]}
          onChange={(value) => { setContext(value); setPage(1); }} /></div>
      <TableFilterReset active={Boolean(search.trim()) || status !== "all" || context !== "all"} onReset={() => { setSearch(""); setStatus("all"); setContext("all"); setPage(1); }} /></div></div>
      <div data-sial-component="Table" data-sial-source={source}><Table columns={columns.map((column) => ({ ...column, render: column.render || ((item) => item[column.key]) }))}
        data={rows} rowKey={(item) => item.id} minWidth={isStock ? "1050px" : "1100px"}
        emptyState="No hay registros que coincidan con los filtros." actionsHeader="Acciones" actionsWidth="120px"
        actions={(item) => <TableRowActions label={`Acciones de ${item.id}`}>
          <IconButton variant="ghost" aria-label={`Visualizar detalle de ${item.id}`} title="Visualizar detalle" onClick={() => setSelected(item)}><ViewIcon/></IconButton>
          {isStock && <IconButton variant="ghost" aria-label={`Ver movimientos del material ${item.sapMaterial}`} title="Ver movimientos del material" onClick={() => { location.href = `movimientos-inventario.html?material=${encodeURIComponent(item.sapMaterial)}`; }}><ViewIcon/></IconButton>}
        </TableRowActions>} /></div>
      <div data-sial-component="Pagination" data-sial-source={source}><Pagination page={currentPage} pageSize={pageSize} total={filtered.length} pageSizeOptions={[2, 10, 20]}
        onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} /></div>
    </article>
    {selected && <Drawer show onClose={() => setSelected(null)} title={isStock ? "Detalle de inventario" : "Detalle del registro"}
      subtitle={selected.source} data={Object.entries(selected).map(([key, value]) => ({
        label: exportColumns.find((item) => item.key === key)?.header || key,
        children: key === "status" ? <Status value={value} /> : String(value)
      }))} />}
  </>;
}
