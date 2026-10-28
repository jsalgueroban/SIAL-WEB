import { createPortal } from "react-dom";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, CheckIcon, Chip, CloseIcon, Drawer, EditIcon, IconButton, Notice, Pagination, SelectInput, Table, TableRowActions, TextInput, Toast, ViewIcon } from "@banasandev/banasan-ui";
import { TableFilterReset } from "./table-filter-reset.jsx";

const storageKey = "sial-farm-catalog-productos";
const seed = [
  { code: "PROD-001", name: "BANANO", size: "GENERAL", active: true, audit: ["Crear - calidad · 20/04/2026 08:00"] },
  { code: "PROD-002", name: "AGUACATE", size: "GENERAL", active: true, audit: ["Crear - calidad · 20/04/2026 09:30"] }
];

function readClasses() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return Array.isArray(saved) ? saved : seed;
  } catch {
    return seed;
  }
}

export function FarmCatalog_productos() {
  const [records, setRecords] = useState(readClasses);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [size, setSize] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const trigger = useRef(null);
  const detailTrigger = useRef(null);
  const readonly = new URLSearchParams(location.search).get("acceso") === "consulta";
  useEffect(() => {
    if (form) document.getElementById("referenceClassName")?.focus();
  }, [form?.code]);
  // TextInput 1.4.0 does not forward ARIA props; connect its input to the local error.
  useEffect(() => {
    const input = document.getElementById("referenceClassName");
    if (!input) return;
    input.setAttribute("aria-required", "true");
    input.setAttribute("aria-invalid", String(Boolean(errors.name)));
    if (errors.name) input.setAttribute("aria-describedby", "referenceClassNameError");
    else input.removeAttribute("aria-describedby");
  }, [form, errors.name]);
  useEffect(() => {
    if (!feedback) return undefined;
    const timer = window.setTimeout(() => setFeedback(""), 5000);
    return () => window.clearTimeout(timer);
  }, [feedback]);
  const filtered = useMemo(() => records.filter((record) =>
    `${record.code} ${record.name}`.toLocaleLowerCase("es").includes(search.trim().toLocaleLowerCase("es"))
    && (!status || String(record.active) === status)
    && (!size || record.size === size)
  ), [records, search, status, size]);
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / pageSize)));
  const rows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  function persist(next) {
    localStorage.setItem(storageKey, JSON.stringify(next));
    setRecords(next);
  }
  function openForm(record, opener) {
    if (readonly) return;
    trigger.current = opener;
    setErrors({});
    setForm(record ? { ...record } : { code: "", name: "", size: "" });
  }
  function closeForm() {
    setForm(null);
    setErrors({});
    requestAnimationFrame(() => trigger.current?.focus());
  }
  function closeDetail() {
    setSelected(null);
    requestAnimationFrame(() => detailTrigger.current?.focus());
  }
  function change(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors({});
  }
  function submit(event) {
    event.preventDefault();
    if (readonly || !form) return;
    const name = form.name.trim().toLocaleUpperCase("es");
    const nextErrors = {};
    if (!name) nextErrors.name = "Escribe el nombre del producto.";

    if (records.some((record) => record.code !== form.code && record.name === name)) {
      nextErrors.name = "Ya existe un producto con este nombre.";
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      document.getElementById(nextErrors.name ? "referenceClassName" : "referenceClassSize")?.focus();
      return;
    }
    const auditEntry = `${form.code ? "Editar" : "Crear"} producto · ${new Date().toLocaleString("es-CO")}`;
    const number = Math.max(0, ...records.map(record => Number(record.code.replace("PROD-", "")) || 0)) + 1;
    const code = form.code || ("productos" === "productos" ? `PROD-${String(number).padStart(3,"0")}` : String(number));
    const next = form.code
      ? records.map((record) => record.code === code ? { ...record, name, size: form.size, audit: [...record.audit, auditEntry] } : record)
      : [{ code, name, size: "Sin asignar", active: true, audit: [auditEntry] }, ...records];
    persist(next);
    setPage(1);
    setFeedback(`Producto ${code} ${form.code ? "actualizado" : "registrado"}.`);
    closeForm();
  }
  function toggle(record) {
    if (readonly) return;
    const auditEntry = `${record.active ? "Inactivar" : "Activar"} producto · ${new Date().toLocaleString("es-CO")}`;
    persist(records.map((candidate) => candidate.code === record.code
      ? { ...candidate, active: !record.active, audit: [...candidate.audit, auditEntry] } : candidate));
    setFeedback(`Producto ${record.code} ${record.active ? "inactivado" : "activado"}.`);
    if (status && status !== String(!record.active)) requestAnimationFrame(() => document.getElementById("referenceClassSearch")?.focus());
  }
  const stateChip = (record) => <Chip preset={record.active ? "active" : "inactive"}>{record.active ? "Activo" : "Inactivo"}</Chip>;
  const columns = [
    { key: "code", header: "Código", render: (record) => record.code },
    { key: "name", header: "Nombre de producto", render: (record) => record.name },
    { key: "state", header: "Estado", render: stateChip },
    { key: "audit", header: "Última actividad", render: (record) => record.audit.at(-1) }
  ];
  return <>
    <p className="page-eyebrow">Referencias / Productos</p>
    <div className="page-header"><div><h1 className="page-title">Gestión de productos</h1><p className="page-subtitle">Consulta y administra los productos registrados.</p></div></div>
    {readonly && <Notice variant="info" heading="Acceso de consulta">Puedes consultar los productos autorizados. El registro y los cambios requieren permisos administrativos.</Notice>}
    <article className="card standard-master-card reference-classes-card">
      <div className="card-header"><div><h2 className="card-title">Productos registrados</h2><p className="card-subtitle">Conserva el historial al editar o cambiar el estado de un producto.</p></div>
        <div className="card-actions"><Chip preset="info">{filtered.length} {filtered.length === 1 ? "registro" : "registros"}</Chip>
          {!readonly && <Button onClick={(event) => openForm(null, event.currentTarget)}>Nuevo producto</Button>}
        </div>
      </div>
      <div className="card-body"><div className="toolbar reference-classes-toolbar">
        <TextInput id="referenceClassSearch" label="Buscar producto o código" value={search} onChange={(value) => { setSearch(value); setPage(1); }} />
        <SelectInput id="referenceClassStatus" label="Estado" value={status} onChange={(value) => { setStatus(value); setPage(1); }} options={[{ value: "", label: "Todos los estados" }, { value: "true", label: "Activo" }, { value: "false", label: "Inactivo" }]} />

        <TableFilterReset active={Boolean(search || status || size)} onReset={() => { setSearch(""); setStatus(""); setSize(""); setPage(1); document.getElementById("referenceClassSearch")?.focus(); }} />
      </div></div>
      {form && <section className="inline-form-panel inline-form-compact reference-classes-form" aria-label={form.code ? "Editar producto" : "Nuevo producto"}>
        <div className="form-heading"><h3>{form.code ? "Editar producto" : "Nuevo producto"}</h3><p>El nombre debe ser único y se guarda en mayúsculas.</p></div>
        <div className="form-body"><form onSubmit={submit} noValidate><div className="grid">
          <div className="field span-12"><TextInput id="referenceClassName" label="Nombre de producto" required value={form.name} onChange={(value) => change("name", value.toLocaleUpperCase("es"))} validate={{ status: Boolean(errors.name) }} />{errors.name && <span id="referenceClassNameError" className="field-error" role="alert">{errors.name}</span>}</div>

        </div><div className="form-actions"><Button variant="outlined" type="button" onClick={closeForm}>Cancelar</Button><Button type="submit">Guardar producto</Button></div></form></div>
      </section>}
      <Table columns={columns} data={rows} rowKey={(record) => record.code} minWidth="860px" emptyState="No hay productos que coincidan con los filtros." actionsHeader="Acciones" actionsWidth="130px" actions={(record) => <TableRowActions label={`Acciones de producto ${record.code}`}>
        <IconButton variant="ghost" aria-label={`Ver producto ${record.code}`} onClick={(event) => { detailTrigger.current = event.currentTarget; setSelected(record); }}><ViewIcon /></IconButton>
        {!readonly && <><IconButton variant="ghost" aria-label={`Editar producto ${record.code}`} onClick={(event) => openForm(record, event.currentTarget)}><EditIcon /></IconButton>
          <IconButton variant="ghost" aria-label={`${record.active ? "Inactivar" : "Activar"} producto ${record.code}`} onClick={() => toggle(record)}>{record.active ? <CloseIcon /> : <CheckIcon />}</IconButton></>}
      </TableRowActions>} />
      <Pagination page={currentPage} pageSize={pageSize} total={filtered.length} pageSizeOptions={[2, 10, 20]} onPageChange={setPage} onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} />
    </article>
    {selected && <Drawer show title="Detalle de producto" subtitle={selected.code} ariaLabel={`Detalle de producto ${selected.code}`} onClose={closeDetail} data={[
      { label: "Nombre de producto", children: selected.name }, { label: "Estado", children: stateChip(selected) },
      { label: "Auditoría", children: <ul>{selected.audit.map((entry, index) => <li key={`${index}-${entry}`}>{entry}</li>)}</ul> }
    ]} />}
    {feedback && createPortal(<div className="reference-classes-feedback"><Toast visible variant="success" title={feedback} onClose={() => setFeedback("")} /></div>, document.body)}
  </>;
}
