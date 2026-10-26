import React, { useEffect, useMemo, useState } from "react";
import {
  Button, CheckIcon, Chip, CloseIcon, Drawer, EditIcon, IconButton,
  Pagination, SelectInput, Table, TableRowActions, TextInput, Toast, ViewIcon
} from "@banasandev/banasan-ui";
import { exportRows } from "./materials-inventory.jsx";
import { TableFilterReset } from "./table-filter-reset.jsx";

const source = "@banasandev/banasan-ui";
const supplierSeed = [
  { id: "PRO-001", code: "PRV-CAR-01", name: "Cartonera Caribe", type: "Cartonera", contact: "operaciones@cartonera.example", status: "ACTIVO", audit: "Crear - compras.sial|08/06/2026 11:05" },
  { id: "PRO-002", code: "PRV-EST-01", name: "Estibas del Norte", type: "Estibadero", contact: "despachos@estibas.example", status: "ACTIVO", audit: "Crear - compras.sial|09/06/2026 12:18" },
  { id: "PRO-003", code: "PRV-ETQ-01", name: "Etiquetas del Caribe", type: "Proveedor material", contact: "coordinacion@etiquetas.example", status: "REVISION", audit: "Revisión - compras.sial|21/06/2026 08:40" }
];
const ruleSeed = [
  { id: "REG-667-001", code: "DOC-RPT", name: "Pedido semanal validado", result: "RPT", condition: "Pedido base o sugerido con stock confirmado", status: "ACTIVO", audit: "Crear - admin.documental|25/06/2026 09:00" },
  { id: "REG-667-002", code: "DOC-REM", name: "Despacho adicional", result: "Remisión", condition: "Pedido adicional validado para envío físico", status: "ACTIVO", audit: "Crear - admin.documental|25/06/2026 09:12" },
  { id: "REG-667-003", code: "DOC-RES", name: "Material reservado", result: "Reserva", condition: "Stock apartado sin despacho inmediato", status: "REVISION", audit: "Editar - admin.documental|28/06/2026 08:00" }
];
const configs = {
  suppliers: {
    title: "Gestión de proveedores", eyebrow: "Materiales / Proveedores", subtitle: "Maestra de proveedores externos para coordinar resúmenes y entregas.",
    cardTitle: "Proveedores registrados", cardSubtitle: "Consulta, registro corto, estado y auditoría.",
    data: supplierSeed, contextKey: "type", contextLabel: "Tipo de proveedor", allLabel: "Todos los tipos",
    searchLabel: "Buscar proveedor, código o contacto", button: "Nuevo proveedor", save: "Guardar proveedor", noun: "proveedor", filename: "proveedores",
    fields: [["code", "Código", "PRV-NUE-01"], ["name", "Nombre proveedor", "Proveedor externo"], ["type", "Tipo", "Cartonera"], ["contact", "Contacto", "contacto@proveedor.example"]],
    columns: [["code", "Código"], ["name", "Proveedor"], ["type", "Tipo"], ["contact", "Contacto"]]
  },
  rules: {
    title: "Reglas documentales", eyebrow: "Materiales / Reglas", subtitle: "Clasificación automática para RPT, remisión y reserva.",
    cardTitle: "Reglas documentales", cardSubtitle: "Consulta la condición y el resultado aplicado a cada documento logístico.",
    data: ruleSeed, contextKey: "result", contextLabel: "Resultado", allLabel: "Todos los resultados",
    searchLabel: "Buscar regla, código o resultado", button: "Nueva regla", save: "Guardar regla", noun: "regla", filename: "reglas-documentales",
    fields: [["code", "Código", "DOC-NUE"], ["name", "Nombre regla", "Regla de clasificación"], ["result", "Resultado", "RPT"], ["condition", "Condición", "Pedido validado con stock disponible"]],
    columns: [["code", "Código"], ["name", "Regla"], ["result", "Resultado"], ["condition", "Condición"]]
  }
};
const initialForm = (config) => Object.fromEntries(config.fields.map(([key]) => [key, ""]));

