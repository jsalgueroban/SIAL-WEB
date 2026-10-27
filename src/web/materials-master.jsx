import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Chip,
  DateInput,
  Drawer,
  EditIcon,
  IconButton,
  NumberInput,
  Pagination,
  SearchSelectInput,
  SelectInput,
  Table,
  TableRowActions,
  TextInput,
  Toast,
  ViewIcon,
} from "@banasandev/banasan-ui";
import { exportRows } from "./materials-inventory.jsx";
import { TableFilterReset } from "./table-filter-reset.jsx";
import { loadRecipeRecords } from "./materials-recipes.jsx";

const configKey = "sial-hu826-configurations";
const catalogKey = "sial-materials-catalog-records";
const raw = [
  [
    "16FT7BD-8",
    "101279",
    "BASE BBS11 FYFFES 13 KG (20 UND) V2",
    "1",
    "UN",
    "16FT7BD-8",
  ],
  [
    "16FT7BD-8",
    "102247",
    "TAPA BLD98 FYF FT BLANCA 13KG (30 UND)V3",
    "1",
    "UN",
    "20LD7RA-20",
  ],
  [
    "16FT7BD-8",
    "1970",
    "ESTIBAS FYFFES 1.02X1.20 MTS (MQ)",
    "0,01516",
    "UN",
    "21X5BDOF",
  ],
  [
    "16FT7BD-8",
    "5418",
    "ESQUINERO KRAFT 2.13 MTS (20 UND)",
    "0,06061",
    "UN",
    "544 - PR TROPY 54-0",
  ],
  [
    "16FT7BD-8",
    "322",
    "ESQUINERO KRAFT 1.95 MTS (20 UND)",
    "0,06060606061",
    "UN",
    "AGSTDBVRA-1",
  ],
  [
    "16FT7BD-8",
    "4925",
    "ZUNCHO AMARILLO SIN IMPRESIÓN",
    "0,8",
    "M",
    "AGSTDRA-1",
  ],
];
const seeds = raw.map(
  (
    [reference, sapMaterial, name, quantityPerBox, unit, referenceList],
    index,
  ) => ({
    id: `PAR-${reference}-${sapMaterial}`,
    reference,
    sapMaterial,
    name,
    quantityPerBox,
    unit,
    classification: "CONVENCIONAL FAIRTRADE",
    referenceList,
    recipeVersion: "",
    validityStart: "",
    validityEnd: "",
    waste: "",
    substitutes: "",
    rounding: "",
    orderCategory: index === 5 ? "ETIQ" : "EMPA",
    safetyMargin: index < 2 ? 10 : 15,
    status: "REVISION",
    source: "Carga inicial",
    audit: "Importar material|24/08/2026",
  }),
);
const configFields = [
  ["reference", "Referencia", "text", "Identidad"],
  ["recipeVersion", "Versión de receta", "text", "Identidad"],
  ["sapMaterial", "Material SAP", "text", "Identidad"],
  ["validityStart", "Vigencia desde", "date", "Vigencia y reglas"],
  ["validityEnd", "Vigencia hasta", "date", "Vigencia y reglas"],
  ["waste", "Desperdicio (%)", "number", "Vigencia y reglas"],
  ["substitutes", "Sustitutos", "text", "Vigencia y reglas"],
  ["rounding", "Regla de redondeo", "text", "Vigencia y reglas"],
  ["validationRule", "Regla de validación", "rule", "Trazabilidad"],
  ["responsibleUser", "Usuario responsable", "text", "Trazabilidad"],
  ["observation", "Observación", "textarea", "Trazabilidad"],
];
const configHelp = {
  reference: "Identifica el producto al que aplica este material.",
  sapMaterial: "Selecciona el código del material registrado en SAP.",
  recipeVersion: "Selecciona la versión de receta de esta referencia.",
  validityStart: "Inicio de vigencia de la configuración.",
  validityEnd: "Debe ser posterior al inicio de vigencia.",
  waste: "Porcentaje entre 0 y 100.",
  substitutes: "Declara el material sustituto o indica que no existe.",
  rounding: "Regla aplicada al cálculo del pedido sugerido.",
  validationRule: "Criterio que se revisará antes de utilizar esta configuración.",
  responsibleUser: "Usuario que registra la configuración.",
  observation: "Describe el motivo o contexto de esta configuración.",
};
const configGroups = {
  Identidad: { kicker: "Material y referencia", title: "Identidad de la configuración" },
  "Vigencia y reglas": { kicker: "Condiciones de uso", title: "Vigencia y reglas" },
  Trazabilidad: { kicker: "Control de la configuración", title: "Validación y responsable" },
};
const options = {
  rule: [
    "Stock disponible",
    "Configuración vigente",
    "Excepción por tolerancia",
  ],
};
const blankConfig = () =>
  Object.fromEntries(
    configFields.map(([name]) => [
      name,
      name === "responsibleUser" ? "almacen.admin" : "",
    ]),
  );
