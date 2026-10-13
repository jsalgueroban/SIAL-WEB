import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  CheckIcon,
  Chip,
  CloseIcon,
  EditIcon,
  IconButton,
  Pagination,
  SelectInput,
  Table,
  TableRowActions,
  TextInput,
  ViewIcon
} from "@banasandev/banasan-ui";

const source = "@banasandev/banasan-ui";
const storageKey = "sial-order-categories";
const seed = [
  { code: "ETIQ", name: "ETIQUETA", status: "ACTIVO", audit: "Crear - materiales.admin · 25/09/2026 08:20" },
  { code: "OPER", name: "OPERATIVO", status: "ACTIVO", audit: "Crear - materiales.admin · 25/09/2026 08:24" },
  { code: "EMPA", name: "EMPAQUE", status: "ACTIVO", audit: "Crear - materiales.admin · 25/09/2026 08:28" },
  { code: "ARCH", name: "ARCHIVADA", status: "INACTIVO", audit: "Inactivar - materiales.admin · 25/09/2026 09:10" }
];

function readCategories() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || "null");
    return Array.isArray(stored) ? stored : seed;
  } catch {
    return seed;
  }
}

function StateChip({ status }) {
  return <Chip variant="filled" tone={status === "ACTIVO" ? "active" : "inactive"} data-sial-component="Chip" data-sial-source={source}>{status === "ACTIVO" ? "Activo" : "Inactivo"}</Chip>;
}

