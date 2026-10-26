import React, { useEffect, useMemo, useRef, useState } from "react";
import { TableFilterReset } from "./table-filter-reset.jsx";
import {
  Button,
  CheckIcon,
  Chip,
  CloseIcon,
  Drawer,
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

const catalogs = {
  licenses: {
    storage: "sial-proposal-license-categories-v2",
    eyebrow: "Transporte / Licencias",
    title: "Gestión de licencias",
    subtitle: "Consulta y administra las categorías que pueden asignarse a conductores.",
    listTitle: "Categorías existentes",
    listSubtitle: "Código, descripción, estado y trazabilidad en una sola lista.",
    addLabel: "Nueva categoría",
    singular: "categoría",
    plural: "categorías",
    formTitle: "categoría",
    newTitle: "Nueva categoría",
    editTitle: "Editar categoría",
    codeLabel: "Código licencia",
    searchPlaceholder: "Código o descripción",
    seed: [
      { code: "C2", description: "Camiones rígidos de servicio público", status: true, audit: "Actualizar · admin.transportes · 24/04/2026 08:30" },
      { code: "C3", description: "Vehículos articulados y tractocamiones", status: true, audit: "Crear · admin.transportes · 20/04/2026 09:15" },
      { code: "A1", description: "Motocicletas de bajo cilindraje", status: false, audit: "Inactivar · auditor.logistica · 18/04/2026 16:41" }
    ]
  },
  vehicleTypes: {
    storage: "sial-proposal-vehicle-types-v2",
    eyebrow: "Transporte / Tipos de vehículos",
    title: "Gestión de tipos de vehículos",
    subtitle: "Clasifica los vehículos usados en programación, asignación y control de flota.",
    listTitle: "Tipos registrados",
    listSubtitle: "Identificación, uso, estado y trazabilidad de cada tipo.",
    addLabel: "Nuevo tipo",
    singular: "tipo",
    plural: "tipos",
    formTitle: "tipo de vehículo",
    newTitle: "Nuevo tipo de vehículo",
    editTitle: "Editar tipo de vehículo",
    codeLabel: "Código",
    searchPlaceholder: "Código o nombre",
    seed: [
      { code: "CAMION", name: "CAMIÓN", description: "VEHÍCULO DE CARGA RÍGIDA", usageCount: 18, status: true, audit: "Crear · admin.transportes · 20/04/2026 09:15" },
      { code: "TRACTOMULA", name: "TRACTOMULA", description: "VEHÍCULO ARTICULADO DE CARGA", usageCount: 11, status: true, audit: "Crear · admin.transportes · 21/04/2026 11:10" },
      { code: "CAMION_RIGIDO", name: "CAMIÓN RÍGIDO", description: "VEHÍCULO RÍGIDO DE CARGA", usageCount: 0, status: false, audit: "Inactivar · auditor.logistica · 25/04/2026 16:40" }
    ]
  }
};

function readRows(config) {
  try {
    const saved = JSON.parse(localStorage.getItem(config.storage) || "null");
    return Array.isArray(saved) ? saved : config.seed;
  } catch {
    return config.seed;
  }
}

function StatusChip({ active }) {
  return <Chip preset={active ? "active" : "inactive"} data-sial-component="Chip" data-sial-source={source}>{active ? "Activo" : "Inactivo"}</Chip>;
}

function Audit({ item }) {
  return <span className="sial-ui-master-audit">{item.audit}</span>;
}

function StatusConfirmation({ item, onCancel, onConfirm, label }) {
  const cancelRef = useRef(null);
  useEffect(() => {
    cancelRef.current?.focus();
    const onEscape = (event) => { if (event.key === "Escape") onCancel(); };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [onCancel]);
  const verb = item.status ? "Inactivar" : "Activar";
  return <div className="sial-ui-master-confirm-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
    <section className="sial-ui-master-confirm" role="alertdialog" aria-modal="true" aria-labelledby="status-confirm-title" aria-describedby="status-confirm-description">
      <h2 id="status-confirm-title">{verb} {label}</h2>
      <p id="status-confirm-description">{item.status ? "El registro seguirá disponible para consulta, pero no para nuevas asignaciones." : "El registro volverá a estar disponible para nuevas asignaciones."}</p>
      <div className="sial-ui-master-confirm-actions"><Button ref={cancelRef} variant="outlined" onClick={onCancel}>Cancelar</Button><Button variant="filled" onClick={onConfirm}>{verb} {label}</Button></div>
    </section>
  </div>;
}

export function TransportCatalog({ catalog }) {
  const config = catalogs[catalog];
  const isVehicle = catalog === "vehicleTypes";
  const [rows, setRows] = useState(() => readRows(config));
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [usage, setUsage] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formMode, setFormMode] = useState(null);
  const [form, setForm] = useState({ code: "", name: "", description: "" });
  const [errors, setErrors] = useState({});
  const [detailCode, setDetailCode] = useState(null);
  const [confirmCode, setConfirmCode] = useState(null);

  const filtered = useMemo(() => rows.filter((item) => {
    const haystack = [item.code, item.name, item.description].filter(Boolean).join(" ").toLocaleLowerCase("es-CO");
    return haystack.includes(search.trim().toLocaleLowerCase("es-CO"))
      && (!status || (item.status ? "active" : "inactive") === status)
      && (!isVehicle || !usage || (item.usageCount > 0 ? "used" : "unused") === usage);
  }), [rows, search, status, usage, isVehicle]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const shown = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const detail = rows.find((item) => item.code === detailCode);
  const confirmation = rows.find((item) => item.code === confirmCode);

  function persist(next) {
    setRows(next);
    localStorage.setItem(config.storage, JSON.stringify(next));
  }
  function closeForm() {
    setFormMode(null);
    setForm({ code: "", name: "", description: "" });
    setErrors({});
  }
  function openForm(item) {
    setFormMode(item ? "edit" : "new");
    setForm(item ? { code: item.code, name: item.name || "", description: item.description } : { code: "", name: "", description: "" });
    setErrors({});
    requestAnimationFrame(() => document.getElementById(item ? `${catalog}-description` : `${catalog}-code`)?.focus());
  }
  function setField(key, value) {
    const next = key === "description" && !isVehicle ? value : value.toUpperCase();
    setForm((current) => ({ ...current, [key]: next }));
    setErrors((current) => ({ ...current, [key]: "", form: "" }));
  }
  function submit(event) {
    event.preventDefault();
    const code = form.code.trim().toUpperCase().replace(/\s+/g, "_");
    const name = form.name.trim().toUpperCase();
    const description = form.description.trim();
    const nextErrors = {};
    if (isVehicle ? !/^[A-Z][A-Z0-9_]{1,49}$/.test(code) : !/^[A-Z0-9]{1,6}$/.test(code)) {
      nextErrors.code = isVehicle ? "Inicia con una letra; usa entre 2 y 50 letras, números o guiones bajos." : "Usa entre 1 y 6 letras o números.";
    }
    if (formMode === "new" && rows.some((item) => item.code === code)) nextErrors.code = "Este código ya existe.";
    if (isVehicle && (name.length < 3 || name.length > 100)) nextErrors.name = "Escribe un nombre de 3 a 100 caracteres.";
    if (isVehicle && rows.some((item) => item.name === name && item.code !== code)) nextErrors.name = "Este nombre ya existe.";
    if (description.length < 3 || description.length > (isVehicle ? 200 : 100)) nextErrors.description = `Escribe una descripción de 3 a ${isVehicle ? 200 : 100} caracteres.`;
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return; }
    const audit = `${formMode === "edit" ? "Actualizar" : "Crear"} · admin.transportes · ${new Date().toLocaleString("es-CO")}`;
    if (formMode === "edit") {
      const previous = rows.find((item) => item.code === code);
      if (previous.name === name && previous.description === description) { setErrors({ form: "No hay cambios para guardar." }); return; }
      persist(rows.map((item) => item.code === code ? { ...item, name: isVehicle ? name : undefined, description: isVehicle ? description.toUpperCase() : description, audit } : item));
    } else {
      persist([{ code, ...(isVehicle ? { name, usageCount: 0 } : {}), description: isVehicle ? description.toUpperCase() : description, status: true, audit }, ...rows]);
      setPage(1);
    }
    closeForm();
  }
  function confirmStatus() {
    if (!confirmation) return;
    const audit = `${confirmation.status ? "Inactivar" : "Activar"} · admin.transportes · ${new Date().toLocaleString("es-CO")}`;
    persist(rows.map((item) => item.code === confirmation.code ? { ...item, status: !item.status, audit } : item));
    setConfirmCode(null);
  }

  const columns = isVehicle ? [
    { key: "code", header: "Código", width: "15%", render: (item) => <strong>{item.code}</strong> },
    { key: "name", header: "Nombre", width: "23%", render: (item) => item.name },
    { key: "usageCount", header: "Uso", width: "12%", render: (item) => `${item.usageCount} vehículo${item.usageCount === 1 ? "" : "s"}` },
    { key: "status", header: "Estado", width: "13%", render: (item) => <StatusChip active={item.status} /> },
    { key: "audit", header: "Auditoría", render: (item) => <Audit item={item} /> }
  ] : [
    { key: "code", header: "Código", width: "16%", render: (item) => <strong>{item.code}</strong> },
    { key: "description", header: "Descripción", width: "35%", render: (item) => item.description },
    { key: "status", header: "Estado", width: "16%", render: (item) => <StatusChip active={item.status} /> },
    { key: "audit", header: "Auditoría", render: (item) => <Audit item={item} /> }
  ];

  return <>
    <p className="page-eyebrow">{config.eyebrow}</p>
    <div className="page-header"><div><h1 className="page-title">{config.title}</h1><p className="page-subtitle">{config.subtitle}</p></div></div>
    <article className="card workflow-table-card standard-master-card sial-ui-master-card">
      <div className="card-header"><div><h2 className="card-title">{config.listTitle}</h2><p className="card-subtitle">{config.listSubtitle}</p></div><div className="card-actions"><Chip preset="info" aria-live="polite" data-sial-component="Chip" data-sial-source={source}>{filtered.length} {filtered.length === 1 ? "registro" : "registros"}</Chip><Button variant="filled" onClick={() => openForm(null)} aria-expanded={formMode !== null} aria-controls={`${catalog}-form`} data-sial-component="Button" data-sial-source={source}>{config.addLabel}</Button></div></div>
      <div className="card-body"><div className={`sial-ui-master-toolbar ${isVehicle ? "has-usage" : ""}`}>
        <div data-sial-component="TextInput" data-sial-source={source}><TextInput id={`${catalog}-search`} label="Buscar" placeholder={config.searchPlaceholder} value={search} onChange={(value) => { setSearch(value); setPage(1); }} /></div>
        <div data-sial-component="SelectInput" data-sial-source={source}><SelectInput id={`${catalog}-status`} label="Estado" value={status} options={[{ label: "Todos los estados", value: "" }, { label: "Activo", value: "active" }, { label: "Inactivo", value: "inactive" }]} onChange={(value) => { setStatus(value); setPage(1); }} /></div>
        {isVehicle && <div data-sial-component="SelectInput" data-sial-source={source}><SelectInput id={`${catalog}-usage`} label="Uso" value={usage} options={[{ label: "Todos", value: "" }, { label: "En uso", value: "used" }, { label: "Sin uso", value: "unused" }]} onChange={(value) => { setUsage(value); setPage(1); }} /></div>}
      <TableFilterReset active={Boolean(search.trim()) || Boolean(status) || Boolean(usage)} onReset={() => { setSearch(""); setStatus(""); setUsage(""); setPage(1); }} /></div></div>
      {formMode && <div className="inline-form-panel inline-form-compact sial-ui-master-form" id={`${catalog}-form`}><div className="form-heading"><h2>{formMode === "new" ? config.newTitle : config.editTitle}</h2><p>{isVehicle ? "Identifica el tipo con código, nombre y descripción operativa." : "Define el código y la descripción que verá el equipo de transporte."}</p></div><div className="form-body"><form onSubmit={submit} noValidate><div className={`sial-ui-master-fields ${isVehicle ? "three-fields" : ""}`}>
        {formMode === "new" && <div data-sial-component="TextInput" data-sial-source={source}><TextInput id={`${catalog}-code`} label={config.codeLabel} required maxLength={isVehicle ? 50 : 6} value={form.code} placeholder={isVehicle ? "CAMION" : "C4"} helperText={isVehicle ? "Inicia con una letra; sin espacios." : "Alfanumérico, máximo 6 caracteres."} validate={{ status: Boolean(errors.code), message: errors.code }} onChange={(value) => setField("code", isVehicle ? value.replace(/\s+/g, "_") : value.replace(/[^A-Za-z0-9]/g, ""))} /></div>}
        {formMode === "edit" && <div className="sial-ui-master-code"><span className="sial-ui-master-field-label">{config.codeLabel}</span><strong>{form.code}</strong><small>El código no se modifica.</small></div>}
        {isVehicle && <div data-sial-component="TextInput" data-sial-source={source}><TextInput id={`${catalog}-name`} label="Nombre" required maxLength={100} value={form.name} placeholder="TRACTOMULA" helperText="Único; se guarda en mayúsculas." validate={{ status: Boolean(errors.name), message: errors.name }} onChange={(value) => setField("name", value)} /></div>}
        <div data-sial-component="TextInput" data-sial-source={source}><TextInput id={`${catalog}-description`} label="Descripción" required maxLength={isVehicle ? 200 : 100} value={form.description} placeholder={isVehicle ? "VEHÍCULO PARA TRANSPORTE TERRESTRE" : "Alcance de la licencia"} helperText="Describe el alcance operativo." validate={{ status: Boolean(errors.description), message: errors.description }} onChange={(value) => setField("description", value)} /></div>
      </div>{errors.form && <p className="sial-ui-master-error" role="alert">{errors.form}</p>}<div className="form-actions"><Button variant="outlined" type="reset" onClick={closeForm}>Cancelar</Button><Button variant="filled" type="submit">Guardar {config.singular}</Button></div></form></div></div>}
      <div className="sial-ui-master-table" data-sial-component="Table" data-sial-source={source}><Table columns={columns} data={shown} rowKey={(item) => item.code} minWidth={isVehicle ? "950px" : "800px"} emptyState={`No hay ${config.plural} que coincidan con los filtros.`} actionsHeader="Acciones" actionsWidth="160px" actions={(item) => <TableRowActions label={`Acciones de ${item.code}`}>
        <IconButton variant="ghost" aria-label={`Ver detalle de ${item.code}`} title="Ver detalle" onClick={() => setDetailCode(item.code)}><ViewIcon /></IconButton>
        <IconButton variant="ghost" aria-label={`Editar ${config.singular} ${item.code}`} title="Editar" onClick={() => openForm(item)}><EditIcon /></IconButton>
        <IconButton variant="ghost" className={item.status ? "sial-ui-action-danger" : "sial-ui-action-success"} aria-label={`${item.status ? "Inactivar" : "Activar"} ${config.singular} ${item.code}`} title={item.status ? "Inactivar" : "Activar"} onClick={() => setConfirmCode(item.code)}>{item.status ? <CloseIcon /> : <CheckIcon />}</IconButton>
      </TableRowActions>} /></div>
      <Pagination page={currentPage} pageSize={pageSize} total={filtered.length} pageSizeOptions={[10, 30, 50]} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} data-sial-component="Pagination" data-sial-source={source} />
    </article>
    {detail && <Drawer show onClose={() => setDetailCode(null)} title={isVehicle ? "Detalle del tipo" : "Detalle de la categoría"} subtitle="Consulta de estado y auditoría." ariaLabel={`Detalle de ${detail.code}`} data={[
      { label: "Código", children: detail.code },
      ...(isVehicle ? [{ label: "Nombre", children: detail.name }, { label: "Descripción", children: detail.description }, { label: "Uso", children: `${detail.usageCount} vehículos` }] : [{ label: "Descripción", children: detail.description }]),
      { label: "Estado", children: <StatusChip active={detail.status} /> },
      { label: "Auditoría", children: detail.audit }
    ]} />}
    {confirmation && <StatusConfirmation item={confirmation} label={config.singular} onCancel={() => setConfirmCode(null)} onConfirm={confirmStatus} />}
  </>;
}