function readStored(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value && typeof value === "object" ? value : fallback;
  } catch {
    return fallback;
  }
}
const num = (value) => Number(String(value).replace(",", "."));
const numericFieldValue = (value) =>
  value === "" || value == null ? undefined : Number(value);
const numericFormValue = (value) =>
  value == null || !Number.isFinite(Number(value)) ? "" : String(value);
const dateValue = (value) => (value ? new Date(`${value}T12:00:00`) : null);
const dateString = (value) =>
  value
    ? `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`
    : "";
const catalogEmpty = {
  sapMaterial: "",
  name: "",
  unit: "",
  orderCategory: "",
  safetyMargin: 10,
};
export function MaterialsMaster({ view = "catalog" }) {
  const [recipeRecords] = useState(loadRecipeRecords);
  const [records, setRecords] = useState(() => {
    const saved = readStored(view === "config" ? configKey : catalogKey, view === "config" ? [] : seeds);
    return Array.isArray(saved) ? saved : (view === "config" ? [] : seeds);
  });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState("");
  const [catalogForm, setCatalogForm] = useState(catalogEmpty);
  const [configForm, setConfigForm] = useState(blankConfig);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const catalogTriggerRef = useRef(null);
  useEffect(() => {
    if (!feedback) return undefined;
    const timer = window.setTimeout(() => setFeedback(""), 5000);
    return () => window.clearTimeout(timer);
  }, [feedback]);
  const filtered = useMemo(
    () =>
      records.filter(
        (item) =>
          `${item.sapMaterial} ${item.name} ${item.orderCategory} ${item.reference} ${item.recipeVersion || ""}`
            .toLocaleLowerCase("es")
            .includes(search.toLocaleLowerCase("es")) &&
          (status === "all" || item.status === status) &&
          (category === "all" || item.orderCategory === category),
      ),
    [records, search, status, category],
  );
  const current = Math.min(
    page,
    Math.max(1, Math.ceil(filtered.length / size)),
  );
  function openCatalog(item = null, trigger = null) {
    catalogTriggerRef.current = trigger;
    setMode("catalog");
    setCatalogForm(item ? { ...item } : catalogEmpty);
    setError("");
    requestAnimationFrame(() => document.getElementById(item ? "catalogCategory" : "catalogCode")?.focus());
  }
  function closeCatalog() {
    setMode("");
    setError("");
    requestAnimationFrame(() => catalogTriggerRef.current?.focus());
  }
  function focusConfigField(name) {
    document.getElementById(`config-${name}`)?.focus();
  }
  function updateConfig(patch) {
    setConfigForm((previous) => ({ ...previous, ...patch }));
    setError("");
  }
  function openConfig() {
    setMode("config");
    setConfigForm(blankConfig());
    setError("");
    requestAnimationFrame(() => focusConfigField("reference"));
  }
  function closeConfig() {
    setMode("");
    setError("");
    requestAnimationFrame(() => document.getElementById("config-new-trigger")?.focus());
  }
  function saveCatalog(event) {
    event.preventDefault();
    const sourceMaterial = raw.find(([, code]) => code === catalogForm.sapMaterial);
    if (!sourceMaterial) {
      setError("Selecciona un código SAP de la fuente antes de guardar.");
      document.getElementById("catalogCode")?.focus();
      return;
    }
    if (
      !catalogForm.orderCategory ||
      String(catalogForm.safetyMargin).trim() === "" ||
      !Number.isFinite(Number(catalogForm.safetyMargin)) ||
      Number(catalogForm.safetyMargin) < 0 ||
      Number(catalogForm.safetyMargin) > 100
    ) {
      setError(
        "Selecciona el material, la unidad y categoría; el margen debe estar entre 0 y 100%.",
      );
      document.getElementById(!catalogForm.orderCategory ? "catalogCategory" : "catalogMargin")?.focus();
      return;
    }
    const existing = records.find(
      (item) => item.sapMaterial === catalogForm.sapMaterial,
    );
    const item = {
      ...(existing || {}),
      ...catalogForm,
      name: sourceMaterial[2],
      unit: sourceMaterial[4],
      id: existing?.id || `CAT-${catalogForm.sapMaterial}`,
      status: existing?.status || "REVISION",
      audit: `${existing ? "Editar" : "Crear"} material|${new Date().toLocaleString("es-CO")}`,
    };
    const next = existing
      ? records.map((record) => (record.id === existing.id ? item : record))
      : [item, ...records];
    localStorage.setItem(catalogKey, JSON.stringify(next));
    setRecords(next);
    closeCatalog();
    setFeedback(`Material ${catalogForm.sapMaterial} ${existing ? "actualizado" : "registrado"}.`);
  }
  function saveConfig(event) {
    event.preventDefault();
    const data = Object.fromEntries(
      Object.entries(configForm).map(([key, value]) => [
        key,
        String(value).trim(),
      ]),
    );
    const missing = configFields
      .filter(([name]) => !data[name])
      .map(([, label]) => label);
    if (missing.length) {
      setError(`Completa: ${missing.join(", ")}.`);
      focusConfigField(configFields.find(([name]) => !data[name])?.[0]);
      return;
    }
    const sourceMaterial = raw.find(([, code]) => code === data.sapMaterial);
    if (!sourceMaterial) {
      setError("Selecciona un material SAP registrado antes de guardar.");
      focusConfigField("sapMaterial");
      return;
    }
    const recipe = recipeRecords.find(
      (item) => item.reference === data.reference && item.version === data.recipeVersion,
    );
    if (!recipe || !recipe.materials.some((item) => item.sapMaterial === data.sapMaterial)) {
      setError("Selecciona una referencia, versión y material asociados en la receta.");
      focusConfigField("sapMaterial");
      return;
    }
    if (
      !Number.isFinite(num(data.waste)) || num(data.waste) < 0 ||
      num(data.waste) > 100
    ) {
      setError("El desperdicio debe estar entre 0 y 100%.");
      focusConfigField("waste");
      return;
    }
    if (data.validityEnd <= data.validityStart) {
      setError("La vigencia hasta debe ser posterior a la vigencia desde.");
      focusConfigField("validityEnd");
      return;
    }
    if (
      records.some(
        (item) =>
          item.reference === data.reference &&
          item.sapMaterial === data.sapMaterial &&
          item.recipeVersion === data.recipeVersion,
      )
    ) {
      setError(
        "Ya existe una configuración con la misma referencia, Material SAP y versión de receta.",
      );
      focusConfigField("sapMaterial");
      return;
    }
    const idempotencyKey = [
      data.reference,
      data.sapMaterial,
      data.recipeVersion,
    ].join("|");
    const keys = readStored(`${configKey}:keys`, {});
    if (keys[idempotencyKey]) {
      setError(
        "La misma configuración ya fue registrada; no se duplicó la operación.",
      );
      focusConfigField("sapMaterial");
      return;
    }
    const now = new Date();
    const item = {
      id: `CFG-${data.reference}-${data.sapMaterial}-${Date.now()}`,
      ...data,
      name: sourceMaterial[2],
      unit: sourceMaterial[4],
      status: "REVISION",
      code: data.sapMaterial,
      source: "Configuración de referencia",
      audit: `Configurar - ${data.responsibleUser}|${now.toLocaleString("es-CO")}`,
    };
    const saved = readStored(configKey, []);
    localStorage.setItem(
      configKey,
      JSON.stringify(
        [item, ...(Array.isArray(saved) ? saved : [])].slice(0, 50),
      ),
    );
    localStorage.setItem(
      `${configKey}:keys`,
      JSON.stringify({ ...keys, [idempotencyKey]: now.toISOString() }),
    );
    setRecords((previous) => [item, ...previous]);
    setMode("");
    setConfigForm(blankConfig());
    setFeedback("Configuración guardada en revisión. Su uso en pedidos requiere validar la disponibilidad correspondiente.");
    requestAnimationFrame(() => document.getElementById("config-new-trigger")?.focus());
  }
  const columns = [
    {
      key: "sapMaterial",
      header: "Código SAP",
      render: (item) => (
        <span className="materials-record-main">
          <strong>{item.sapMaterial}</strong>
          <span>Material SAP</span>
        </span>
      ),
    },
    { key: "name", header: "Nombre", render: (item) => item.name },
    {
      key: "orderCategory",
      header: "Categoría",
      render: (item) => item.orderCategory || "No registrada",
    },
    { key: "unit", header: "Unidad de medida", render: (item) => item.unit },
    {
      key: "safetyMargin",
      header: "Margen",
      render: (item) =>
        item.safetyMargin != null ? `${item.safetyMargin}%` : "No registrado",
    },
    {
      key: "status",
      header: "Estado",
      render: (item) => (
        <Chip
          preset={
            item.status === "ACTIVO"
              ? "active"
              : item.status === "INACTIVO"
                ? "inactive"
                : "warning"
          }
        >
          {item.status === "REVISION"
            ? "Revisión"
            : item.status === "ACTIVO"
              ? "Activo"
              : "Inactivo"}
        </Chip>
      ),
    },
    {
      key: "audit",
      header: "Auditoría",
      render: (item) => item.audit?.replace("|", " · ") || "No registrada",
    },
  ];
  const configPanel = (
          <section
            className="inline-form-panel materials-inline-form"
            aria-label="Configurar referencia"
          >
            <div className="form-heading">
              <p>
                Asocia un material a la referencia y define la vigencia y las reglas que aplican a esta configuración.
              </p>
            </div>
            <form className="form-body" onSubmit={saveConfig} noValidate>
              {["Identidad", "Vigencia y reglas", "Trazabilidad"].map(
                (group) => (
                  <section className="section" key={group}>
                    <div className="section-heading">
                      <div>
                        <p className="section-kicker">{configGroups[group].kicker}</p>
                        <h3>{configGroups[group].title}</h3>
                      </div>
                    </div>
                    <div className="grid">
                      {configFields
                        .filter(([, , , section]) => section === group)
                        .map(([name, label, type]) => (
                          <div
                            className={`field ${name === "observation" ? "span-12" : "span-6"}`}
                            key={name}
                          >
                            {type === "textarea" ? (
                              <>
                                <label
                                  className="label"
                                  htmlFor={`config-${name}`}
                                >
                                  {label} <span className="required">*</span>
                                </label>
                                <textarea
                                  className="textarea"
                                  id={`config-${name}`}
                                  rows="3"
                                  value={configForm[name]}
                                  onChange={(event) => updateConfig({ [name]: event.target.value })}
                                />
                                <span className="field-note">{configHelp[name]}</span>
                              </>
                            ) : name === "reference" ? (
                              <SearchSelectInput
                                id={`config-${name}`}
                                label={label}
                                helperText={configHelp[name]}
                                required
                                value={configForm.reference}
                                options={[...new Set(recipeRecords.map((item) => item.reference))].map((reference) => ({ value: reference, label: reference }))}
                                onChange={(value) => updateConfig({ reference: value, recipeVersion: "", sapMaterial: "" })}
                              />
                            ) : name === "recipeVersion" ? (
                              <SelectInput
                                id={`config-${name}`}
                                label={label}
                                helperText={configHelp[name]}
                                required
                                value={configForm.recipeVersion}
                                options={[{ value: "", label: "Seleccionar" }, ...recipeRecords.filter((item) => item.reference === configForm.reference).map((item) => ({ value: item.version, label: item.version }))]}
                                onChange={(value) => updateConfig({ recipeVersion: value, sapMaterial: "" })}
                              />
                            ) : name === "sapMaterial" ? (
                              <SearchSelectInput
                                id={`config-${name}`}
                                label={label}
                                helperText={configHelp[name]}
                                required
                                value={configForm.sapMaterial}
                                options={(recipeRecords.find((item) => item.reference === configForm.reference && item.version === configForm.recipeVersion)?.materials || []).map(({ sapMaterial, name: materialName }) => ({ value: sapMaterial, label: `${sapMaterial} · ${materialName}` }))}
                                onChange={(value) => updateConfig({ sapMaterial: value })}
                              />
                            ) : type === "date" ? (
                              <DateInput
                                id={`config-${name}`}
                                label={label}
                                helperText={configHelp[name]}
                                required
                                value={dateValue(configForm[name])}
                                onChange={(value) => updateConfig({ [name]: dateString(value) })}
                              />
                            ) : options[type] ? (
                              <SelectInput
                                id={`config-${name}`}
                                label={label}
                                helperText={configHelp[name]}
                                required
                                value={configForm[name]}
                                options={[
                                  { value: "", label: "Seleccionar" },
                                  ...options[type].map((value) => ({
                                    value,
                                    label:
                                      value === "REVISION"
                                        ? "Guardar en revisión"
                                        : value === "ACTIVO"
                                          ? "Activar configuración"
                                          : value,
                                  })),
                                ]}
                                onChange={(value) => updateConfig({ [name]: value })}
                              />
                            ) : type === "number" ? (
                              <NumberInput
                                id={`config-${name}`}
                                label={label}
                                helperText={configHelp[name]}
                                required
                                min={0}
                                value={numericFieldValue(configForm[name])}
                                onChange={(value) => updateConfig({ [name]: numericFormValue(value) })}
                              />
                            ) : (
                              <TextInput
                                id={`config-${name}`}
                                label={label}
                                helperText={configHelp[name]}
                                required
                                value={configForm[name]}
                                onChange={(value) => updateConfig({ [name]: value })}
                              />
                            )}
                          </div>
                        ))}
                    </div>
                    {group === "Identidad" && (() => {
                      const material = raw.find(([, code]) => code === configForm.sapMaterial);
                      return <dl className="materials-sap-context" aria-label="Datos del material SAP seleccionado">
                        <div><dt>Nombre del material</dt><dd>{material?.[2] || "Selecciona un material SAP"}</dd></div>
                        <div><dt>Unidad de medida SAP</dt><dd>{material?.[4] || "—"}</dd></div>
                      </dl>;
                    })()}
                  </section>
                ),
              )}
              {error && (
                <p className="field-error" role="alert">
                  {error}
                </p>
              )}
              <p className="materials-form-context">La configuración quedará en revisión. Antes de utilizarla, verifica la disponibilidad del material en la operación correspondiente.</p>
              <div className="form-actions">
                <Button
                  variant="outlined"
                  type="button"
                  onClick={closeConfig}
                >
                  Cancelar
                </Button>
                <Button type="submit">Guardar configuración</Button>
              </div>
            </form>
          </section>
  );
  if (view === "config") {
    const configColumns = [
      { key: "reference", header: "Referencia", render: (item) => <strong>{item.reference}</strong> },
      { key: "sapMaterial", header: "Material SAP", render: (item) => <span>{item.sapMaterial} · {item.name}</span> },
      { key: "recipeVersion", header: "Versión", render: (item) => item.recipeVersion },
      { key: "validity", header: "Vigencia", render: (item) => <span>{item.validityStart} → {item.validityEnd}</span> },
      { key: "status", header: "Estado", render: (item) => <Chip preset={item.status === "ACTIVO" ? "active" : "warning"}>{item.status === "ACTIVO" ? "Activo" : "En revisión"}</Chip> },
    ];
    return (
      <>
        <p className="page-eyebrow">Materiales / Catálogo / Configuraciones</p>
        <div className="page-header">
          <div>
            <h1 className="page-title">Configuraciones por referencia</h1>
            <p className="page-subtitle">Consulta la vigencia y las reglas de cada material asociado a una referencia.</p>
          </div>
        </div>
        <article className="card mt-24 standard-master-card materials-config-view">
          <div className="card-header">
            <div>
              <h2 className="card-title">{mode === "config" ? "Nueva configuración" : "Configuraciones registradas"}</h2>
              <p className="card-subtitle">{mode === "config" ? "Define el material y sus reglas para una referencia." : "Selecciona una configuración para revisar sus datos y estado."}</p>
            </div>
            <div className="card-actions">
              {mode === "config" ? (
                <Button variant="outlined" onClick={closeConfig}>Volver a configuraciones</Button>
              ) : (
                <>
                  <Chip preset="info">{filtered.length} {filtered.length === 1 ? "registro" : "registros"}</Chip>
                  <Button variant="outlined" onClick={() => { window.location.href = "gestion-materiales.html"; }}>Volver al catálogo</Button>
                  <Button id="config-new-trigger" onClick={openConfig}>Nueva configuración</Button>
                </>
              )}
            </div>
          </div>
          {feedback && <div className="materials-config-feedback"><Toast visible variant="success" title="Resultado" description={feedback} onClose={() => setFeedback("")} /></div>}
          {mode === "config" ? configPanel : (
            <>
              <div className="card-body">
                <div className="toolbar materials-toolbar">
                  <TextInput id="configSearch" label="Buscar configuración" placeholder="Buscar referencia, versión o material SAP" value={search} onChange={(value) => { setSearch(value); setPage(1); }} />
                  <SelectInput id="configStatus" label="Estado" value={status} options={[{ value: "all", label: "Todos los estados" }, { value: "REVISION", label: "En revisión" }, { value: "ACTIVO", label: "Activo" }]} onChange={(value) => { setStatus(value); setPage(1); }} />
                  <TableFilterReset active={Boolean(search.trim()) || status !== "all"} onReset={() => { setSearch(""); setStatus("all"); setPage(1); }} />
                </div>
              </div>
              <Table columns={configColumns} data={filtered.slice((current - 1) * size, current * size)} rowKey={(item) => item.id} minWidth="760px" emptyState="No hay configuraciones que coincidan con los filtros." actionsHeader="Acciones" actions={(item) => <TableRowActions label={`Acciones de ${item.reference}`}><IconButton variant="ghost" aria-label={`Ver configuración de ${item.reference}`} title="Ver detalle" onClick={() => setSelected(item)}><ViewIcon /></IconButton></TableRowActions>} />
              <Pagination page={current} pageSize={size} total={filtered.length} pageSizeOptions={[2, 10, 20]} onPageChange={setPage} onPageSizeChange={(value) => { setSize(value); setPage(1); }} />
            </>
          )}
        </article>
        {selected && <Drawer show title="Detalle de configuración" subtitle={`${selected.reference} · ${selected.sapMaterial}`} onClose={() => setSelected(null)} data={[["Referencia", selected.reference], ["Material SAP", selected.sapMaterial], ["Versión de receta", selected.recipeVersion], ["Vigencia", `${selected.validityStart} → ${selected.validityEnd}`], ["Desperdicio", selected.waste === "" || selected.waste == null ? null : `${selected.waste} %`], ["Sustitutos", selected.substitutes], ["Regla de redondeo", selected.rounding], ["Estado", selected.status === "REVISION" ? "En revisión" : selected.status === "ACTIVO" ? "Activo" : selected.status], ["Regla de validación", selected.validationRule], ["Responsable", selected.responsibleUser], ["Observación", selected.observation]].map(([label, value]) => ({ label, children: value || "No registrado" }))} />}
      </>
    );
  }
  return (
    <>
      <p className="page-eyebrow">Materiales / Catálogo</p>
      <div className="page-header">
        <div>
          <h1 className="page-title">Catálogo de materiales</h1>
          <p className="page-subtitle">
            Organiza los materiales que se utilizan en los pedidos.
          </p>
        </div>
      </div>
      <article className="card mt-24 standard-master-card materials-catalog-card">
        <div className="card-header materials-catalog-header">
          <div>
            <div className="materials-catalog-heading"><h2 className="card-title">Materiales registrados</h2><Chip preset="info">
              {filtered.length} {filtered.length === 1 ? "registro" : "registros"}
            </Chip></div>
            <p className="card-subtitle">
              Consulta el código SAP, la categoría, la unidad y el estado de cada material.
            </p>
          </div>
          <div className="card-actions materials-catalog-actions">
            <Button
              variant="outlined"
              onClick={() =>
                exportRows(filtered.map((item) => ({
                  ...item,
                  safetyMargin: item.safetyMargin == null ? "No registrado" : `${item.safetyMargin}%`,
                  status: ({ REVISION: "Revisión", ACTIVO: "Activo", INACTIVO: "Inactivo" })[item.status] || item.status,
                  audit: item.audit?.replace("|", " · ") || "No registrada",
                })), columns, "catalogo-materiales")
              }
            >
              Exportar
            </Button>
            <Button
              variant="outlined"
              onClick={() => { window.location.href = "configuracion-materiales-referencia.html"; }}
            >
              Configuraciones por referencia
            </Button>
            <Button onClick={(event) => openCatalog(null, event.currentTarget)}>Nuevo material</Button>
          </div>
        </div>
        {feedback && (
          <div className="materials-catalog-toast"><Toast
            visible
            variant="success"
            title="Material guardado"
            description={feedback}
            onClose={() => setFeedback("")}
          /></div>
        )}
        <div className="card-body">
          <div className="toolbar materials-toolbar">
            <TextInput
              id="materialSearch"
              label="Buscar material"
              placeholder="Buscar material, código SAP o categoría"
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
            />
            <SelectInput
              id="materialStatus"
              label="Estado"
              value={status}
              options={[
                { value: "all", label: "Todos los estados" },
                { value: "ACTIVO", label: "Activo" },
                { value: "REVISION", label: "Revisión" },
                { value: "INACTIVO", label: "Inactivo" },
              ]}
              onChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
            />
            <SelectInput
              id="materialCategory"
              label="Categoría"
              value={category}
              options={[
                { value: "all", label: "Todas las categorías" },
                ...["EMPA", "ETIQ", "OPER"].map((value) => ({
                  value,
                  label: value,
                })),
              ]}
              onChange={(value) => {
                setCategory(value);
                setPage(1);
              }}
            />
            <TableFilterReset active={Boolean(search.trim()) || status !== "all" || category !== "all"} onReset={() => { setSearch(""); setStatus("all"); setCategory("all"); setPage(1); }} />
          </div>
        </div>
        {mode === "catalog" && (
          <section
            className="inline-form-panel inline-form-compact materials-inline-form materials-catalog-form"
            aria-label="Nuevo material"
          >
            <div className="form-heading">
              <h3>{catalogForm.id ? "Editar material" : "Nuevo material"}</h3>
              <p>
                Selecciona un código SAP y completa los datos necesarios para usar el material en pedidos.
              </p>
            </div>
            <form className="form-body" onSubmit={saveCatalog} noValidate>
              <div className="grid">
                <div className="field span-4">
                  <SearchSelectInput
                    id="catalogCode"
                    label="Código SAP"
                    helperText={catalogForm.id ? "La identidad SAP no cambia durante la edición." : "Selecciona el código SAP del material."}
                    required
                    disabled={Boolean(catalogForm.id)}
                    value={catalogForm.sapMaterial}
                    options={raw.map(([, code, name]) => ({
                      value: code,
                      label: `${code} · ${name}`,
                    }))}
                    onChange={(value) => {
                      const match = raw.find((row) => row[1] === value);
                      setError("");
                      setCatalogForm((previous) => ({
                        ...previous,
                        sapMaterial: value,
                        name: match?.[2] || "",
                        unit: match?.[4] || "",
                      }));
                    }}
                  />
                </div>
                <div className="field span-8">
                  <dl className="materials-sap-context" aria-label="Datos del material SAP seleccionado">
                    <div><dt>Nombre del material</dt><dd>{catalogForm.name || "Selecciona un código SAP"}</dd></div>
                    <div><dt>Unidad de medida SAP</dt><dd>{catalogForm.unit || "—"}</dd></div>
                  </dl>
                </div>
                <div className="field span-6">
                  <SelectInput
                    id="catalogCategory"
                    label="Categoría"
                    helperText="Selecciona la categoría del material."
                    required
                    value={catalogForm.orderCategory}
                    options={[
                      { value: "", label: "Seleccionar" },
                      ...["EMPA", "ETIQ", "OPER"].map((value) => ({
                        value,
                        label: value,
                      })),
                    ]}
                    onChange={(value) => {
                      setError("");
                      setCatalogForm((previous) => ({
                        ...previous,
                        orderCategory: value,
                      }));
                    }}
                  />
                </div>
                <div className="field span-6">
                  <NumberInput
                    id="catalogMargin"
                    label="Margen de seguridad (%)"
                    helperText="Límite porcentual para validar la cantidad solicitada."
                    required
                    min={0}
                    max={100}
                    value={numericFieldValue(catalogForm.safetyMargin)}
                    onChange={(value) => {
                      setError("");
                      setCatalogForm((previous) => ({
                        ...previous,
                        safetyMargin: numericFormValue(value),
                      }));
                    }}
                  />
                </div>
              </div>
              {error && (
                <p className="field-error" role="alert">
                  {error}
                </p>
              )}
              <div className="form-actions">
                <Button
                  variant="outlined"
                  type="button"
                  onClick={closeCatalog}
                >
                  Cancelar
                </Button>
                <Button type="submit">Guardar material</Button>
              </div>
            </form>
          </section>
        )}
        <Table
          columns={columns}
          data={filtered.slice((current - 1) * size, current * size)}
          rowKey={(item) => item.id}
          minWidth="1050px"
          emptyState="No hay materiales que coincidan con los filtros."
          actionsHeader="Acciones"
          actions={(item) => (
            <TableRowActions label={`Acciones de ${item.sapMaterial}`}>
              <IconButton
                variant="ghost"
                aria-label={`Ver detalle de ${item.sapMaterial}`}
                title="Ver detalle"
                onClick={() => setSelected(item)}
              >
                <ViewIcon />
              </IconButton>
              <IconButton
                variant="ghost"
                aria-label={`Editar ${item.sapMaterial}`}
                title="Editar"
                onClick={(event) => openCatalog(item, event.currentTarget)}
              >
                <EditIcon />
              </IconButton>
            </TableRowActions>
          )}
        />
        <Pagination
          page={current}
          pageSize={size}
          total={filtered.length}
          pageSizeOptions={[2, 10, 20]}
          onPageChange={setPage}
          onPageSizeChange={(value) => {
            setSize(value);
            setPage(1);
          }}
        />
      </article>
      {selected && (
        <Drawer
          show
          title="Detalle de material"
          subtitle={selected.sapMaterial}
          ariaLabel={`Detalle de material ${selected.sapMaterial}`}
          onClose={() => setSelected(null)}
          data={[
            { label: "Código SAP", children: selected.sapMaterial },
            { label: "Nombre del material", children: selected.name },
            { label: "Unidad de medida", children: selected.unit || "No registrada" },
            { label: "Categoría de pedido", children: selected.orderCategory || "No registrada" },
            { label: "Margen de seguridad", children: `${selected.safetyMargin ?? 0}%` },
            { label: "Estado", children: <Chip preset={selected.status === "ACTIVO" ? "active" : selected.status === "INACTIVO" ? "inactive" : "warning"}>{selected.status === "ACTIVO" ? "Activo" : selected.status === "INACTIVO" ? "Inactivo" : "Revisión"}</Chip> },
            { label: "Fuente", children: selected.source || "No registrada" },
            { label: "Último cambio", children: selected.audit?.replace("|", " · ") || "No registrado" },
          ]}
        />
      )}
    </>
  );
}