export function OrderCategories() {
  const [categories, setCategories] = useState(readCategories);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formMode, setFormMode] = useState(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [formError, setFormError] = useState("");
  const [auditCode, setAuditCode] = useState(null);

  const filtered = useMemo(() => categories.filter((item) => {
    const matchesText = `${item.code} ${item.name}`.toLowerCase().includes(search.trim().toLowerCase());
    return matchesText && (!statusFilter || item.status === statusFilter);
  }), [categories, search, statusFilter]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const auditedItem = categories.find((item) => item.code === auditCode);

  useEffect(() => {
    if (formMode) requestAnimationFrame(() => document.getElementById(formMode === "new" ? "categoryCode" : "categoryName")?.focus());
  }, [formMode]);
  useEffect(() => {
    if (!auditCode) return undefined;
    const closeOnEscape = (event) => { if (event.key === "Escape") setAuditCode(null); };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [auditCode]);

  function persist(next) {
    setCategories(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }
  function closeForm() {
    setFormMode(null);
    setCode("");
    setName("");
    setFormError("");
  }
  function openNew() {
    setCode("");
    setName("");
    setFormError("");
    setFormMode("new");
  }
  function openEdit(item) {
    setCode(item.code);
    setName(item.name);
    setFormError("");
    setFormMode("edit");
  }
  function submit(event) {
    event.preventDefault();
    const normalizedCode = code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    const normalizedName = name.trim().toUpperCase();
    if (!normalizedCode || !normalizedName) {
      setFormError("Completa el código y el nombre.");
      return;
    }
    if (formMode === "new" && categories.some((item) => item.code === normalizedCode)) {
      setFormError(`El código ${normalizedCode} ya existe.`);
      return;
    }
    const audit = `${formMode === "edit" ? "Editar" : "Crear"} - materiales.admin · ${new Date().toLocaleString("es-CO")}`;
    if (formMode === "edit") {
      persist(categories.map((item) => item.code === normalizedCode
        ? { ...item, name: normalizedName, audit, history: [audit, ...(item.history || [item.audit])] }
        : item));
    } else {
      persist([{ code: normalizedCode, name: normalizedName, status: "ACTIVO", audit, history: [audit] }, ...categories]);
    }
    closeForm();
    setPage(1);
  }
  function toggleStatus(item) {
    const nextStatus = item.status === "ACTIVO" ? "INACTIVO" : "ACTIVO";
    const audit = `${nextStatus === "ACTIVO" ? "Activar" : "Inactivar"} - materiales.admin · ${new Date().toLocaleString("es-CO")}`;
    persist(categories.map((entry) => entry.code === item.code
      ? { ...entry, status: nextStatus, audit, history: [audit, ...(entry.history || [entry.audit])] }
      : entry));
  }

  const columns = [
    { key: "code", header: "Código", width: "15%", render: (item) => <strong>{item.code}</strong> },
    { key: "name", header: "Nombre", width: "24%", render: (item) => item.name },
    { key: "status", header: "Estado", width: "15%", render: (item) => <StateChip status={item.status} /> },
    { key: "audit", header: "Auditoría", render: (item) => <span className="muted">{item.audit}</span> }
  ];

  return <>
    <p className="page-eyebrow">Materiales / Configuración</p>
    <div className="page-header"><div><h1 className="page-title">Categorías de pedido</h1><p className="page-subtitle">Administra la clasificación compartida por pedidos y materiales.</p></div></div>
    <article className="card workflow-table-card standard-master-card sial-ui-category-card">
      <div className="card-header">
        <div><h2 className="card-title">Categorías registradas</h2><p className="card-subtitle">Consulta códigos, nombres, estado y trazabilidad.</p></div>
        <div className="card-actions">
          <Chip preset="info" aria-live="polite" data-sial-component="Chip" data-sial-source={source}>{filtered.length} {filtered.length === 1 ? "registro" : "registros"}</Chip>
          <Button variant="filled" onClick={openNew} aria-expanded={formMode !== null} aria-controls="categoryInlineForm" data-sial-component="Button" data-sial-source={source} data-sial-variant="filled">Registrar categoría</Button>
        </div>
      </div>
      <div className="card-body"><div className="sial-ui-category-toolbar">
        <div data-sial-component="TextInput" data-sial-source={source}><TextInput id="categorySearch" label="Buscar categoría" placeholder="Código o nombre" value={search} onChange={(value) => { setSearch(value); setPage(1); }} /></div>
        <div data-sial-component="SelectInput" data-sial-source={source}><SelectInput id="categoryStatus" label="Estado" value={statusFilter} options={[{ label: "Todos los estados", value: "" }, { label: "Activo", value: "ACTIVO" }, { label: "Inactivo", value: "INACTIVO" }]} onChange={(value) => { setStatusFilter(value); setPage(1); }} /></div>
      </div></div>
      {formMode && <div className="inline-form-panel inline-form-compact category-inline-form sial-ui-category-form" id="categoryInlineForm">
        <div className="form-heading"><h2>{formMode === "new" ? "Nueva categoría" : `Editar ${code}`}</h2><p>{formMode === "new" ? "El código será único y se guardará en mayúsculas." : "Actualiza el nombre sin alterar el código ni el histórico."}</p></div>
        <div className="form-body"><form onSubmit={submit} noValidate>
          <div className="sial-ui-category-fields">
            <div data-sial-component="TextInput" data-sial-source={source}><TextInput id="categoryCode" label="Código" required maxLength={12} placeholder="ETIQ" value={code} disabled={formMode === "edit"} onChange={(value) => setCode(value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""))} helperText="Único, sin espacios y en mayúsculas." /></div>
            <div data-sial-component="TextInput" data-sial-source={source}><TextInput id="categoryName" label="Nombre" required maxLength={60} placeholder="ETIQUETA" value={name} onChange={(value) => setName(value.toUpperCase())} helperText="Nombre visible en pedidos y materiales." /></div>
          </div>
          {formError && <p className="sial-ui-form-error" role="alert">{formError}</p>}
          <div className="form-actions"><Button variant="outlined" type="reset" onClick={closeForm} data-sial-component="Button" data-sial-source={source} data-sial-variant="outlined">Cancelar</Button><Button variant="filled" type="submit" data-sial-component="Button" data-sial-source={source} data-sial-variant="filled">Guardar categoría</Button></div>
        </form></div>
      </div>}
      <div data-sial-component="Table" data-sial-source={source} className="sial-ui-category-table"><Table columns={columns} data={rows} rowKey={(item) => item.code} minWidth="800px" emptyState="No hay categorías que coincidan con los filtros." actionsHeader="Acciones" actionsWidth="160px" actions={(item) => <TableRowActions label={`Acciones de ${item.name}`}>
        <IconButton variant="ghost" aria-label={`Ver auditoría de ${item.name}`} title="Ver auditoría" onClick={() => setAuditCode(item.code)}><ViewIcon /></IconButton>
        <IconButton variant="ghost" aria-label={`Editar categoría ${item.name}`} title="Editar categoría" onClick={() => openEdit(item)}><EditIcon /></IconButton>
        <IconButton variant="ghost" className={item.status === "ACTIVO" ? "sial-ui-action-danger" : "sial-ui-action-success"} aria-label={`${item.status === "ACTIVO" ? "Inactivar" : "Activar"} categoría ${item.name}`} title={item.status === "ACTIVO" ? "Inactivar categoría" : "Activar categoría"} onClick={() => toggleStatus(item)}>{item.status === "ACTIVO" ? <CloseIcon /> : <CheckIcon />}</IconButton>
      </TableRowActions>} /></div>
      <Pagination page={currentPage} pageSize={pageSize} total={filtered.length} pageSizeOptions={[5, 10, 20]} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} data-sial-component="Pagination" data-sial-source={source} />
    </article>
    {auditedItem && <><div className="drawer-backdrop show" onClick={() => setAuditCode(null)} role="presentation" /><aside className="drawer show" aria-label="Auditoría de categoría" aria-modal="true" role="dialog"><div className="drawer-head"><div><h3>Auditoría de categoría</h3><p>Historial de cambios y disponibilidad del registro.</p></div><button className="icon-btn" type="button" aria-label="Cerrar auditoría" onClick={() => setAuditCode(null)}>×</button></div><div className="drawer-body"><div className="detail-group"><span className="detail-label">Código</span><div className="detail-value">{auditedItem.code}</div></div><div className="detail-group"><span className="detail-label">Nombre</span><div className="detail-value">{auditedItem.name}</div></div><div className="detail-group"><span className="detail-label">Estado</span><div className="detail-value"><StateChip status={auditedItem.status} /></div></div><div className="detail-group"><span className="detail-label">Auditoría</span><div className="stack">{(auditedItem.history || [auditedItem.audit]).map((entry, index) => <div className="audit-item" key={`${entry}-${index}`}>{entry}</div>)}</div></div></div></aside></>}
  </>;
}
