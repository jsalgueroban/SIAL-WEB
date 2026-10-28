import { createPortal } from "react-dom";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, CheckIcon, Chip, CloseIcon, Drawer, EditIcon, IconButton, Notice, Pagination, SelectInput, Table, TableRowActions, TextInput, Toast, ViewIcon } from "@banasandev/banasan-ui";
import { TableFilterReset } from "./table-filter-reset.jsx";

const storageKey = "sial-farm-reference-classes";
const seed = [
  { code: "301", name: "EXPORTACION", size: "LARGA", active: true, audit: ["Crear - calidad · 22/04/2026 09:20"] },
  { code: "302", name: "INDUSTRIAL", size: "CORTA", active: false, audit: ["Desactivar - auditor.master · 24/04/2026 11:10"] }
];

function readClasses() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return Array.isArray(saved) ? saved : seed;
  } catch {
    return seed;
  }
}

export function FarmReferenceClasses() {
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
    if (!name) nextErrors.name = "Escribe el nombre de la clase.";
    if (!form.size) nextErrors.size = "Selecciona el tamaño de fruta.";
    if (records.some((record) => record.code !== form.code && record.name === name && record.size === form.size)) {
      nextErrors.name = "Ya existe una clase con este nombre y tamaño de fruta.";
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      document.getElementById(nextErrors.name ? "referenceClassName" : "referenceClassSize")?.focus();
      return;
    }
    const auditEntry = `${form.code ? "Editar" : "Crear"} clase · ${new Date().toLocaleString("es-CO")}`;
    const code = form.code || String(Math.max(...records.map((record) => Number(record.code)), 300) + 1);
    const next = form.code
      ? records.map((record) => record.code === code ? { ...record, name, size: form.size, audit: [...record.audit, auditEntry] } : record)
      : [{ code, name, size: form.size, active: true, audit: [auditEntry] }, ...records];
    persist(next);
    setPage(1);
    setFeedback(`Clase ${code} ${form.code ? "actualizada" : "registrada"}.`);
    closeForm();
  }
  function toggle(record) {
    if (readonly) return;
    const auditEntry = `${record.active ? "Inactivar" : "Activar"} clase · ${new Date().toLocaleString("es-CO")}`;
    persist(records.map((candidate) => candidate.code === record.code
      ? { ...candidate, active: !record.active, audit: [...candidate.audit, auditEntry] } : candidate));
    setFeedback(`Clase ${record.code} ${record.active ? "inactivada" : "activada"}.`);
    if (status && status !== String(!record.active)) requestAnimationFrame(() => document.getElementById("referenceClassSearch")?.focus());
  }
  const stateChip = (record) => <Chip preset={record.active ? "active" : "inactive"}>{record.active ? "Activo" : "Inactivo"}</Chip>;
  const columns = [
    { key: "code", header: "Código", render: (record) => record.code },
    { key: "name", header: "Nombre de clase", render: (record) => record.name },
    { key: "size", header: "Tamaño de fruta", render: (record) => record.size },
    { key: "state", header: "Estado", render: stateChip },
    { key: "audit", header: "Última actividad", render: (record) => record.audit.at(-1) }
  ];
  return <>
    <p className="page-eyebrow">Referencias / Clases</p>
    <div className="page-header"><div><h1 className="page-title">Gestión de clases de referencia</h1><p className="page-subtitle">Consulta y administra las clases según el tamaño de fruta.</p></div></div>
    {readonly && <Notice variant="info" heading="Acceso de consulta">Puedes consultar las clases autorizadas. El registro y los cambios requieren permisos administrativos.</Notice>}
    <article className="card standard-master-card reference-classes-card">
      <div className="card-header"><div><h2 className="card-title">Clases registradas</h2><p className="card-subtitle">Conserva el historial al editar o cambiar el estado de una clase.</p></div>
        <div className="card-actions"><Chip preset="info">{filtered.length} {filtered.length === 1 ? "registro" : "registros"}</Chip>
          {!readonly && <Button onClick={(event) => openForm(null, event.currentTarget)}>Nueva clase</Button>}
        </div>
      </div>
      <div className="card-body"><div className="toolbar reference-classes-toolbar">
        <TextInput id="referenceClassSearch" label="Buscar clase o código" value={search} onChange={(value) => { setSearch(value); setPage(1); }} />
        <SelectInput id="referenceClassStatus" label="Estado" value={status} onChange={(value) => { setStatus(value); setPage(1); }} options={[{ value: "", label: "Todos los estados" }, { value: "true", label: "Activo" }, { value: "false", label: "Inactivo" }]} />
        <SelectInput id="referenceClassFilterSize" label="Tamaño de fruta" value={size} onChange={(value) => { setSize(value); setPage(1); }} options={[{ value: "", label: "Todos los tamaños" }, { value: "LARGA", label: "Larga" }, { value: "CORTA", label: "Corta" }]} />
        <TableFilterReset active={Boolean(search || status || size)} onReset={() => { setSearch(""); setStatus(""); setSize(""); setPage(1); document.getElementById("referenceClassSearch")?.focus(); }} />
      </div></div>
      {form && <section className="inline-form-panel inline-form-compact reference-classes-form" aria-label={form.code ? "Editar clase de referencia" : "Nueva clase de referencia"}>
        <div className="form-heading"><h3>{form.code ? "Editar clase de referencia" : "Nueva clase de referencia"}</h3><p>La combinación de nombre y tamaño de fruta debe ser única.</p></div>
        <div className="form-body"><form onSubmit={submit} noValidate><div className="grid">
          <div className="field span-6"><TextInput id="referenceClassName" label="Nombre de clase" required value={form.name} onChange={(value) => change("name", value.toLocaleUpperCase("es"))} validate={{ status: Boolean(errors.name) }} />{errors.name && <span id="referenceClassNameError" className="field-error" role="alert">{errors.name}</span>}</div>
          <div className="field span-6"><SelectInput id="referenceClassSize" label="Tamaño de fruta" required value={form.size} onChange={(value) => change("size", value)} options={[{ value: "", label: "Selecciona un tamaño" }, { value: "LARGA", label: "Larga" }, { value: "CORTA", label: "Corta" }]} validate={{ status: Boolean(errors.size), message: errors.size }} /></div>
        </div><div className="form-actions"><Button variant="outlined" type="button" onClick={closeForm}>Cancelar</Button><Button type="submit">Guardar clase</Button></div></form></div>
      </section>}
      <Table columns={columns} data={rows} rowKey={(record) => record.code} minWidth="860px" emptyState="No hay clases que coincidan con los filtros." actionsHeader="Acciones" actionsWidth="130px" actions={(record) => <TableRowActions label={`Acciones de clase ${record.code}`}>
        <IconButton variant="ghost" aria-label={`Ver clase ${record.code}`} onClick={(event) => { detailTrigger.current = event.currentTarget; setSelected(record); }}><ViewIcon /></IconButton>
        {!readonly && <><IconButton variant="ghost" aria-label={`Editar clase ${record.code}`} onClick={(event) => openForm(record, event.currentTarget)}><EditIcon /></IconButton>
          <IconButton variant="ghost" aria-label={`${record.active ? "Inactivar" : "Activar"} clase ${record.code}`} onClick={() => toggle(record)}>{record.active ? <CloseIcon /> : <CheckIcon />}</IconButton></>}
      </TableRowActions>} />
      <Pagination page={currentPage} pageSize={pageSize} total={filtered.length} pageSizeOptions={[2, 10, 20]} onPageChange={setPage} onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} />
    </article>
    {selected && <Drawer show title="Detalle de clase" subtitle={selected.code} ariaLabel={`Detalle de clase ${selected.code}`} onClose={closeDetail} data={[
      { label: "Nombre de clase", children: selected.name }, { label: "Tamaño de fruta", children: selected.size }, { label: "Estado", children: stateChip(selected) },
      { label: "Auditoría", children: <ul>{selected.audit.map((entry, index) => <li key={`${index}-${entry}`}>{entry}</li>)}</ul> }
    ]} />}
    {feedback && createPortal(<div className="reference-classes-feedback"><Toast visible variant="success" title={feedback} onClose={() => setFeedback("")} /></div>, document.body)}
  </>;
}
