import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Table, TableRowActions, Chip, IconButton, ViewIcon, EditIcon, ArrowRightIcon } from "@banasandev/banasan-ui";

const source = "@banasandev/banasan-ui";
function readRows(native) {
  return Array.from(native.querySelectorAll("[data-hub-row]")).map((tr) => {
    const cells = tr.cells;
    const status = cells[4].querySelector(".status");
    return {
      id: tr.dataset.hubRow,
      detail: cells[0].querySelector("a")?.getAttribute("href"),
      owner: cells[0].querySelector(".cut-hub-meta")?.textContent || "",
      week: cells[1].textContent.trim(),
      type: cells[2].querySelector("strong")?.textContent || "",
      version: cells[2].querySelector(".cut-hub-meta")?.textContent || "",
      scope: Array.from(cells[3].querySelectorAll(".cut-hub-scope > span")).map((node) => ({ amount: node.querySelector("strong")?.textContent || "", label: Array.from(node.childNodes).filter((child) => child.nodeType === Node.TEXT_NODE).map((child) => child.textContent).join("").trim() })),
      status: status?.textContent.trim() || "",
      tone: status?.classList.contains("status-active") ? "active" : status?.classList.contains("status-inactive") ? "inactive" : "warning",
      updated: cells[5].querySelector("strong")?.textContent || "",
      note: cells[5].querySelector(".cut-hub-meta")?.textContent || "",
      actions: Array.from(cells[6].querySelectorAll(".row-actions > a")).map((node) => ({ href: node.getAttribute("href"), label: node.getAttribute("aria-label") || "Acción" }))
    };
  });
}

function CutHubTable({ native }) {
  const [rows, setRows] = useState(() => readRows(native));
  useEffect(() => {
    const observer = new MutationObserver(() => setRows(readRows(native)));
    observer.observe(native.querySelector("tbody"), { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [native]);
  if (!rows.length) return null;
  const columns = [
    { key: "notice", header: "Aviso", width: "175px", render: row => <><a className="cut-hub-code" href={row.detail}>{row.id}</a><span className="cut-hub-meta">{row.owner}</span></> },
    { key: "week", header: "Semana", width: "110px", render: row => <strong>{row.week}</strong> },
    { key: "type", header: "Tipo y versión", width: "125px", render: row => <><strong>{row.type}</strong><span className="cut-hub-meta">{row.version}</span></> },
    { key: "scope", header: "Alcance", width: "245px", render: row => <div className="cut-hub-scope">{row.scope.map((part, index) => <span key={index}><strong>{part.amount}</strong> {part.label}</span>)}</div> },
    { key: "status", header: "Estado", width: "175px", render: row => <Chip preset={row.tone}>{row.status}</Chip> },
    { key: "updated", header: "Última actualización", width: "160px", render: row => <><strong>{row.updated}</strong><span className="cut-hub-meta">{row.note}</span></> }
  ];
  return <Table columns={columns} data={rows} rowKey={row => row.id} rowProps={row => ({ "data-visible-hub-row": row.id })} minWidth="1110px" tableClassName="cut-hub-table" actionsHeader="Acciones" actionsWidth="120px" actions={row => <TableRowActions label={`Acciones de ${row.id}`}>{row.actions.map(action => {
    const Icon = /^Consultar/.test(action.label) ? ViewIcon : /^Continuar/.test(action.label) ? ArrowRightIcon : EditIcon;
    return <IconButton key={action.label} variant="ghost" aria-label={action.label} title={action.label} onClick={() => { if (action.href) window.location.assign(action.href); }}><Icon /></IconButton>;
  })}</TableRowActions>} />;
}

export function mountCutHubTable() {
  const native = document.querySelector(".cut-hub-table-wrap");
  if (!native || native.dataset.sialCutHubMounted === "true") return;
  native.dataset.sialCutHubMounted = "true";
  const host = document.createElement("div");
  host.className = "sial-library-cut-hub";
  host.dataset.sialComponent = "Table";
  host.dataset.sialSource = source;
  native.before(host);
  native.classList.add("sial-native-proxy");
  createRoot(host).render(<CutHubTable native={native} />);
}
