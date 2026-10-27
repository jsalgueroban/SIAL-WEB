import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRightIcon, Button, Chip, IconButton, Pagination, SelectInput, Table, TableRowActions, TextInput, ViewIcon } from "@banasandev/banasan-ui";
import { Area, CartesianGrid, ComposedChart, LabelList, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { aggregateStages, deliveryControlCases, deliveryStages, getCaseReading } from "./materials-delivery-control-data.js";

const fmt = (value) => value === null ? "Sin dato" : new Intl.NumberFormat("es-CO").format(value);
const materialId = (item) => `${item.materialCode}|${item.unit}`;
const unique = (values) => [...new Set(values)];
const stageColors = { flow: "#2c72ba", gap: "#d79b47" };

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

function StageFlowChart({ totals, unit, activeStage, hasCases, reducedMotion }) {
  const chartData = deliveryStages.map((entry) => ({
    key: entry.key,
    label: ({ approved: "Aprobado", programmed: "Programado", dispatched: "Despachado", delivered: "Con POD" })[entry.key],
    fullLabel: entry.label,
    value: totals[entry.key]
  }));
  return <div className="control-chart-panel">
    {hasCases ? <div className="control-chart-scroll"><div className="control-chart-canvas" role="img" aria-label={`Gráfica del avance por etapa en ${unit}: ${chartData.map((item) => `${item.fullLabel}, ${fmt(item.value)}`).join("; ")}.`}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 36, right: 37, bottom: 7, left: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--color-border-subtle)" strokeDasharray="3 5" />
          <XAxis dataKey="label" tick={{ fill: "var(--color-text-2)", fontSize: 11 }} axisLine={false} tickLine={false} interval={0} padding={{ left: 28, right: 12 }} />
          <YAxis tick={{ fill: "var(--color-text-2)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmt} tickCount={5} width={42} domain={[0, (dataMax) => Math.ceil(dataMax * 1.25 / 100) * 100]} />
          <Tooltip formatter={(value) => [`${fmt(value)} ${unit}`, "Cantidad"]} labelFormatter={(_, payload) => payload?.[0]?.payload?.fullLabel || "Etapa"} contentStyle={{ background: "var(--color-surface)", borderColor: "var(--color-border)", borderRadius: 10, color: "var(--color-text)" }} />
          <Area type="linear" dataKey="value" fill={stageColors.flow} fillOpacity={.09} stroke="none" connectNulls={false} isAnimationActive={!reducedMotion} animationDuration={500} />
          <Line type="linear" dataKey="value" stroke={stageColors.flow} strokeWidth={3} connectNulls={false} dot={(props) => <circle key={props.key} cx={props.cx} cy={props.cy} r={props.payload.key === activeStage ? 7 : 5} fill="var(--color-surface)" stroke={stageColors.flow} strokeWidth={3} />} activeDot={{ r: 8 }} isAnimationActive={!reducedMotion} animationDuration={500}>
            <LabelList dataKey="value" position="top" offset={12} formatter={(value) => value === null ? "" : fmt(value)} style={{ fill: "var(--color-text)", fontSize: 12, fontWeight: 650 }} />
          </Line>
        </ComposedChart>
      </ResponsiveContainer>
    </div></div> : <p className="control-chart-empty">Selecciona un material y filtros con casos para ver el avance.</p>}
    <p className="control-chart-note">Cada punto es una etapa, no una fecha. Escala desde cero · {unit}</p>
  </div>;
}

function GapSummary({ totals, unit }) {
  const gaps = [
    { key: "planning", from: "approved", to: "programmed", label: "Aprobado → programado", positive: "Sin programar", negative: "Exceso programado" },
    { key: "departure", from: "programmed", to: "dispatched", label: "Programado → despachado", positive: "Sin salida", negative: "Salida mayor al plan" },
    { key: "pod", from: "dispatched", to: "delivered", label: "Despachado → con POD", positive: "Sin POD conciliado", negative: "Entrega mayor al despacho" }
  ].map((entry) => ({ ...entry, delta: totals[entry.from] === null || totals[entry.to] === null ? null : totals[entry.from] - totals[entry.to] }));
  return <div className="control-gap-summary" aria-label="Brechas entre etapas">
    {gaps.map((entry) => <div key={entry.key} className={`control-gap-item${entry.delta !== null && entry.delta < 0 ? " is-over" : ""}`}>
      <span>{entry.label}</span>
      <strong>{entry.delta === null ? "Sin dato" : `${fmt(Math.abs(entry.delta))} ${unit}`}</strong>
      <small>{entry.delta === null ? "Falta una magnitud" : entry.delta === 0 ? "Sin diferencia" : entry.delta > 0 ? entry.positive : entry.negative}</small>
    </div>)}
  </div>;
}

function Quantity({ value, unit }) {
  return value === null ? <span className="control-unavailable">Sin dato</span> : <span className="control-number">{fmt(value)} <small>{unit}</small></span>;
}

function CaseDetail({ item, onClose, detailRef }) {
  return <section ref={detailRef} className="control-case-detail" aria-label={`Detalle de ${item.id}`} tabIndex={-1}>
    <div className="control-detail-heading"><div><h3>{item.id}</h3><p>{item.farm} · {item.material} · {item.unit}</p></div><Button variant="outlined" onClick={onClose}>Cerrar detalle</Button></div>
    <dl className="control-detail-context">
      <div><dt>Origen</dt><dd>{item.document}</dd></div>
      <div><dt>Aviso de Corte</dt><dd>{item.notice ? `${item.notice} · ${item.noticeVersion}` : "Sin aviso de corte"}</dd></div>
      <div><dt>Orden de transporte</dt><dd>{item.order}</dd></div>
      <div><dt>Entrega / POD</dt><dd>{item.delivery || "Sin entrega"} · {item.pod || "Sin POD validado"}</dd></div>
    </dl>
    <div className="control-vehicle-plan">
      <div className="control-vehicle-heading"><div><h4>Programación en vehículos</h4><p>Viajes vinculados a la orden {item.order}</p></div><strong>{fmt(item.programmed)} {item.unit} programados</strong></div>
      <div className="control-vehicle-list">
        {item.vehicleAssignments.map((assignment) => <div className="control-vehicle-row" key={assignment.trip}>
          <span><small>Viaje</small><strong>{assignment.trip}</strong></span>
          <span><small>Vehículo</small><strong>{assignment.vehicle}</strong></span>
          <span><small>Asignado</small><strong>{fmt(assignment.quantity)} {item.unit}</strong></span>
        </div>)}
      </div>
      {item.programmed > item.approved && <p className="control-vehicle-warning">La asignación supera en {fmt(item.programmed - item.approved)} {item.unit} lo aprobado en Materiales.</p>}
    </div>
    <div className="control-detail-stages">
      {deliveryStages.map((stage) => <div key={stage.key} className="control-detail-stage">
        <div><span>{stage.label}</span><Quantity value={item[stage.key]} unit={item.unit} /></div>
        <a href={stage.href}>{stage.link} <ArrowRightIcon size={15} aria-hidden="true" /></a>
      </div>)}
    </div>
    <p className="control-detail-updated">Última actualización del caso: {item.updated}</p>
  </section>;
}

export function MaterialsDeliveryControl() {
  const reducedMotion = useReducedMotion();
  const [farm, setFarm] = useState("all");
  const [notice, setNotice] = useState("all");
  const [material, setMaterial] = useState("101279|UN");
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("approved");
  const [activeAlert, setActiveAlert] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const detailRef = useRef(null);
  const casesRef = useRef(null);
  const inspectTrigger = useRef(null);
  const farmOptions = [{ value: "all", label: "Todas las fincas" }, ...unique(deliveryControlCases.map((item) => item.farm)).map((value) => ({ value, label: value }))];
  const noticeOptions = [{ value: "all", label: "Todos los avisos" }, ...unique(deliveryControlCases.map((item) => item.notice || "none")).map((value) => ({ value, label: value === "none" ? "Sin aviso de corte" : value }))];
  const materialOptions = [{ value: "all", label: "Todos los materiales" }, ...unique(deliveryControlCases.map(materialId)).map((value) => {
    const item = deliveryControlCases.find((entry) => materialId(entry) === value);
    return { value, label: `${item.material} · ${item.unit}` };
  })];
  const scopeCases = useMemo(() => deliveryControlCases.filter((item) => {
    const query = search.trim().toLocaleLowerCase("es-CO");
    const haystack = `${item.id} ${item.document} ${item.order} ${item.materialCode} ${item.material} ${item.farm}`.toLocaleLowerCase("es-CO");
    return (farm === "all" || item.farm === farm) && (notice === "all" || (item.notice || "none") === notice) && (!query || haystack.includes(query));
  }), [farm, notice, search]);
  const filtered = useMemo(() => scopeCases.filter((item) => material === "all" || materialId(item) === material), [scopeCases, material]);
  const focusedMaterial = material === "all" ? null : deliveryControlCases.find((item) => materialId(item) === material);
  const focusedCases = focusedMaterial ? filtered : [];
  const totals = aggregateStages(focusedCases);
  const activeStage = deliveryStages.find((item) => item.key === stage);
  const filtersActive = farm !== "all" || notice !== "all" || material !== "101279|UN" || Boolean(search.trim());
  const alerts = [
    { key: "overprogrammed", label: "Sobreprogramados", short: ["sobreprogramado", "sobreprogramados"], cases: scopeCases.filter((item) => item.programmed > item.approved) },
    { key: "pendingPod", label: "Entrega / POD por conciliar", short: ["entrega/POD por conciliar", "entregas/POD por conciliar"], cases: scopeCases.filter((item) => item.dispatched !== null && (item.delivered === null || item.delivered < item.dispatched)) },
    { key: "noDeparture", label: "Sin despacho confirmado", short: ["sin despacho confirmado", "sin despacho confirmado"], cases: scopeCases.filter((item) => item.dispatched === null) }
  ];
  const openAlert = alerts.find((alert) => alert.key === activeAlert);
  const tableCases = openAlert ? openAlert.cases : filtered;
  const currentPage = Math.min(page, Math.max(1, Math.ceil(tableCases.length / pageSize)));
  const rows = tableCases.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const selected = tableCases.find((item) => item.id === selectedId);

  useEffect(() => {
    if (selectedId) detailRef.current?.focus();
  }, [selectedId]);

  function changeFilter(setter, value) { setter(value); setPage(1); setSelectedId(null); setActiveAlert(null); }
  function inspect(item) {
    inspectTrigger.current = document.activeElement;
    if (activeAlert) setMaterial(materialId(item));
    setSelectedId(item.id);
    requestAnimationFrame(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  }
  function selectAlert(key) {
    setActiveAlert(activeAlert === key ? null : key);
    setSelectedId(null);
    setPage(1);
    requestAnimationFrame(() => casesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
  function closeDetail() { setSelectedId(null); requestAnimationFrame(() => inspectTrigger.current?.focus()); }
  const columns = [
    { key: "id", header: "Pedido / origen", render: (item) => <span className="control-table-primary"><strong>{item.id}</strong><small>{item.document}</small></span> },
    { key: "farm", header: "Finca", render: (item) => item.farm },
    { key: "material", header: "Material", render: (item) => <span className="control-table-primary"><strong>{item.material}</strong><small>{item.materialCode} · {item.unit}</small></span> },
    ...deliveryStages.map((entry) => ({ key: entry.key, header: ({ approved: "Aprobado", programmed: "Programado", dispatched: "Despachado", delivered: "Con POD" })[entry.key], render: (item) => <Quantity value={item[entry.key]} unit={item.unit} /> })),
    { key: "reading", header: "Lectura", render: (item) => { const reading = getCaseReading(item); return <Chip preset={reading.preset}>{reading.label}</Chip>; } }
  ];

  return <div className="delivery-control">
    <header className="control-page-heading"><div><h1>Control de trazabilidad y entregas</h1><p>Compara lo autorizado, lo preparado para el traslado, la salida efectiva y la recepción con POD.</p>{alerts.some((alert) => alert.cases.length) && <div className="control-attention" aria-label="Alertas para todos los materiales en la búsqueda"><span>Atención</span>{alerts.filter((alert) => alert.cases.length).map((alert) => <button key={alert.key} type="button" className={activeAlert === alert.key ? "is-active" : ""} aria-pressed={activeAlert === alert.key} onClick={() => selectAlert(alert.key)}><strong>{alert.cases.length}</strong> {alert.short[alert.cases.length === 1 ? 0 : 1]}</button>)}</div>}</div><span className="control-fixture-note">Datos ilustrativos · 28 jun 2026</span></header>

    <section className="control-workspace" aria-label="Conciliación de entregas">
      <div className="control-toolbar">
        <TextInput id="control-search" label="Buscar caso" placeholder="Pedido, documento, orden o material" value={search} onChange={(value) => changeFilter(setSearch, value)} />
        <SelectInput id="control-farm" label="Finca" value={farm} options={farmOptions} onChange={(value) => changeFilter(setFarm, value)} />
        <SelectInput id="control-notice" label="Aviso de Corte" value={notice} options={noticeOptions} onChange={(value) => changeFilter(setNotice, value)} />
        <SelectInput id="control-material" label="Material" value={material} options={materialOptions} onChange={(value) => changeFilter(setMaterial, value)} />
        {filtersActive && <Button variant="outlined" onClick={() => { setSearch(""); setFarm("all"); setNotice("all"); setMaterial("101279|UN"); setPage(1); setSelectedId(null); setActiveAlert(null); }}>Limpiar filtros</Button>}
      </div>

      {!openAlert && <section className="control-stage-board" aria-labelledby="control-board-title">
        <div className="control-board-heading"><div><span>{focusedMaterial ? `${focusedMaterial.material} · ${focusedMaterial.unit}` : "Panorama por material"}</span><h2 id="control-board-title">Avance y brechas por etapa</h2><p>{focusedMaterial ? `${focusedCases.length} ${focusedCases.length === 1 ? "caso" : "casos"} del material seleccionado` : "Selecciona un material para comparar cantidades de una misma unidad."}</p></div><span className="control-board-source">Pedido → Transporte → Finca</span></div>
        <div className="control-stage-list">
          {deliveryStages.map((entry, index) => <button key={entry.key} type="button" className={`control-stage${stage === entry.key ? " is-selected" : ""}`} aria-pressed={stage === entry.key} onClick={() => setStage(entry.key)}>
            <span className="control-stage-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="control-stage-label">{entry.label}</span>
            <strong>{focusedMaterial ? fmt(totals[entry.key]) : "—"} {focusedMaterial && totals[entry.key] !== null && <small>{focusedMaterial.unit}</small>}</strong>
            <span className="control-stage-source">{entry.source}</span>
          </button>)}
        </div>
        <div className="control-board-footer"><div><strong>{activeStage.source}</strong><span>{activeStage.explanation}</span></div><a href={activeStage.href}>{activeStage.link} <ArrowRightIcon size={16} aria-hidden="true" /></a></div>
        <StageFlowChart totals={totals} unit={focusedMaterial?.unit || ""} activeStage={stage} hasCases={focusedCases.length > 0} reducedMotion={reducedMotion} />
        <GapSummary totals={totals} unit={focusedMaterial?.unit || ""} />
      </section>}

      <section ref={casesRef} className="control-cases" aria-labelledby="control-cases-title"><div className="control-cases-head"><div><h2 id="control-cases-title">{openAlert ? openAlert.label : "Casos y diferencias"}</h2><p>{openAlert ? "Casos en todos los materiales para la alerta seleccionada." : "Abre un pedido para revisar el origen de cada cifra."}</p></div><div className="control-cases-head-actions">{openAlert && <button type="button" onClick={() => { setActiveAlert(null); setSelectedId(null); setPage(1); }}>Ver todos</button>}<Chip preset="info">{tableCases.length} {tableCases.length === 1 ? "caso" : "casos"}</Chip></div></div>
        <Table columns={columns} data={rows} rowKey={(item) => item.id} minWidth="1100px" emptyState="No hay casos para estos filtros. Ajusta la búsqueda o limpia los filtros." actionsHeader="Detalle" actionsWidth="70px" actions={(item) => <TableRowActions label={`Acciones de ${item.id}`}><IconButton variant="ghost" aria-label={`Examinar ${item.id}`} title="Examinar caso" onClick={() => inspect(item)}><ViewIcon /></IconButton></TableRowActions>} />
        <div className="control-case-mobile-list" aria-label="Casos filtrados">
          {rows.length ? rows.map((item) => <article className="control-case-mobile" key={item.id}>
            <div className="control-mobile-case-head"><div><strong>{item.id}</strong><span>{item.farm} · {item.material}</span></div><Chip preset={getCaseReading(item).preset}>{getCaseReading(item).label}</Chip></div>
            <dl>{deliveryStages.map((entry) => <div key={entry.key}><dt>{entry.label}</dt><dd><Quantity value={item[entry.key]} unit={item.unit} /></dd></div>)}</dl>
            <button type="button" onClick={() => inspect(item)}>Examinar caso <ArrowRightIcon size={15} aria-hidden="true" /></button>
          </article>) : <p className="control-mobile-empty">No hay casos para estos filtros. Ajusta la búsqueda o limpia los filtros.</p>}
        </div>
        <Pagination page={currentPage} pageSize={pageSize} total={tableCases.length} pageSizeOptions={[2, 5, 10]} onPageChange={(value) => { setPage(value); setSelectedId(null); }} onPageSizeChange={(value) => { setPageSize(value); setPage(1); setSelectedId(null); }} />
      </section>
      {selected && <CaseDetail item={selected} onClose={closeDetail} detailRef={detailRef} />}
    </section>
  </div>;
}
