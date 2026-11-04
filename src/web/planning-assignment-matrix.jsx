import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Chip, DateInput, IconButton, NumberInput, SelectInput, TextInput, CloseIcon } from "@banasandev/banasan-ui";

const mounted = new WeakSet();
const fromDate = (value) => value ? new Date(`${value}T00:00:00`) : null;
const toDate = (value) => value instanceof Date && !Number.isNaN(value.getTime())
  ? `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}` : "";

function snapshot(native) {
  return Array.from(native.querySelectorAll("[data-assignment-row]")).map((row) => ({
    key: row.dataset.assignmentRow,
    className: row.className,
    cells: Array.from(row.cells).map((cell) => {
      const input = cell.querySelector("[data-field]");
      const button = cell.querySelector("[data-remove-row]");
      const status = cell.querySelector("[data-sial-chip-adapter]");
      if (input) return { field: input.dataset.field, type: input.tagName === "SELECT" ? "select" : input.type,
        value: input.value, label: input.getAttribute("aria-label"), disabled: input.disabled,
        min: input.min === "" ? undefined : Number(input.min),
        options: input.options ? Array.from(input.options, option => ({ value: option.value, label: option.textContent })) : undefined };
      if (button) return { action: true, disabled: button.disabled, label: button.getAttribute("aria-label") };
      if (status) return { status: status.classList.contains("status-inactive") ? "inactive" : status.classList.contains("status-warning") ? "warning" : "active", text: status.textContent, title: cell.title };
      return { text: cell.textContent, className: cell.className };
    })
  }));
}

function Matrix({ native }) {
  const [rows, setRows] = useState(() => snapshot(native));
  const host = useRef(null);
  const previousKeys = useRef(rows.map(row => row.key));
  useEffect(() => {
    const added = rows.find(row => !previousKeys.current.includes(row.key));
    if (added) document.getElementById(`assignment-${added.key}-cutDate`)?.focus({ preventScroll: true });
    previousKeys.current = rows.map(row => row.key);
  }, [rows]);
  useEffect(() => {
    const observer = new MutationObserver(() => setRows(snapshot(native)));
    observer.observe(native, { subtree: true, childList: true, attributes: true, characterData: true });
    return () => observer.disconnect();
  }, [native]);
  const findRow = (key) => Array.from(native.querySelectorAll("[data-assignment-row]")).find(row => row.dataset.assignmentRow === key);
  const update = (key, field, value) => {
    const control = Array.from(findRow(key)?.querySelectorAll("[data-field]") || []).find(input => input.dataset.field === field);
    if (!control) return;
    control.value = value ?? "";
    control.dispatchEvent(new Event(control.tagName === "SELECT" ? "change" : "input", { bubbles: true }));
    setRows(snapshot(native));
  };
  return <div ref={host} className="table-wrap cut-create-scroll" tabIndex={0} aria-label="Matriz de asignaciones del aviso" onKeyDown={event => {
    if (event.key !== "Enter" || event.target.tagName !== "INPUT") return;
    const controls = Array.from(host.current.querySelectorAll('.planning-matrix-field input:not(:disabled), .planning-matrix-field button[id]:not(:disabled)'));
    const next = controls[controls.indexOf(event.target) + 1];
    if (next) { event.preventDefault(); next.focus(); }
  }}>
    <table className="cut-create-table" aria-label="Asignaciones del aviso">
      <colgroup dangerouslySetInnerHTML={{ __html: native.querySelector("colgroup").innerHTML }} />
      <thead dangerouslySetInnerHTML={{ __html: native.querySelector("thead").innerHTML }} />
      <tbody>{rows.length ? rows.map(row => <tr key={row.key} className={row.className}>{row.cells.map((cell, index) => {
        const id = `assignment-${row.key}-${cell.field}`;
        const props = { id, value: cell.value, disabled: cell.disabled, onChange: value => update(row.key, cell.field, value) };
        return <td key={cell.field || index} className={cell.className}>
          {cell.field ? <div className="planning-matrix-field" data-matrix-field={cell.field} data-sial-component={cell.type === "select" ? "SelectInput" : cell.type === "date" ? "DateInput" : cell.type === "number" ? "NumberInput" : "TextInput"}>
            <label className="planning-matrix-label" htmlFor={id}>{cell.label}</label>
            {cell.type === "select" ? <SelectInput {...props} options={cell.options} />
              : cell.type === "date" ? <DateInput {...props} value={fromDate(cell.value)} onChange={value => update(row.key, cell.field, toDate(value))} />
              : cell.type === "number" ? <NumberInput {...props} value={cell.value === "" ? "" : Number(cell.value)} min={cell.min} />
              : <TextInput {...props} />}
          </div> : cell.action ? <IconButton variant="ghost" aria-label={cell.label} disabled={cell.disabled} onClick={() => findRow(row.key)?.querySelector("[data-remove-row]")?.click()}><CloseIcon /></IconButton>
            : cell.status ? <span title={cell.title}><Chip preset={cell.status}>{cell.text}</Chip></span> : cell.text}
        </td>;
      })}</tr>) : <tr><td colSpan={16}><div className="empty-state show">Aún no hay asignaciones. Agrega una fila o carga información existente.</div></td></tr>}</tbody>
    </table>
  </div>;
}

export function mountPlanningAssignmentMatrix() {
  const native = document.querySelector("[data-planning-assignment-matrix]");
  if (!native || mounted.has(native)) return;
  mounted.add(native);
  const host = document.createElement("div");
  host.className = "planning-assignment-matrix";
  host.dataset.sialComposition = "grouped-editable-matrix";
  native.before(host);
  native.classList.add("sial-native-proxy");
  createRoot(host).render(<Matrix native={native} />);
}
