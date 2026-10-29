import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import {
  ArrowRightIcon,
  Button,
  CheckIcon,
  Chip,
  CheckboxCard,
  CloseIcon,
  EditIcon,
  Drawer,
  DrawerAuditList,
  DateInput,
  IconButton,
  Notice,
  NotificationIcon,
  NumberInput,
  Pagination,
  SelectInput,
  Table,
  TableRowActions,
  TextInput,
  Toast,
  ViewIcon
} from "@banasandev/banasan-ui";

const source = "@banasandev/banasan-ui";
const enhanced = new WeakSet();

function LinkedRoleCard({ original }) {
  const input = original.querySelector('input[type="checkbox"]');
  const [checked, setChecked] = useState(input.checked);
  useEffect(() => {
    const sync = () => setChecked(input.checked);
    input.addEventListener("change", sync);
    return () => input.removeEventListener("change", sync);
  }, [input]);
  const title = original.querySelector("strong")?.textContent.trim() || "";
  const description = original.querySelector("strong + span")?.textContent.trim() || "";
  return <CheckboxCard value={title} title={title} isChecked={checked} onChecked={(_, next) => {
    input.checked = next;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    setChecked(next);
  }}>{description}</CheckboxCard>;
}

function mountRoleCard(original) {
  if (enhanced.has(original)) return;
  const mount = document.createElement("div");
  mount.className = "sial-library-role-card";
  mount.draggable = true;
  mount.dataset.sialComponent = "CheckboxCard";
  mount.dataset.sialSource = source;
  original.before(mount);
  original.classList.add("sial-native-proxy");
  enhanced.add(original);
  flushSync(() => createRoot(mount).render(<LinkedRoleCard original={original} />));
  mount.querySelector('input[type="checkbox"]')?.setAttribute("aria-label", original.querySelector("strong")?.textContent.trim() || "Rol");
}
let filterSequence = 0;
let tableSequence = 0;

function filterLabel(select) {
  const label = select.labels?.[0]?.textContent?.trim() || select.getAttribute("aria-label");
  if (label) return label;
  const key = select.id.toLowerCase();
  if (/status|state|estado/.test(key)) return "Estado";
  if (/week|semana/.test(key)) return "Semana";
  if (/company|empresa/.test(key)) return "Empresa";
  if (key === "farmcontext") return "Sector";
  if (key === "refcontext") return "Tipo de fruta";
  if (/farm|finca/.test(key)) return "Finca";
  if (/type|tipo|categor/.test(key)) return "Tipo";
  return "Filtro";
}

function readOptions(select, label) {
  return Array.from(select.options).map((option) => ({
    value: option.value,
    label: label === "Estado" && option.value === "all"
      ? "Todos los estados"
      : option.textContent.trim(),
    disabled: option.disabled
  }));
}

function LinkedFilter({ select }) {
  const label = filterLabel(select);
  const [value, setValue] = useState(select.value);
  const [options, setOptions] = useState(() => readOptions(select, label));

  useEffect(() => {
    const syncValue = () => setValue(select.value);
    const syncOptions = () => {
      setOptions(readOptions(select, label));
      syncValue();
    };
    select.addEventListener("change", syncValue);
    const observer = new MutationObserver(syncOptions);
    observer.observe(select, { childList: true, subtree: true, characterData: true });
    return () => {
      select.removeEventListener("change", syncValue);
      observer.disconnect();
    };
  }, [select, label]);

  return <SelectInput
    id={`sial-library-${select.id || "filter"}`}
    label={label}
    value={value}
    options={options}
    onChange={(next) => {
      select.value = next;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      setValue(next);
    }}
  />;
}

function LinkedSearch({ input }) {
  const [value, setValue] = useState(input.value);
  useEffect(() => {
    const sync = () => setValue(input.value);
    input.addEventListener("input", sync);
    input.addEventListener("change", sync);
    return () => {
      input.removeEventListener("input", sync);
      input.removeEventListener("change", sync);
    };
  }, [input]);
  return <TextInput
    id={`sial-library-${input.id}`}
    label={input.getAttribute("aria-label") || input.placeholder || "Buscar"}
    value={value}
    placeholder={input.placeholder}
    onChange={(next) => {
      input.value = next;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      setValue(next);
    }}
  />;
}