export function MaterialsCatalog({ kind }) {
  const config = configs[kind];
  const [records, setRecords] = useState(config.data);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [context, setContext] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(() => initialForm(config));
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState("");
  useEffect(() => {
    if (formOpen) document.getElementById(`${kind}-${config.fields[0][0]}`)?.focus();
  }, [formOpen, config, kind]);
  const contexts = [...new Set(records.map((item) => item[config.contextKey]))];
  const filtered = useMemo(() => records.filter((item) =>
    Object.values(item).join(" ").toLocaleLowerCase("es-CO").includes(search.trim().toLocaleLowerCase("es-CO"))
    && (status === "all" || item.status === status)
    && (context === "all" || item[config.contextKey] === context)
  ), [records, search, status, context, config]);
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / pageSize)));
  const rows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const columns = [...config.columns.map(([key, header]) => ({ key, header, render: (item) => item[key] })),
    { key: "status", header: "Estado", render: (item) => <Chip preset={item.status === "ACTIVO" ? "active" : item.status === "INACTIVO" ? "inactive" : "warning"}>{item.status === "ACTIVO" ? "Activo" : item.status === "INACTIVO" ? "Inactivo" : "Revisión"}</Chip> },
    { key: "audit", header: "Auditoría", render: (item) => item.audit.replace("|", " · ") }];
  function openForm(item = null) {
    setEditing(item?.id || null);
    setForm(item ? Object.fromEntries(config.fields.map(([key]) => [key, item[key]])) : initialForm(config));
    setErrors({});
    setFormOpen(true);
  }
  function closeForm() { setFormOpen(false); setEditing(null); setErrors({}); }
  function submit(event) {
    event.preventDefault();
    const nextErrors = Object.fromEntries(config.fields.filter(([key]) => !String(form[key] || "").trim()).map(([key]) => [key, "El campo es requerido."]));
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); document.getElementById(`${kind}-${Object.keys(nextErrors)[0]}`)?.focus(); return; }
    // La propuesta conserva el comportamiento local: no persiste en el sistema real.
    if (editing) setRecords((previous) => previous.map((item) => item.id === editing ? { ...item, ...form, audit: `Editar registro|${new Date().toLocaleString("es-CO")}` } : item));
    setFeedback(`Datos de ${config.noun} actualizados.`);
    closeForm();
  }
  function toggle(item) {
    const next = item.status === "INACTIVO" ? "ACTIVO" : "INACTIVO";
    setRecords((previous) => previous.map((record) => record.id === item.id ? { ...record, status: next, audit: `${next === "ACTIVO" ? "Activar" : "Inactivar"} registro|${new Date().toLocaleString("es-CO")}` } : record));
    setFeedback(`${config.noun === "regla" ? "Regla" : "Proveedor"} ${item.code} ${next === "ACTIVO" ? "activado" : "inactivado"}.`);
  }
  return <>
    <p className="page-eyebrow">{config.eyebrow}</p><div className="page-header"><div><h1 className="page-title">{config.title}</h1><p className="page-subtitle">{config.subtitle}</p></div></div>
    <article className="card mt-24 standard-master-card"><div className="card-header"><div><h2 className="card-title">{config.cardTitle}</h2><p className="card-subtitle">{config.cardSubtitle}</p></div>
      <div className="card-actions"><span data-sial-component="Chip" data-sial-source={source}><Chip preset="info">{filtered.length} {filtered.length === 1 ? "registro" : "registros"}</Chip></span>
        <span data-sial-component="Button" data-sial-source={source}><Button variant="outlined" onClick={() => exportRows(filtered, [...config.columns.map(([key, header]) => ({ key, header })), { key: "status", header: "Estado" }], config.filename)}>Exportar</Button></span>
        <Button onClick={() => openForm()}>{config.button}</Button></div></div>
      {feedback && <Toast visible variant="success" title="Resultado de la operación" description={feedback} onClose={() => setFeedback("")} />}
      <div className="card-body"><div className="toolbar materials-toolbar">
        <div data-sial-component="TextInput" data-sial-source={source}><TextInput id={`${kind}-search`} label={config.searchLabel} placeholder={config.searchLabel} value={search}
          onChange={(value) => { setSearch(value); setPage(1); }} /></div>
        <div data-sial-component="SelectInput" data-sial-source={source}><SelectInput id={`${kind}-status`} label="Estado" value={status}
          options={[{ value: "all", label: "Todos los estados" }, { value: "ACTIVO", label: "Activo" }, { value: "REVISION", label: "Revisión" }, { value: "INACTIVO", label: "Inactivo" }]}
          onChange={(value) => { setStatus(value); setPage(1); }} /></div>
        <div data-sial-component="SelectInput" data-sial-source={source}><SelectInput id={`${kind}-context`} label={config.contextLabel} value={context}
          options={[{ value: "all", label: config.allLabel }, ...contexts.map((value) => ({ value, label: value }))]}
          onChange={(value) => { setContext(value); setPage(1); }} /></div>
        <TableFilterReset active={Boolean(search.trim()) || status !== "all" || context !== "all"} onReset={() => { setSearch(""); setStatus("all"); setContext("all"); setPage(1); }} />
      </div>
      {formOpen && <section className="inline-form-panel materials-inline-form" aria-label={editing ? `Editar ${config.noun}` : config.button}>
        <div className="form-heading"><h3>{editing ? `Editar ${config.noun}` : config.button}</h3><p>Completa los datos requeridos y conserva el contexto de la bandeja.</p></div>
        <div className="form-body"><form onSubmit={submit} noValidate><div className="grid">{config.fields.map(([key, label, placeholder]) => <div className="field span-3" key={key}>
          <TextInput id={`${kind}-${key}`} label={label} placeholder={placeholder} value={form[key]} required
            onChange={(value) => { setForm((previous) => ({ ...previous, [key]: value })); setErrors((previous) => ({ ...previous, [key]: "" })); }} />
          {errors[key] && <span className="field-error" role="alert">{errors[key]}</span>}
        </div>)}</div><div className="form-actions"><Button variant="outlined" type="button" onClick={closeForm}>Cancelar</Button><Button type="button" onClick={submit}>{config.save}</Button></div></form></div>
      </section>}</div>
      <div data-sial-component="Table" data-sial-source={source}><Table columns={columns} data={rows} rowKey={(item) => item.id} minWidth="960px" emptyState="No hay registros que coincidan con los filtros."
        actionsHeader="Acciones" actionsWidth="130px" actions={(item) => <TableRowActions label={`Acciones de ${item.code}`}>
          <IconButton variant="ghost" aria-label={`Ver detalle de ${item.code}`} title="Ver detalle" onClick={() => setSelected(item)}><ViewIcon/></IconButton>
          <IconButton variant="ghost" aria-label={`Editar ${item.code}`} title="Editar" onClick={() => openForm(item)}><EditIcon/></IconButton>
          <IconButton variant="ghost" aria-label={`${item.status === "INACTIVO" ? "Activar" : "Inactivar"} ${item.code}`} title={item.status === "INACTIVO" ? "Activar" : "Inactivar"} onClick={() => toggle(item)}>
            {item.status === "INACTIVO" ? <CheckIcon/> : <CloseIcon/>}</IconButton>
        </TableRowActions>} /></div>
      <div data-sial-component="Pagination" data-sial-source={source}><Pagination page={currentPage} pageSize={pageSize} total={filtered.length} pageSizeOptions={[2, 10, 20]}
        onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} /></div>
    </article>
    {selected && <Drawer show onClose={() => setSelected(null)} title={`Detalle de ${config.noun}`} subtitle={selected.code}
      data={Object.entries(selected).map(([key, value]) => ({ label: columns.find((column) => column.key === key)?.header || key,
        children: key === "status" ? <Chip preset={value === "ACTIVO" ? "active" : value === "INACTIVO" ? "inactive" : "warning"}>{value === "ACTIVO" ? "Activo" : value === "INACTIVO" ? "Inactivo" : "Revisión"}</Chip> : String(value) }))} />}
  </>;
}
