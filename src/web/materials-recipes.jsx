import React, { useMemo, useState } from "react";
import { TableFilterReset } from "./table-filter-reset.jsx";
import {
  Button,
  CheckIcon,
  Chip,
  CloseIcon,
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

const source = "@banasandev/banasan-ui";
const catalog = [
  {
    sapMaterial: "101279",
    name: "BASE BBS11 FYFFES 13 KG (20 UND) V2",
    unit: "UN",
  },
  {
    sapMaterial: "102247",
    name: "TAPA BLD98 FYF FT BLANCA 13KG (30 UND)V3",
    unit: "UN",
  },
  {
    sapMaterial: "1970",
    name: "ESTIBAS FYFFES 1.02X1.20 MTS (MQ)",
    unit: "UN",
  },
  {
    sapMaterial: "5418",
    name: "ESQUINERO KRAFT 2.13 MTS (20 UND)",
    unit: "UN",
  },
  { sapMaterial: "322", name: "ESQUINERO KRAFT 1.95 MTS (20 UND)", unit: "UN" },
  { sapMaterial: "4925", name: "ZUNCHO AMARILLO SIN IMPRESIÓN", unit: "M" },
];
const seeds = [
  {
    id: "REC-16FT7BD-8-V1",
    reference: "16FT7BD-8",
    version: "V1",
    materials: [
      ["101279", "1"],
      ["102247", "1"],
      ["1970", "0,01516"],
    ],
    status: "ACTIVO",
    audit: "Crear - configuracion.materiales|24/08/2026 10:20",
  },
  {
    id: "REC-20LD7RA-20-V2",
    reference: "20LD7RA-20",
    version: "V2",
    materials: [
      ["102247", "1"],
      ["5418", "0,06061"],
      ["4925", "0,8"],
    ],
    status: "ACTIVO",
    audit: "Editar - configuracion.materiales|25/08/2026 15:10",
  },
  {
    id: "REC-21X5BDOF-V1",
    reference: "21X5BDOF",
    version: "V1",
    materials: [
      ["1970", "0,01516"],
      ["322", "0,06060606061"],
    ],
    status: "REVISION",
    audit: "Crear - configuracion.materiales|26/08/2026 08:35",
  },
].map((item) => ({
  ...item,
  materials: item.materials.map(([sapMaterial, quantityPerBox]) => ({
    ...catalog.find((entry) => entry.sapMaterial === sapMaterial),
    quantityPerBox,
  })),
}));
export const recipeSeeds = seeds;
const recipeStorageKey = "sial-materials-recipe-records";
const catalogStorageKey = "sial-materials-catalog-records";
export function loadRecipeRecords() {
  try {
    const saved = JSON.parse(localStorage.getItem(recipeStorageKey) || "null");
    return Array.isArray(saved) ? saved : seeds;
  } catch {
    return seeds;
  }
}
function saveRecipeRecords(records) {
  localStorage.setItem(recipeStorageKey, JSON.stringify(records));
}
function loadCatalogMaterials() {
  try {
    const saved = JSON.parse(localStorage.getItem(catalogStorageKey) || "null");
    return Array.isArray(saved)
      ? saved.map(({ sapMaterial, name, unit }) => ({ sapMaterial, name, unit }))
      : catalog;
  } catch {
    return catalog;
  }
}
function configuredMaterialsFor(reference, version) {
  try {
    const saved = JSON.parse(localStorage.getItem("sial-hu826-configurations") || "[]");
    return Array.isArray(saved)
      ? saved.filter((item) => item.reference === reference && item.recipeVersion === version)
          .map((item) => item.sapMaterial)
      : [];
  } catch {
    return [];
  }
}
const emptyLine = () => ({ sapMaterial: "", quantityPerBox: "" });
const tone = (status) =>
  status === "ACTIVO"
    ? "active"
    : status === "INACTIVO"
      ? "inactive"
      : "warning";
export function MaterialsRecipes() {
  const [records, setRecords] = useState(loadRecipeRecords);
  const [availableMaterials] = useState(loadCatalogMaterials);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [reference, setReference] = useState("all");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    reference: "",
    version: "",
    lines: [emptyLine()],
  });
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState("");
  const filtered = useMemo(
    () =>
      records.filter(
        (item) =>
          `${item.reference} ${item.version} ${item.materials.map((line) => `${line.sapMaterial} ${line.name}`).join(" ")}`
            .toLocaleLowerCase("es")
            .includes(search.toLocaleLowerCase("es")) &&
          (status === "all" || item.status === status) &&
          (reference === "all" || item.reference === reference),
      ),
    [records, search, status, reference],
  );
  const current = Math.min(
    page,
    Math.max(1, Math.ceil(filtered.length / size)),
  );
  const existingCombination = records.find(
    (item) =>
      item.reference === form.reference.trim() &&
      item.version === form.version.trim() &&
      item.id !== editing,
  );
  function open(item = null) {
    setEditing(item?.id || "new");
    setForm(
      item
        ? {
            reference: item.reference,
            version: item.version,
            lines: item.materials.map((line) => ({
              sapMaterial: line.sapMaterial,
              quantityPerBox: line.quantityPerBox,
            })),
          }
        : { reference: "", version: "", lines: [emptyLine()] },
    );
    setErrors({});
  }
  function updateLine(index, field, value) {
    setForm((previous) => ({
      ...previous,
      lines: previous.lines.map((line, i) =>
        i === index ? { ...line, [field]: value } : line,
      ),
    }));
    setErrors({});
  }
  function submit(event) {
    event.preventDefault();
    const next = {};
    if (!form.reference.trim()) next.reference = "Selecciona una referencia.";
    if (!form.version.trim()) next.version = "Indica la versión.";
    if (form.reference.trim() && form.version.trim() && existingCombination)
      next.version = "Esta combinación de referencia y versión ya tiene una receta.";
    form.lines.forEach((line, index) => {
      if (!line.sapMaterial) next[`line-${index}`] = "Selecciona un material.";
      else if (form.lines.findIndex((entry) => entry.sapMaterial === line.sapMaterial) !== index)
        next[`line-${index}`] = "Este material ya está incluido en la receta.";
      else if (
        !String(line.quantityPerBox).trim() ||
        !Number.isFinite(
          Number(String(line.quantityPerBox).replace(",", ".")),
        ) ||
        Number(String(line.quantityPerBox).replace(",", ".")) <= 0
      )
        next[`quantity-${index}`] =
          "La cantidad por caja debe ser mayor a cero.";
    });
    if (editing !== "new") {
      const original = records.find((item) => item.id === editing);
      if (original) {
        const configured = configuredMaterialsFor(original.reference, original.version);
        const removed = configured.filter((code) => !form.lines.some((line) => line.sapMaterial === code));
        if (removed.length) next.materials = `No puedes retirar materiales que ya tienen configuración: ${[...new Set(removed)].join(", ")}.`;
      }
    }
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    const id = `REC-${form.reference.trim()}-${form.version.trim()}`;
    const record = {
      id,
      reference: form.reference.trim(),
      version: form.version.trim(),
      materials: form.lines.map((line) => ({
        ...availableMaterials.find((item) => item.sapMaterial === line.sapMaterial),
        quantityPerBox: String(line.quantityPerBox),
      })),
      status: "REVISION",
      audit: `${editing === "new" ? "Crear" : "Editar"} receta|${new Date().toLocaleString("es-CO")}`,
    };
    const updated = editing === "new"
      ? [record, ...records]
      : records.map((item) =>
          item.id === editing ? { ...record, status: item.status } : item,
        );
    saveRecipeRecords(updated);
    setRecords(updated);
    setEditing(null);
    setFeedback(
      `Receta ${id} ${editing === "new" ? "creada" : "actualizada"}.`,
    );
  }
  function toggle(item) {
    const next = item.status === "INACTIVO" ? "ACTIVO" : "INACTIVO";
    const updated = records.map((entry) =>
        entry.id === item.id
          ? {
              ...entry,
              status: next,
              audit: `${next === "ACTIVO" ? "Activar" : "Inactivar"} receta|${new Date().toLocaleString("es-CO")}`,
            }
          : entry,
      );
    saveRecipeRecords(updated);
    setRecords(updated);
    setFeedback(
      `Receta ${item.id} ${next === "ACTIVO" ? "activada" : "inactivada"}.`,
    );
  }
  const options = availableMaterials.map((item) => ({
    value: item.sapMaterial,
    label: `${item.sapMaterial} · ${item.name}`,
  }));
  return (
    <>
      <p className="page-eyebrow">Materiales / Recetas</p>
      <div className="page-header">
        <div>
          <h1 className="page-title">Recetas de materiales</h1>
          <p className="page-subtitle">
            Consulta y configura los materiales de cada receta.
          </p>
        </div>
      </div>
      <article className="card mt-24 standard-master-card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Recetas por Referencia + Versión</h2>
            <p className="card-subtitle">
              Revisa las cantidades por caja de cada referencia y versión.
            </p>
          </div>
          <div className="card-actions">
            <Chip preset="info">
              {filtered.length}{" "}
              {filtered.length === 1 ? "registro" : "registros"}
            </Chip>
            <Button onClick={() => open()}>Nueva receta</Button>
          </div>
        </div>
        {feedback && (
          <Toast
            visible
            variant="success"
            title="Resultado"
            description={feedback}
            onClose={() => setFeedback("")}
          />
        )}
        <div className="card-body">
          <div className="toolbar materials-toolbar">
            <TextInput
              id="recipeSearch"
              label="Buscar receta"
              placeholder="Buscar referencia, versión o material"
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
            />
            <SelectInput
              id="recipeStatus"
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
              id="recipeReference"
              label="Referencia"
              value={reference}
              options={[
                { value: "all", label: "Todas las referencias" },
                ...[...new Set(records.map((item) => item.reference))].map(
                  (value) => ({ value, label: value }),
                ),
              ]}
              onChange={(value) => {
                setReference(value);
                setPage(1);
              }}
            />
            <TableFilterReset active={Boolean(search.trim()) || status !== "all" || reference !== "all"} onReset={() => { setSearch(""); setStatus("all"); setReference("all"); setPage(1); }} />
          </div>
        </div>
        {editing && (
          <section
            className="inline-form-panel materials-inline-form"
            aria-label={editing === "new" ? "Nueva receta" : "Editar receta"}
          >
            <div className="form-heading">
              <h3>{editing === "new" ? "Nueva receta" : "Editar receta"}</h3>
              <p>
                {editing === "new"
                  ? "Selecciona la referencia, indica una versión y agrega sus materiales."
                  : "Ajusta los materiales de esta receta sin cambiar su referencia ni su versión."}
              </p>
            </div>
            <form className="form-body" onSubmit={submit} noValidate>
              <section className="section materials-recipe-identity" aria-labelledby="recipe-identity-title">
                <div className="section-heading">
                  <div>
                    <p className="section-kicker">Identidad de la receta</p>
                    <h4 id="recipe-identity-title">Referencia + Versión</h4>
                  </div>
                </div>
                <p className="materials-form-context">Cada combinación de referencia y versión debe ser única.</p>
              <div className="grid">
                <div className="field span-6">
                  <SearchSelectInput
                    id="recipe-form-reference"
                    label="Referencia"
                    helperText={editing === "new" ? "Selecciona la referencia a la que pertenecerá esta versión." : "Para otra referencia, crea una receta nueva."}
                    required
                    disabled={editing !== "new"}
                    value={form.reference}
                    options={[
                      ...new Set(records.map((item) => item.reference)),
                      "AGSTDRA",
                    ].map((value) => ({ value, label: value }))}
                    onChange={(value) => {
                      setForm((previous) => ({ ...previous, reference: value }));
                      setErrors({});
                    }}
                  />
                  {errors.reference && (
                    <span className="field-error" role="alert">
                      {errors.reference}
                    </span>
                  )}
                </div>
                <div className="field span-6">
                  <TextInput
                    id="recipe-form-version"
                    label="Versión"
                    helperText={editing === "new" ? "Indica la versión de esta referencia, por ejemplo V2." : "Para otra versión, crea una receta nueva."}
                    required
                    disabled={editing !== "new"}
                    value={form.version}
                    onChange={(value) => {
                      setForm((previous) => ({ ...previous, version: value }));
                      setErrors({});
                    }}
                  />
                  {errors.version && (
                    <span className="field-error" role="alert">
                      {errors.version}
                    </span>
                  )}
                </div>
              </div>
              {form.reference && form.version && (
                <p className={`materials-identity-preview${existingCombination ? " is-duplicate" : ""}`} role="status">
                  <span>Combinación</span>
                  <strong>{form.reference} · {form.version}</strong>
                  {existingCombination && <span>Ya existe una receta para esta combinación.</span>}
                </p>
              )}
              </section>
              <div className="section-heading">
                <div>
                  <p className="section-kicker">Composición</p>
                  <h4>Materiales por caja</h4>
                </div>
                <Button
                  variant="outlined"
                  type="button"
                  onClick={() =>
                    setForm((previous) => ({
                      ...previous,
                      lines: [...previous.lines, emptyLine()],
                    }))
                  }
                >
                  Agregar material
                </Button>
              </div>
              {form.lines.map((line, index) => (
                <div className="grid" key={index}>
                  <div className="field span-8">
                    <SearchSelectInput
                      id={`recipe-line-${index}`}
                      label={`Material ${index + 1}`}
                      helperText="Selecciona el material por código SAP."
                      required
                      value={line.sapMaterial}
                      options={options}
                      onChange={(value) =>
                        updateLine(index, "sapMaterial", value)
                      }
                    />
                    {errors[`line-${index}`] && (
                      <span className="field-error" role="alert">
                        {errors[`line-${index}`]}
                      </span>
                    )}
                  </div>
                  <div className="field span-4">
                    <TextInput
                      id={`recipe-quantity-${index}`}
                      label="Cantidad sugerida por caja"
                      helperText="Usa la unidad del material seleccionado."
                      required
                      value={line.quantityPerBox}
                      onChange={(value) =>
                        updateLine(index, "quantityPerBox", value)
                      }
                    />
                    {errors[`quantity-${index}`] && (
                      <span className="field-error" role="alert">
                        {errors[`quantity-${index}`]}
                      </span>
                    )}
                  </div>
                  {form.lines.length > 1 && (
                    <div className="field span-12 materials-recipe-remove">
                      <Button
                        variant="outlined"
                        type="button"
                        onClick={() => {
                          setForm((previous) => ({
                            ...previous,
                            lines: previous.lines.filter((_, lineIndex) => lineIndex !== index),
                          }));
                          setErrors({});
                        }}
                      >
                        Quitar material {index + 1}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              {errors.materials && <p className="field-error" role="alert">{errors.materials}</p>}
              <div className="form-actions">
                <Button
                  variant="outlined"
                  type="button"
                  onClick={() => setEditing(null)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Guardar receta</Button>
              </div>
            </form>
          </section>
        )}
        <Table
          columns={[
            {
              key: "reference",
              header: "Referencia",
              render: (item) => (
                <span className="materials-record-main">
                  <strong>{item.reference}</strong>
                  <span>Referencia</span>
                </span>
              ),
            },
            {
              key: "version",
              header: "Versión",
              render: (item) => item.version,
            },
            {
              key: "materials",
              header: "Materiales",
              render: (item) =>
                `${item.materials.length} materiales requeridos`,
            },
            {
              key: "quantity",
              header: "Cantidad sugerida por caja",
              render: (item) => (
                <span>
                  {item.materials.slice(0, 2).map((line) => (
                    <span className="block" key={line.sapMaterial}>
                      {line.sapMaterial} · {line.quantityPerBox} {line.unit}
                    </span>
                  ))}
                  {item.materials.length > 2 && (
                    <span className="muted">
                      + {item.materials.length - 2} material(es)
                    </span>
                  )}
                </span>
              ),
            },
            {
              key: "status",
              header: "Estado",
              render: (item) => (
                <Chip preset={tone(item.status)}>
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
              render: (item) => item.audit.replace("|", " · "),
            },
          ]}
          data={filtered.slice((current - 1) * size, current * size)}
          rowKey={(item) => item.id}
          minWidth="900px"
          emptyState="No hay recetas que coincidan con los filtros."
          actionsHeader="Acciones"
          actions={(item) => (
            <TableRowActions label={`Acciones de ${item.id}`}>
              <IconButton
                variant="ghost"
                aria-label={`Ver detalle de ${item.id}`}
                onClick={() => setSelected(item)}
              >
                <ViewIcon />
              </IconButton>
              <IconButton
                variant="ghost"
                aria-label={`Editar ${item.id}`}
                onClick={() => open(item)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                variant="ghost"
                aria-label={`${item.status === "INACTIVO" ? "Activar" : "Inactivar"} ${item.id}`}
                onClick={() => toggle(item)}
              >
                {item.status === "INACTIVO" ? <CheckIcon /> : <CloseIcon />}
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
          title="Detalle de receta"
          subtitle={selected.id}
          onClose={() => setSelected(null)}
          data={[
            { label: "Referencia", children: selected.reference },
            { label: "Versión", children: selected.version },
            {
              label: "Estado",
              children: (
                <Chip preset={tone(selected.status)}>{selected.status}</Chip>
              ),
            },
            {
              label: "Materiales",
              children: selected.materials.map((line) => (
                <p key={line.sapMaterial}>
                  {line.sapMaterial} · {line.name} · {line.quantityPerBox}{" "}
                  {line.unit} por caja
                </p>
              )),
            },
            {
              label: "Auditoría",
              children: selected.audit.replace("|", " · "),
            },
          ]}
        />
      )}
    </>
  );
}
