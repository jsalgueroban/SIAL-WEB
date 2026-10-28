import { createPortal } from "react-dom";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, CheckIcon, Chip, CloseIcon, Drawer, EditIcon, IconButton, Notice, Pagination, SelectInput, Table, TableRowActions, TextInput, Toast, ViewIcon } from "@banasandev/banasan-ui";
import { TableFilterReset } from "./table-filter-reset.jsx";

const storageKey = "sial-farm-catalog-grupos";
const seed = [
  { code: "101", name: "GRUPO COSTA NORTE", size: "AgroCeiba", active: true, audit: ["Crear - admin.fincas · 22/04/2026 09:20"] },
  { code: "102", name: "GRUPO ORIENTE UNO", size: "Banapalma", active: false, audit: ["Desactivar - auditor.master · 24/04/2026 11:10"] }
];

function readClasses() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return Array.isArray(saved) ? saved : seed;
  } catch {
    return seed;
  }
}

export function FarmCatalog_grupos() {
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
    if (!name) nextErrors.name = "Escribe el nombre del grupo.";

    if (records.some((record) => record.code !== form.code && record.name === name)) {
      nextErrors.name = "Ya existe un grupo con este nombre.";
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      document.getElementById(nextErrors.name ? "referenceClassName" : "referenceClassSize")?.focus();
      return;
    }
    const auditEntry = `${form.code ? "Editar" : "Crear"} grupo · ${new Date().toLocaleString("es-CO")}`;
    const number = Math.max(0, ...records.map(record => Number(record.code.replace("PROD-", "")) || 0)) + 1;
    const code = form.code || ("grupos" === "productos" ? `PROD-${String(number).padStart(3,"0")}` : String(number));
    const next = form.code
      ? records.map((record) => record.code === code ? { ...record, name, size: form.size, audit: [...record.audit, auditEntry] } : record)
      : [{ code, name, size: "Sin asignar", active: true, audit: [auditEntry] }, ...records];
    persist(next);
    setPage(1);
    setFeedback(`Grupo ${code} ${form.code ? "actualizado" : "registrado"}.`);
    closeForm();
  }
  function toggle(record) {
    if (readonly) return;
    const auditEntry = `${record.active ? "Inactivar" : "Activar"} grupo · ${new Date().toLocaleString("es-CO")}`;
    persist(records.map((candidate) => candidate.code === record.code
      ? { ...candidate, active: !record.active, audit: [...candidate.audit, auditEntry] } : candidate));
    setFeedback(`Grupo ${record.code} ${record.active ? "inactivado" : "activado"}.`);
    if (status && status !== String(!record.active)) requestAnimationFrame(() => document.getElementById("referenceClassSearch")?.focus());
  }
  function exportRows() {
    const lines = [["Código", "Nombre", "Productor", "Estado", "Última actividad"], ...filtered.map(r => [r.code, r.name, r.size, r.active ? "Activo" : "Inactivo", r.audit.at(-1)])];
    const csv = lines.map(line => line.map(value => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "grupos-registrados.csv"; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const stateChip = (record) => <Chip preset={record.active ? "active" : "inactive"}>{record.active ? "Activo" : "Inactivo"}</Chip>;
  const columns = [
    { key: "code", header: "Código", render: (record) => record.code },
    { key: "name", header: "Nombre de grupo", render: (record) => record.name },
    { key: "size", header: "Productor", render: (record) => record.size },
    { key: "state", header: "Estado", render: stateChip },
    { key: "audit", header: "Última actividad", render: (record) => record.audit.at(-1) }
  ];
  return <>
    <p className="page-eyebrow">Fincas / Grupos</p>
    <div className="page-header"><div><h1 className="page-title">Gestión de grupos</h1><p className="page-subtitle">Consulta y administra los grupos registrados.</p></div></div>
    {readonly && <Notice variant="info" heading="Acceso de consulta">Puedes consultar los grupos autorizados. El registro y los cambios requieren permisos administrativos.</Notice>}
    <article className="card standard-master-card reference-classes-card">
      <div className="card-header"><div><h2 className="card-title">Grupos registrados</h2><p className="card-subtitle">Conserva el historial al editar o cambiar el estado de un grupo.</p></div>
        <div className="card-actions"><Chip preset="info">{filtered.length} {filtered.length === 1 ? "registro" : "registros"}</Chip>
          <Button variant="outlined" onClick={exportRows}>Exportar</Button>{!readonly && <Button onClick={(event) => openForm(null, event.currentTarget)}>Nuevo grupo</Button>}
        </div>
      </div>
      <div className="card-body"><div className="toolbar reference-classes-toolbar">
        <TextInput id="referenceClassSearch" label="Buscar grupo o código" value={search} onChange={(value) => { setSearch(value); setPage(1); }} />
        <SelectInput id="referenceClassStatus" label="Estado" value={status} onChange={(value) => { setStatus(value); setPage(1); }} options={[{ value: "", label: "Todos los estados" }, { value: "true", label: "Activo" }, { value: "false", label: "Inactivo" }]} />
        <SelectInput id="referenceClassFilterSize" label="Productor" value={size} onChange={(value) => { setSize(value); setPage(1); }} options={[{ value: "", label: "Todos los productores" }, { value: "AgroCeiba", label: "AgroCeiba" }, { value: "Banapalma", label: "Banapalma" }, { value: "Sin asignar", label: "Sin asignar" }]} />
        <TableFilterReset active={Boolean(search || status || size)} onReset={() => { setSearch(""); setStatus(""); setSize(""); setPage(1); document.getElementById("referenceClassSearch")?.focus(); }} />
      </div></div>
      {form && <section className="inline-form-panel inline-form-compact reference-classes-form" aria-label={form.code ? "Editar grupo" : "Nuevo grupo"}>
        <div className="form-heading"><h3>{form.code ? "Editar grupo" : "Nuevo grupo"}</h3><p>El nombre debe ser único y se guarda en mayúsculas.</p></div>
        <div className="form-body"><form onSubmit={submit} noValidate><div className="grid">
          <div className="field span-12"><TextInput id="referenceClassName" label="Nombre de grupo" required value={form.name} onChange={(value) => change("name", value.toLocaleUpperCase("es"))} validate={{ status: Boolean(errors.name) }} />{errors.name && <span id="referenceClassNameError" className="field-error" role="alert">{errors.name}</span>}</div>

        </div><div className="form-actions"><Button variant="outlined" type="button" onClick={closeForm}>Cancelar</Button><Button type="submit">Guardar grupo</Button></div></form></div>
      </section>}
      <Table columns={columns} data={rows} rowKey={(record) => record.code} minWidth="860px" emptyState="No hay grupos que coincidan con los filtros." actionsHeader="Acciones" actionsWidth="130px" actions={(record) => <TableRowActions label={`Acciones de grupo ${record.code}`}>
        <IconButton variant="ghost" aria-label={`Ver grupo ${record.code}`} onClick={(event) => { detailTrigger.current = event.currentTarget; setSelected(record); }}><ViewIcon /></IconButton>
        {!readonly && <><IconButton variant="ghost" aria-label={`Editar grupo ${record.code}`} onClick={(event) => openForm(record, event.currentTarget)}><EditIcon /></IconButton>
          <IconButton variant="ghost" aria-label={`${record.active ? "Inactivar" : "Activar"} grupo ${record.code}`} onClick={() => toggle(record)}>{record.active ? <CloseIcon /> : <CheckIcon />}</IconButton></>}
      </TableRowActions>} />
      <Pagination page={currentPage} pageSize={pageSize} total={filtered.length} pageSizeOptions={[2, 10, 20]} onPageChange={setPage} onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} />
    </article>
    {selected && <Drawer show title="Detalle de grupo" subtitle={selected.code} ariaLabel={`Detalle de grupo ${selected.code}`} onClose={closeDetail} data={[
      { label: "Nombre de grupo", children: selected.name }, { label: "Productor", children: selected.size }, { label: "Estado", children: stateChip(selected) },
      { label: "Auditoría", children: <ul>{selected.audit.map((entry, index) => <li key={`${index}-${entry}`}>{entry}</li>)}</ul> }
    ]} />}
    {feedback && createPortal(<div className="reference-classes-feedback"><Toast visible variant="success" title={feedback} onClose={() => setFeedback("")} /></div>, document.body)}
  </>;
}