function LinkedButton({ original }) {
  const read = () => ({
    label: original.textContent.trim(),
    disabled: original.disabled,
    expanded: original.getAttribute("aria-expanded")
  });
  const [state, setState] = useState(read);
  useEffect(() => {
    const observer = new MutationObserver(() => setState(read()));
    observer.observe(original, { attributes: true, attributeFilter: ["disabled", "aria-expanded"], childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [original]);
  return <Button
    variant={original.classList.contains("btn-primary") ? "filled" : "outlined"}
    disabled={state.disabled}
    aria-label={original.getAttribute("aria-label") || undefined}
    aria-controls={original.getAttribute("aria-controls") || undefined}
    aria-expanded={state.expanded === null ? undefined : state.expanded === "true"}
    onClick={(event) => {
      event.preventDefault();
      original.click();
    }}
  >{state.label}</Button>;
}

function LinkedNotice({ original }) {
  const variant = original.classList.contains("notice-warning") ? "warning"
    : original.classList.contains("notice-error") ? "error"
    : original.classList.contains("notice-success") ? "success" : "info";
  const title = original.querySelector("strong")?.textContent.trim();
  const detail = original.querySelector("span")?.textContent.trim();
  const message = detail || original.textContent.trim();
  return <Notice variant={variant} role={original.getAttribute("role") || undefined}>
    {title && detail ? <><strong>{title}</strong> {detail}</> : message}
  </Notice>;
}

function LinkedToast({ original }) {
  const read = () => ({
    visible: !original.hidden,
    title: original.dataset.sialToastTitle || "Notificación",
    description: original.querySelector("[data-additional-feedback-message]")?.textContent.trim() || original.textContent.trim(),
    variant: original.dataset.sialToastVariant || "success"
  });
  const [state, setState] = useState(read);
  useEffect(() => {
    const observer = new MutationObserver(() => setState(read()));
    observer.observe(original, { attributes: true, attributeFilter: ["hidden", "data-sial-toast-title", "data-sial-toast-variant"], childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, [original]);
  return <Toast {...state} onClose={() => { original.hidden = true; }} />;
}

function readDrawer(native) {
  const map = native.querySelector(".geo-map-panel");
  return {
    show: native.classList.contains("show"),
    title: native.querySelector(".drawer-head h3")?.textContent.trim() || "Detalle",
    subtitle: native.querySelector(".drawer-head p")?.textContent.trim() || "",
    mapHtml: map?.innerHTML || "",
    details: Array.from(native.querySelectorAll(".detail-group")).map((group) => ({
      label: group.querySelector(".detail-label")?.textContent.trim() || "",
      value: group.querySelector(".detail-value")?.textContent.trim() || "",
      audit: Array.from(group.querySelectorAll(".audit-item")).map((item) => ({
        title: item.querySelector("strong")?.textContent.trim() || "",
        meta: item.querySelector(".muted")?.textContent.trim() || ""
      }))
    }))
  };
}

function LinkedDetailDrawer({ native }) {
  const [snapshot, setSnapshot] = useState(() => readDrawer(native));
  const returnFocus = useRef(null);
  useEffect(() => {
    const captureTrigger = (event) => {
      if (event.target.closest(".sial-library-table .bui-icon-button")) {
        returnFocus.current = event.target.closest("button, a");
      }
    };
    document.addEventListener("click", captureTrigger, true);
    const observer = new MutationObserver(() => setSnapshot(readDrawer(native)));
    observer.observe(native, { attributes: true, attributeFilter: ["class", "style"], childList: true, characterData: true, subtree: true });
    return () => {
      document.removeEventListener("click", captureTrigger, true);
      observer.disconnect();
    };
  }, [native]);
  useEffect(() => {
    const panel = document.querySelector(".sial-library-detail-drawer .bui-drawer-container");
    if (panel) panel.inert = !snapshot.show;
    if (snapshot.show) requestAnimationFrame(() => panel?.querySelector(".bui-drawer-close")?.focus());
  }, [snapshot.show]);
  const close = () => {
    native.querySelector("#closeDetail")?.click();
    requestAnimationFrame(() => returnFocus.current?.focus());
  };
  const data = snapshot.details.map((detail) => ({
    label: detail.label,
    children: detail.audit.length
      ? <DrawerAuditList items={detail.audit} />
      : <>{detail.value}{detail.label === "Geolocalizacion" && snapshot.mapHtml &&
        <div className="geo-map-panel compact" dangerouslySetInnerHTML={{ __html: snapshot.mapHtml }} />}</>
  }));
  return <Drawer show={snapshot.show} onClose={close} title={snapshot.title} subtitle={snapshot.subtitle} data={data} />;
}

function readFieldState(control, note) {
  return {
    value: control.value,
    disabled: control.disabled,
    error: control.getAttribute("aria-invalid") === "true",
    message: note?.classList.contains("error") ? note.textContent.trim() : "",
    helper: note?.dataset.base || note?.textContent.trim() || ""
  };
}

function dateFromLocalValue(value) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return year && month && day ? new Date(year, month - 1, day) : null;
}

function localValueFromDate(value) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return "";
  const pad = (part) => String(part).padStart(2, "0");
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
}

function LinkedFormField({ control, label, note }) {
  const [state, setState] = useState(() => readFieldState(control, note));
  const sync = () => setState(readFieldState(control, note));
  useEffect(() => {
    const form = control.form;
    const onReset = () => requestAnimationFrame(() => {
      control.removeAttribute("aria-invalid");
      control.classList.remove("is-error");
      if (note?.dataset.base) note.textContent = note.dataset.base;
      note?.classList.remove("error", "success");
      sync();
    });
    control.addEventListener("input", sync);
    control.addEventListener("change", sync);
    form?.addEventListener("reset", onReset);
    const observer = new MutationObserver(sync);
    observer.observe(control, { attributes: true, attributeFilter: ["aria-invalid", "disabled"], childList: control.tagName === "SELECT", subtree: control.tagName === "SELECT" });
    if (note) observer.observe(note, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ["class"] });
    return () => {
      control.removeEventListener("input", sync);
      control.removeEventListener("change", sync);
      form?.removeEventListener("reset", onReset);
      observer.disconnect();
    };
  }, [control, note]);

  const common = {
    id: `sial-library-${control.id}`,
    label: label.textContent.replace(/\*/g, "").trim(),
    value: state.value,
    disabled: state.disabled,
    required: control.hasAttribute("data-required") || control.required || label.querySelector(".required") !== null,
    helperText: state.error ? undefined : state.helper,
    validate: { status: state.error, message: state.message },
    onChange: (value) => {
      control.value = value;
      control.dispatchEvent(new Event(control.tagName === "SELECT" ? "change" : "input", { bubbles: true }));
      sync();
    }
  };

  if (control.tagName === "SELECT") {
    return <SelectInput {...common} options={readOptions(control, common.label)} />;
  }
  if (control.type === "date") {
    return <DateInput {...common}
      value={dateFromLocalValue(state.value)}
      minDate={dateFromLocalValue(control.min) || undefined}
      maxDate={dateFromLocalValue(control.max) || undefined}
      onChange={(value) => {
        control.value = localValueFromDate(value);
        control.dispatchEvent(new Event("input", { bubbles: true }));
        control.dispatchEvent(new Event("change", { bubbles: true }));
        sync();
      }} />;
  }
  if (control.type === "number") {
    return <NumberInput {...common}
      value={state.value === "" ? "" : Number(state.value)}
      min={control.min === "" ? undefined : Number(control.min)}
      max={control.max === "" ? undefined : Number(control.max)}
      step={control.step === "any" || control.step === "" ? undefined : Number(control.step)}
      onChange={(value) => {
        control.value = value === null || value === undefined || Number.isNaN(value) ? "" : String(value);
        control.dispatchEvent(new Event("input", { bubbles: true }));
        control.dispatchEvent(new Event("change", { bubbles: true }));
        sync();
      }} />;
  }
  return <TextInput {...common} type={control.type === "email" ? "email" : "text"} placeholder={control.placeholder} maxLength={control.maxLength > 0 ? control.maxLength : undefined} />;
}

function LinkedBareNumber({ control }) {
  const [state, setState] = useState(() => readFieldState(control, null));
  useEffect(() => {
    const sync = () => setState(readFieldState(control, null));
    control.addEventListener("input", sync);
    control.addEventListener("change", sync);
    const observer = new MutationObserver(sync);
    observer.observe(control, { attributes: true, attributeFilter: ["aria-invalid", "disabled", "max"] });
    return () => {
      control.removeEventListener("input", sync);
      control.removeEventListener("change", sync);
      observer.disconnect();
    };
  }, [control]);
  return <NumberInput
    id={`sial-library-${control.id}`}
    value={state.value === "" ? "" : Number(state.value)}
    min={control.min === "" ? undefined : Number(control.min)}
    max={control.max === "" ? undefined : Number(control.max)}
    step={control.step === "" ? undefined : Number(control.step)}
    disabled={state.disabled}
    validate={{ status: state.error, message: state.error ? "Ingresa una cantidad válida dentro del límite disponible." : "" }}
    onChange={(value) => {
      control.value = value === null || value === undefined || Number.isNaN(value) ? "" : String(value);
      control.dispatchEvent(new Event("input", { bubbles: true }));
      control.dispatchEvent(new Event("change", { bubbles: true }));
      setState(readFieldState(control, null));
    }}
  />;
}

function LinkedCount({ count }) {
  const read = () => {
    if (count.dataset.sialRecordCount !== undefined) return Number(count.dataset.sialRecordCount) || 0;
    const numbers = count.textContent.match(/\d+/g);
    return numbers ? Number(numbers[numbers.length - 1]) : 0;
  };
  const [total, setTotal] = useState(read);
  useEffect(() => {
    const sync = (event) => setTotal(Number(event?.detail?.total ?? read()) || 0);
    count.addEventListener("sial:table-count-state", sync);
    const observer = new MutationObserver(() => sync());
    observer.observe(count, { childList: true, characterData: true, subtree: true });
    sync();
    return () => {
      count.removeEventListener("sial:table-count-state", sync);
      observer.disconnect();
    };
  }, [count]);
  return <Chip preset="info" aria-live="polite">{total} {total === 1 ? "registro" : "registros"}</Chip>;
}

function LinkedStatusChip({ original }) {
  const read = () => ({
    text: original.textContent.trim(),
    preset: original.classList.contains("status-active") ? "active"
      : original.classList.contains("status-inactive") ? "inactive" : "warning"
  });
  const [state, setState] = useState(read);
  useEffect(() => {
    const observer = new MutationObserver(() => setState(read()));
    observer.observe(original, { attributes: true, attributeFilter: ["class"], childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, [original]);
  return <Chip preset={state.preset}>{state.text}</Chip>;
}

function actionIcon(label) {
  const action = label.trim().toLowerCase();
  if (/^(visualizar|consultar|ver)\b/.test(action)) return <ViewIcon />;
  if (/^(editar|gestionar|corregir|preparar corrección|reprogramar)\b/.test(action)) return <EditIcon />;
  if (/^abrir\b/.test(action)) return <ViewIcon />;
  if (/^(continuar|ir a)\b/.test(action)) return <ArrowRightIcon />;
  if (/^notificar\b/.test(action)) return <NotificationIcon />;
  if (/^(inactivar|eliminar|desactivar|remover|quitar)\b/.test(action)) return <CloseIcon />;
  if (/^activar\b/.test(action)) return <CheckIcon />;
  if (/^copiar\b/.test(action)) return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="10" height="10" rx="2" /><path d="M5 15V7a2 2 0 0 1 2-2h8" /></svg>;
  return null;
}

function LinkedAction({ original }) {
  const [state, setState] = useState(() => ({
    label: original.getAttribute("aria-label") || "Acción",
    disabled: original.disabled || original.getAttribute("aria-disabled") === "true"
  }));
  useEffect(() => {
    const observer = new MutationObserver(() => setState({
      label: original.getAttribute("aria-label") || "Acción",
      disabled: original.disabled || original.getAttribute("aria-disabled") === "true"
    }));
    observer.observe(original, { attributes: true, attributeFilter: ["aria-label", "aria-disabled", "disabled"] });
    return () => observer.disconnect();
  }, [original]);
  const icon = actionIcon(state.label);
  if (!icon) return null;
  const variant = /^(inactivar|eliminar|desactivar|remover|quitar)\b/i.test(state.label)
    ? "sial-library-action-danger"
    : /^activar\b/i.test(state.label) ? "sial-library-action-success" : "";
  return <IconButton
    variant="ghost"
    className={variant}
    aria-label={state.label}
    title={state.label}
    disabled={state.disabled}
    onClick={() => original.click()}
  >{icon}</IconButton>;
}

function LinkedPagination({ native }) {
  const managed = native.dataset.sialPage !== undefined;
  const read = () => {
    if (managed) return {
      page: Number(native.dataset.sialPage) || 1,
      pageSize: Number(native.dataset.sialPageSize) || 10,
      total: Number(native.dataset.sialTotal) || 0,
      sizes: [10, 30, 50]
    };
    const summary = native.querySelector(".pagination-summary")?.textContent || "";
    const total = Number(summary.match(/de\s+([\d.,]+)\s+registros?/i)?.[1].replace(/[.,]/g, "")) || 0;
    const active = native.querySelector(".pagination-btn.active, .pagination-btn[aria-current='page']");
    const sizeSelect = native.querySelector(".pagination-size select");
    return {
      page: Number(active?.textContent.trim()) || 1,
      pageSize: Number(sizeSelect?.value) || 10,
      total,
      sizes: sizeSelect ? Array.from(sizeSelect.options).map((option) => Number(option.value)).filter(Boolean) : [10]
    };
  };
  const [state, setState] = useState(read);
  useEffect(() => {
    const sync = (event) => setState({ ...read(), ...(event?.detail || {}) });
    native.addEventListener("sial:table-page-state", sync);
    const observer = new MutationObserver(() => sync());
    if (!managed) observer.observe(native, { childList: true, subtree: true, characterData: true });
    sync({ detail: read() });
    return () => {
      native.removeEventListener("sial:table-page-state", sync);
      observer.disconnect();
    };
  }, [native, managed]);
  const requestPage = (page) => {
    if (managed) {
      native.dispatchEvent(new CustomEvent("sial:table-page-request", { detail: { page } }));
      return;
    }
    let current = read().page;
    for (let step = 0; current !== page && step < 25; step += 1) {
      const direction = page > current ? "Siguiente" : "Anterior";
      const button = Array.from(native.querySelectorAll(".pagination-btn"))
        .find((candidate) => candidate.textContent.trim() === direction && !candidate.disabled);
      if (!button) break;
      button.click();
      const next = read().page;
      if (next === current) break;
      current = next;
    }
  };
  return <Pagination
    page={state.page}
    pageSize={state.pageSize}
    total={state.total}
    pageSizeOptions={state.sizes || [10]}
    onPageChange={requestPage}
    onPageSizeChange={(pageSize) => {
      if (managed) {
        native.dispatchEvent(new CustomEvent("sial:table-page-size-request", { detail: { pageSize } }));
        return;
      }
      const select = native.querySelector(".pagination-size select");
      if (!select) return;
      select.value = String(pageSize);
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }}
  />;
}

function tableCellText(node) {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent;
  if (node.nodeName === "BR") return "\n";
  return Array.from(node.childNodes).map(tableCellText).join("");
}

function readMaterialCellNode(node) {
  if (node.nodeType === Node.TEXT_NODE) return { text: node.textContent };
  if (node.nodeType !== Node.ELEMENT_NODE) return null;
  if (node.classList.contains("status")) {
    const preset = node.classList.contains("status-active") ? "active"
      : node.classList.contains("status-inactive") ? "inactive" : "warning";
    return { status: preset, text: node.textContent.trim() };
  }
  const tag = node.tagName.toLowerCase();
  if (!["div", "span", "strong", "small", "em", "b", "i", "time", "br"].includes(tag)) {
    return { text: node.textContent };
  }
  return {
    tag,
    className: node.className || undefined,
    title: node.getAttribute("title") || undefined,
    ariaLabel: node.getAttribute("aria-label") || undefined,
    children: Array.from(node.childNodes).map(readMaterialCellNode).filter(Boolean)
  };
}

function renderMaterialCellNode(node, key) {
  if (node.status) return <Chip key={key} preset={node.status}>{node.text}</Chip>;
  if (!node.tag) return node.text;
  if (node.tag === "br") return <br key={key} />;
  return React.createElement(node.tag, {
    key,
    className: node.className,
    title: node.title,
    "aria-label": node.ariaLabel
  }, node.children?.map((child, index) => renderMaterialCellNode(child, `${key}-${index}`)));
}

function readFamilyTable(native) {
  const table = native.querySelector("table");
  const preserveMaterialCells = native.dataset.sialTableAdapter === "materials";
  const headers = Array.from(table?.tHead?.rows[0]?.cells || []).map((cell) => cell.textContent.trim());
  const actionIndex = headers.findIndex((header) => /^acciones?$/i.test(header));
  const rows = Array.from(table?.tBodies[0]?.rows || [])
    .filter((row) => !row.classList.contains("is-hidden") && !row.hidden)
    .map((row, index) => ({
      key: row.dataset.code || `${index}-${row.textContent.trim()}`,
      cells: Array.from(row.cells).map((cell) => ({
        text: tableCellText(cell).trim(),
        structure: preserveMaterialCells ? Array.from(cell.childNodes).map(readMaterialCellNode).filter(Boolean) : null,
        status: cell.querySelector(".status")?.classList.contains("status-active")
          ? "active"
          : cell.querySelector(".status")?.classList.contains("status-inactive") ? "inactive"
            : cell.querySelector(".status")?.classList.contains("status-warning") ? "warning" : null,
        muted: cell.classList.contains("muted")
      })),
      actions: actionIndex < 0 ? [] : Array.from(row.cells[actionIndex]?.querySelectorAll(".row-actions > button[aria-label], .row-actions > a[aria-label]") || [])
    }));
  return { headers, actionIndex, rows };
}

function LinkedFamilyTable({ native }) {
  const [snapshot, setSnapshot] = useState(() => readFamilyTable(native));
  useEffect(() => {
    const observer = new MutationObserver(() => setSnapshot(readFamilyTable(native)));
    observer.observe(native, {
      attributes: true,
      attributeFilter: ["class", "hidden", "aria-label", "disabled"],
      childList: true,
      characterData: true,
      subtree: true
    });
    return () => observer.disconnect();
  }, [native]);
  const columns = snapshot.headers.flatMap((header, index) => index === snapshot.actionIndex ? [] : [{
    key: `column-${index}`,
    header,
    width: index === 0 ? "15%" : undefined,
    render: (row) => {
      const cell = row.cells[index];
      if (cell.structure) return <div className={cell.muted ? "sial-library-table-muted" : "sial-library-table-cell"}>
        {cell.structure.map((node, nodeIndex) => renderMaterialCellNode(node, `cell-${index}-${nodeIndex}`))}
      </div>;
      if (cell.status) return <Chip preset={cell.status}>{cell.text}</Chip>;
      return <span className={cell.muted ? "sial-library-table-muted" : "sial-library-table-cell"}>{cell.text}</span>;
    }
  }]);
  const emptyText = native.parentElement?.querySelector(".empty-state")?.textContent?.trim()
    || "No hay registros que coincidan con los filtros.";
  return <Table
    columns={columns}
    data={snapshot.rows}
    rowKey={(row) => row.key}
    minWidth={columns.length >= 8 ? "1180px" : columns.length > 4 ? "900px" : "760px"}
    emptyState={emptyText}
    actionsHeader={snapshot.actionIndex >= 0 ? snapshot.headers[snapshot.actionIndex] : undefined}
    actionsWidth={snapshot.rows.some((row) => row.actions.length > 3) ? "190px" : "160px"}
    actions={snapshot.actionIndex < 0 ? undefined : (row) => <TableRowActions label={`Acciones de ${row.key}`}>
      {row.actions.map((original, index) => {
        const label = original.getAttribute("aria-label") || "Acción";
        const icon = actionIcon(label);
        if (!icon) return null;
        const tone = /^(inactivar|eliminar|desactivar|remover)\b/i.test(label)
          ? "sial-library-action-danger"
          : /^activar\b/i.test(label) ? "sial-library-action-success" : "";
        return <IconButton
          key={`${label}-${index}`}
          variant="ghost"
          className={tone}
          aria-label={label}
          title={label}
          disabled={original.disabled || original.getAttribute("aria-disabled") === "true"}
          onClick={() => original.click()}
        >{icon}</IconButton>;
      })}
    </TableRowActions>}
  />;
}

function mountFilter(select) {
  if (enhanced.has(select) || select.closest("[data-sial-react-view], [data-sial-component]")) return;
  if (!select.id) select.id = `sial-table-filter-${++filterSequence}`;
  const mount = document.createElement("div");
  mount.className = "sial-library-filter";
  mount.dataset.sialComponent = "SelectInput";
  mount.dataset.sialSource = source;
  select.before(mount);
  select.classList.add("sial-native-proxy");
  enhanced.add(select);
  flushSync(() => createRoot(mount).render(<LinkedFilter select={select} />));
}

function mountSearch(input) {
  if (enhanced.has(input) || !input.id || input.closest("[data-sial-react-view]")) return;
  const mount = document.createElement("div");
  mount.className = "sial-library-search";
  mount.dataset.sialComponent = "TextInput";
  mount.dataset.sialSource = source;
  input.before(mount);
  input.classList.add("sial-native-proxy");
  enhanced.add(input);
  flushSync(() => createRoot(mount).render(<LinkedSearch input={input} />));
  mount.querySelector("input")?.setAttribute("role", "searchbox");
}

function mountButton(original) {
  if (enhanced.has(original) || original.closest("[data-sial-react-view]")) return;
  const mount = document.createElement("span");
  mount.className = "sial-library-button";
  mount.dataset.sialComponent = "Button";
  mount.dataset.sialSource = source;
  original.before(mount);
  original.classList.add("sial-native-proxy");
  enhanced.add(original);
  flushSync(() => createRoot(mount).render(<LinkedButton original={original} />));
}

function mountNotice(original) {
  if (enhanced.has(original) || original.closest("[data-sial-react-view]")) return;
  const mount = document.createElement("div");
  mount.className = "sial-library-notice";
  mount.dataset.sialComponent = "Notice";
  mount.dataset.sialSource = source;
  original.before(mount);
  original.classList.add("sial-native-proxy");
  enhanced.add(original);
  flushSync(() => createRoot(mount).render(<LinkedNotice original={original} />));
}

function mountToast(original) {
  if (enhanced.has(original) || original.closest("[data-sial-react-view]")) return;
  const mount = document.createElement("div");
  mount.className = "sial-library-toast";
  mount.dataset.sialComponent = "Toast";
  mount.dataset.sialSource = source;
  original.before(mount);
  original.classList.add("sial-native-proxy");
  enhanced.add(original);
  flushSync(() => createRoot(mount).render(<LinkedToast original={original} />));
}

function mountDetailDrawer(native) {
  if (enhanced.has(native)) return;
  const mount = document.createElement("div");
  mount.className = "sial-library-detail-drawer";
  mount.dataset.sialComponent = "Drawer";
  mount.dataset.sialSource = source;
  native.before(mount);
  native.classList.add("sial-native-proxy");
  document.querySelector("#detailBackdrop")?.classList.add("sial-native-proxy");
  enhanced.add(native);
  flushSync(() => createRoot(mount).render(<LinkedDetailDrawer native={native} />));
}

function mountFormField(field) {
  const control = field.querySelector(":scope > input.input, :scope > select.select");
  const label = field.querySelector(":scope > label.label");
  if (!control || !label || !control.id || enhanced.has(control)) return;
  if (control.tagName === "INPUT" && !["", "text", "email", "number", "date"].includes(control.type)) return;
  const note = field.querySelector(":scope > .field-note");
  const mount = document.createElement("div");
  mount.className = "sial-library-field";
  mount.dataset.sialComponent = control.tagName === "SELECT" ? "SelectInput" : control.type === "date" ? "DateInput" : control.type === "number" ? "NumberInput" : "TextInput";
  mount.dataset.sialSource = source;
  field.prepend(mount);
  enhanced.add(control);
  flushSync(() => createRoot(mount).render(<LinkedFormField control={control} label={label} note={note} />));
  field.classList.add("sial-library-field-ready");
}

function mountAdjustmentNumber(group) {
  const control = group.querySelector('input[type="number"][data-requested]');
  const label = group.querySelector('.adjust-request-label');
  if (!control || !label || enhanced.has(control)) return;
  const mount = document.createElement("div");
  mount.className = "sial-library-adjust-number";
  mount.dataset.sialComponent = "NumberInput";
  mount.dataset.sialSource = source;
  control.before(mount);
  control.classList.add("sial-native-proxy");
  enhanced.add(control);
  flushSync(() => createRoot(mount).render(<LinkedFormField control={control} label={label} note={null} />));
  mount.querySelector('input[type="number"]')?.setAttribute("aria-label", control.getAttribute("aria-label") || label.textContent.trim());
  group.classList.add("sial-library-adjust-ready");
}

function mountApprovalNumber(control) {
  if (enhanced.has(control)) return;
  if (!control.id) control.id = `sial-approval-number-${++filterSequence}`;
  const mount = document.createElement("div");
  mount.className = "sial-library-approval-number";
  mount.dataset.sialComponent = "NumberInput";
  mount.dataset.sialSource = source;
  control.before(mount);
  control.classList.add("sial-native-proxy");
  enhanced.add(control);
  flushSync(() => createRoot(mount).render(<LinkedBareNumber control={control} />));
  mount.querySelector('input[type="number"]')?.setAttribute("aria-label", control.getAttribute("aria-label") || "Cantidad entregable");
}

function mountCount(count) {
  if (enhanced.has(count) || count.closest("[data-sial-react-view]")) return;
  const mount = document.createElement("span");
  mount.className = "sial-library-count";
  mount.dataset.sialComponent = "Chip";
  mount.dataset.sialSource = source;
  count.before(mount);
  count.classList.add("sial-native-proxy");
  enhanced.add(count);
  flushSync(() => createRoot(mount).render(<LinkedCount count={count} />));
}

function mountStatusChip(original) {
  if (enhanced.has(original) || original.closest("[data-sial-react-view]")) return;
  const mount = document.createElement("span");
  mount.className = "sial-library-status";
  mount.dataset.sialComponent = "Chip";
  mount.dataset.sialSource = source;
  original.after(mount);
  original.classList.add("sial-native-proxy");
  enhanced.add(original);
  flushSync(() => createRoot(mount).render(<LinkedStatusChip original={original} />));
}

function mountAction(original) {
  if (enhanced.has(original) || original.closest("[data-sial-react-view]")) return;
  if (!actionIcon(original.getAttribute("aria-label") || "")) return;
  const mount = document.createElement("span");
  mount.className = "sial-library-action";
  mount.dataset.sialComponent = "IconButton";
  mount.dataset.sialSource = source;
  original.after(mount);
  original.classList.add("sial-native-proxy");
  enhanced.add(original);
  flushSync(() => createRoot(mount).render(<LinkedAction original={original} />));
}

function mountPagination(native) {
  if (enhanced.has(native) || native.closest("[data-sial-react-view]")) return;
  if (native.dataset.sialPage === undefined && !native.querySelector(".pagination-summary")) return;
  const mount = document.createElement("div");
  mount.className = "sial-library-pagination";
  mount.dataset.sialComponent = "Pagination";
  mount.dataset.sialSource = source;
  native.after(mount);
  native.classList.add("sial-native-proxy");
  enhanced.add(native);
  flushSync(() => createRoot(mount).render(<LinkedPagination native={native} />));
}

function mountFamilyTable(native) {
  if (enhanced.has(native) || native.closest("[data-sial-react-view]")) return;
  const sourceTable = native.querySelector("table");
  const card = native.closest(".card");
  const exportButton = card?.querySelector("[data-export-table]:not([data-export-target])");
  if (sourceTable && exportButton) {
    if (!sourceTable.id) sourceTable.id = `sial-export-source-${++tableSequence}`;
    exportButton.dataset.exportTarget = `#${sourceTable.id}`;
  }
  const mount = document.createElement("div");
  mount.className = "sial-library-table";
  mount.dataset.sialComponent = "Table";
  mount.dataset.sialSource = source;
  native.before(mount);
  native.classList.add("sial-native-proxy");
  native.parentElement?.querySelector(".empty-state")?.classList.add("sial-native-proxy");
  enhanced.add(native);
  flushSync(() => createRoot(mount).render(<LinkedFamilyTable native={native} />));
}

export function mountLegacyTableControls() {
  if (document.querySelector("[data-sial-react-view]")) return;
  const scan = () => {
    document.querySelectorAll('.table-wrap[data-sial-table-adapter="simple"], .table-wrap[data-sial-table-adapter="materials"], main[data-sial-catalog-actions] .table-wrap').forEach(mountFamilyTable);
    document.querySelectorAll(".inline-form-panel .field[data-sial-form-control], .form-card .field[data-sial-form-control], .additional-form .field[data-sial-form-control], .recurring-form-grid .field[data-sial-form-control], .materials-date-range .field[data-sial-form-control]").forEach(mountFormField);
    document.querySelectorAll(".adjust-request-group[data-sial-number-adapter]").forEach(mountAdjustmentNumber);
    document.querySelectorAll(".approval-availability input[data-approved][type=number]").forEach(mountApprovalNumber);
    document.querySelectorAll("[data-sial-role-card-adapter] .role-option").forEach(mountRoleCard);
    document.querySelectorAll("main .toolbar input[data-sial-search-adapter], main .workflow-filters input[data-sial-search-adapter], main .trace-search-input input[data-sial-search-adapter], main .permission-toolbar input[data-sial-search-adapter], main[data-sial-catalog-actions] .toolbar input[type=search]").forEach(mountSearch);
    document.querySelectorAll("button.btn[data-sial-button-adapter], article[data-sial-catalog-actions] .card-actions > button.btn, article[data-sial-catalog-actions] .inline-form-panel .form-actions > button.btn, main[data-sial-catalog-actions] .card-actions > button.btn, .form-card[data-sial-form-adapter] .form-actions > button.btn, .form-card[data-sial-form-adapter] [data-geo-locate], .form-card[data-sial-form-adapter] [data-sial-plan-action], .permission-toolbar .permission-actions > button.btn").forEach(mountButton);
    document.querySelectorAll(".drawer[data-sial-drawer-adapter]:not([data-sial-drawer-local]), main[data-sial-catalog-actions] .drawer:not([data-sial-drawer-local])").forEach(mountDetailDrawer);
    document.querySelectorAll("main .page > .notice[data-sial-notice-adapter]").forEach(mountNotice);
    document.querySelectorAll("main .page > [data-sial-toast-adapter]").forEach(mountToast);
    document.querySelectorAll("main .toolbar select.select, main .workflow-filters select.select, main .permission-toolbar select.select").forEach((select) => {
      if (!select.closest(".inline-form-panel, form")) mountFilter(select);
    });
    document.querySelectorAll(".card-actions .chip").forEach((count) => {
      if (count.dataset.sialRecordCount !== undefined || /\bregistros?\b/i.test(count.textContent)) mountCount(count);
    });
    document.querySelectorAll(".table-wrap:not(.sial-native-proxy) .status[data-sial-chip-adapter], main .page .status[data-sial-chip-adapter]:not(.sial-native-proxy)").forEach((status) => { if (!status.closest(".table-wrap.sial-native-proxy")) mountStatusChip(status); });
    document.querySelectorAll(".approval-order-card .status, .approval-context-head > .status, .approval-order-state-current > .status, .approval-order-state--closed > .status, .approval-decision > .status, .recurring-review-heading .status, .additional-source-header > .status, .additional-submit-status > .status, .additional-page-header .card-actions > .status, .additional-line-result > .status, .tracking-detail .card-header > .status, .tracking-detail .order-material-response > .status, .suggest-workspace-head > .status, [data-adjustment-root] > .card > .card-header > .status, [data-adjustment-root] [data-margin-state] > .status, #materialDetailDrawer .detail-value > .status").forEach(mountStatusChip);
    document.querySelectorAll(".table-wrap:not([data-sial-table-adapter]):not(.sial-native-proxy) .row-actions > .icon-btn[aria-label], .additional-material-line-main > .additional-remove[aria-label]").forEach(mountAction);
    document.querySelectorAll(".table-pagination").forEach(mountPagination);
  };
  scan();
  document.documentElement.dataset.sialLibraryControls = "ready";
  let scheduled = false;
  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      scan();
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
