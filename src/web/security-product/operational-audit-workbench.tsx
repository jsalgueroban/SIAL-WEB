import {CaseCarousel} from "@banasandev/banasan-ui";
// Adapted from fe-sial-web 4dfeb23d: operational/components/operational-audit-workbench.tsx
import React from "react";
"use client";

import {

  Button,
  Chip,
  CommentList,
  DocumentFileIcon,
  EvidenceViewer,
  FlowTimeline,
  Notice,
} from "@banasandev/banasan-ui";
import type {
  OperationalAuditEvent,
  OperationalAuditEvidence,
  OperationalAuditSecurityLabel,
  OperationalAuditTraceNode,
} from "./bridge";
import { downloadContainerInspectionReport } from "./bridge";
import { useToast } from "./bridge";
import { useEffect, useState } from "react";

interface OperationalAuditWorkbenchProps {
  events: OperationalAuditEvent[];
  renderSelector?: (content: React.ReactNode) => React.ReactNode;
  hasActiveFilters?: boolean;
}

function getInitialEvent(events: OperationalAuditEvent[]) {
  return events[0]?.id ?? "";
}

function countEvidenceLabel(count: number) {
  return `${count} ${count === 1 ? "foto" : "fotos"}`;
}

function countSecurityLabelsLabel(count: number) {
  return `${count} ${count === 1 ? "etiqueta" : "etiquetas"}`;
}

function isPortInspectionTraceNode(node: OperationalAuditTraceNode): boolean {
  const locationCode = node.zone.code?.trim().toUpperCase();
  return (
    locationCode === "PORT" &&
    Boolean(node.inspectionId) &&
    Boolean(node.inspectionKind)
  );
}

function getInspectionTimestamp(node: OperationalAuditTraceNode): number {
  const timestamp = node.inspectionCreatedAt
    ? Date.parse(node.inspectionCreatedAt)
    : Number.NaN;
  return Number.isFinite(timestamp) ? timestamp : Number.NEGATIVE_INFINITY;
}

function isLaterInspection(
  candidate: OperationalAuditTraceNode,
  current: OperationalAuditTraceNode,
): boolean {
  const candidateTimestamp = getInspectionTimestamp(candidate);
  const currentTimestamp = getInspectionTimestamp(current);

  if (candidateTimestamp !== currentTimestamp) {
    return candidateTimestamp > currentTimestamp;
  }

  return (candidate.inspectionId ?? 0) > (current.inspectionId ?? 0);
}

function SecurityLabelsSection({
  labels,
  emptyState = "Sin etiquetas registradas.",
}: {
  labels: OperationalAuditSecurityLabel[];
  emptyState?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const contentId = React.useId();
  return (
    <section className="container-security-labels">
      <div className="container-registration-heading">
        <div><h4>Etiquetas de seguridad</h4><p>{countSecurityLabelsLabel(labels.length)} registradas</p></div>
        {labels.length > 0 && <Button variant="outlined" aria-expanded={expanded} aria-controls={contentId} onClick={() => setExpanded(!expanded)}>{expanded ? "Ocultar etiquetas" : "Ver etiquetas"}</Button>}
      </div>
      {labels.length > 0 ? (
        <div id={contentId} hidden={!expanded} className="container-registration-body">
        <dl className="container-facts container-label-facts">
          {labels.map((label) => (
            <div
              key={label.id}
            >
              <dt>{label.code}</dt>
              <dd><Chip tone={label.statusTone}>{label.status}</Chip></dd>
            </div>
          ))}
        </dl>
        </div>
      ) : (
        <p className="container-muted">{emptyState}</p>
      )}
    </section>
  );
}

function ContainerFacts({items}: {items: Array<{label:string;value:React.ReactNode}>}) {
  return <dl className="container-facts">{items.map((item,index)=><div key={`${item.label}-${index}`}><dt>{item.label}</dt><dd>{item.value || "Sin registro"}</dd></div>)}</dl>;
}

function ContainerSummary({event}: {event:OperationalAuditEvent}) {
  const [registrationOpen,setRegistrationOpen]=useState(false);
  const registrationId=React.useId();
  return <section className="container-summary">
    <header className="container-context-heading"><div><h3>{event.containerLabel}</h3><p>Rad. {event.filingNumber ?? "—"} {event.operationCode !== `OP-${event.filingNumber}` ? ` · ${event.operationCode}` : ""} · {event.weekLabel}</p></div>
      <div className="container-context-actions"><Chip tone={event.statusTone}>{event.status}</Chip></div>
    </header>
    <div className="container-overview"><ContainerFacts items={[
      {label:"Tipo de contenedor",value:event.containerType},
      {label:"Capacidad",value:event.containerCapacity || "Sin registro"},
      {label:"Contexto",value:event.contextContainer === "SIN_STATUS" ? "Sin estado definido" : event.contextContainer},
      {label:"Ubicación actual",value:event.locationLabel},
    ]}/></div>
    <section className="container-registration">
      <div className="container-registration-heading"><div><h4>Registro de la operación</h4><p>{event.sourceLabel}{event.syncStatus ? ` · ${event.syncStatus}` : ""}</p></div>
        <Button variant="outlined" aria-expanded={registrationOpen} aria-controls={registrationId} onClick={()=>setRegistrationOpen(!registrationOpen)}>{registrationOpen ? "Ocultar registro" : "Ver registro"}</Button>
      </div>
      <div id={registrationId} hidden={!registrationOpen} className="container-registration-body"><ContainerFacts items={[
        ...(event.travelOrder !== event.operationCode ? [{label:"Orden de viaje",value:event.travelOrder}] : []),{label:"ID programación",value:event.technicalOperationCode},{label:"Fuente",value:event.sourceLabel},{label:"Responsable",value:event.responsible},
        {label:"Último registro",value:event.registeredAt ? new Date(event.registeredAt).toLocaleString("es-CO") : "Sin dato confirmado"},...(event.syncStatus ? [{label:"Sincronización",value:event.syncStatus}] : []),
      ]}/></div>
    </section>
  </section>;
}

function InspectionReview({node}: {node:OperationalAuditTraceNode}) {
  const [expanded,setExpanded]=useState(false);
  const id=React.useId();
  const points=node.inspectionDetails.filter(item=>!["Tipo de inspección","Resultado","Observaciones"].includes(item.label) && !node.sealDetails.some(seal=>seal.value===item.value));
  if(!points.length) return null;
  return <section className="container-inspection-review">
    <div className="container-registration-heading"><div><h4>Verificación de la inspección</h4><p>{points.length} puntos registrados</p></div><Button variant="outlined" aria-expanded={expanded} aria-controls={id} onClick={()=>setExpanded(!expanded)}>{expanded ? "Ocultar puntos" : "Ver puntos"}</Button></div>
    <div id={id} hidden={!expanded} className="container-registration-body"><ContainerFacts items={points.map(point=>({...point,value:point.value === "VERIFIED" ? "Verificado" : point.value}))}/></div>
  </section>;
}

function OperationPanel({event,onSelectTraceNode,selectedTraceNodeId}: {
  event:OperationalAuditEvent;onSelectTraceNode:(key:string)=>void;selectedTraceNodeId:string;
}) {
  const nodes=[...event.trace].sort((a,b)=>Date.parse(b.occurredAtValue)-Date.parse(a.occurredAtValue));
  return <section className="container-journey"><div className="container-section-heading"><div><h4>Recorrido del contenedor</h4><p>Del más reciente al primero.</p></div><Chip tone="info">{nodes.length} {nodes.length===1 ? "evento" : "eventos"}</Chip></div>
    <FlowTimeline variant="connected" aria-label="Recorrido del contenedor" reverseIndex selectedKey={selectedTraceNodeId} onSelect={onSelectTraceNode} items={nodes.map((node,index)=>({
      key:node.id,title:node.name,description:node.event === node.name ? undefined : node.event,meta:node.zoneLabel,
      timestamp:node.occurredAtValue ? {dateTime:node.occurredAtValue,label:node.occurredAt} : undefined,markerLabel:index===0 ? "Último movimiento" : undefined,statusLabel:node.status === node.name ? undefined : node.status,statusTone:node.statusTone,
    }))}/>
  </section>;
}
function EvidencePanel({
  evidences,
  event,
  selectedEvidence,
  selectedTraceNode,
  isGeneratingReport,
  onGenerateReport,
  onSelectEvidence,
}: {
  evidences: OperationalAuditEvidence[];
  event: OperationalAuditEvent;
  selectedEvidence?: OperationalAuditEvidence;
  selectedTraceNode?: OperationalAuditTraceNode;
  isGeneratingReport: boolean;
  onGenerateReport: () => void;
  onSelectEvidence: (evidenceId: string) => void;
}) {
  
  const movementComments = event.comments.filter(comment => comment.traceNodeId === selectedTraceNode?.id);
  const portInspectionNodes = event.trace.filter(isPortInspectionTraceNode);
  const inspectionKinds = new Set(portInspectionNodes.map((node) => node.inspectionKind));
  const hasBothPortInspections =
    inspectionKinds.has("INTERNAL") && inspectionKinds.has("EXTERNAL");
  const latestPortInspectionNode = portInspectionNodes.reduce<
    OperationalAuditTraceNode | undefined
  >(
    (latest, node) =>
      !latest || isLaterInspection(node, latest) ? node : latest,
    undefined,
  );
  const showReportAction =
    hasBothPortInspections &&
    Boolean(selectedTraceNode?.inspectionId) &&
    selectedTraceNode?.id === latestPortInspectionNode?.id;

  return (
    <aside key={selectedTraceNode?.id} className="container-evidence-panel container-evidence-content">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <span className="text-[12px] font-semibold uppercase tracking-[.08em] text-(--color-text-3)">Movimiento seleccionado</span>
          <h3 className="mt-2 text-[20px] font-semibold text-(--color-text)">
            {selectedTraceNode?.name ?? event.operationName}
          </h3>
        </div>
      </div>
      <p className="container-movement-meta">{selectedTraceNode?.occurredAt} · {selectedTraceNode?.zoneLabel ?? event.locationLabel}</p>
      <p className="container-movement-responsible"><span>Responsable</span> {selectedTraceNode?.responsible ?? "Sin responsable"}</p>
      <section className="container-detail-section">
        <h4>Asignación en este movimiento</h4>
        {[selectedTraceNode?.vehicle, selectedTraceNode?.driver, selectedTraceNode?.transportCompany, selectedTraceNode?.carrier].every(value=>!value || value === "Sin asignación") ? <p className="container-muted">Sin asignación de vehículo, conductor, transportadora ni carrier en este movimiento.</p> : <ContainerFacts
          items={[
            { label: "Vehículo", value: selectedTraceNode?.vehicle ?? "Sin asignación" },
            { label: "Conductor", value: selectedTraceNode?.driver ?? "Sin asignación" },
            {
              label: "Transportadora",
              value: selectedTraceNode?.transportCompany ?? "Sin asignación",
            },
            { label: "Carrier", value: selectedTraceNode?.carrier ?? "Sin asignación" },
          ]}
        />}
      </section>
      {selectedTraceNode && <InspectionReview key={selectedTraceNode.id} node={selectedTraceNode}/>}
      <section className="container-detail-section">
        <div className="container-section-heading"><div className="container-evidence-title"><h4>Evidencias</h4><Chip tone="info">{countEvidenceLabel(evidences.length)}</Chip></div>
        </div>
        <EvidenceViewer
          selectedKey={selectedEvidence?.id}
          emptyState="El movimiento seleccionado no tiene evidencias vigentes asociadas."
          items={evidences.map((evidence) => ({
            key: evidence.id,
            title: selectedTraceNode && evidence.title.startsWith(`${selectedTraceNode.name} - `) ? evidence.title.slice(selectedTraceNode.name.length + 3) : evidence.title,
            imageSrc: evidence.imageSrc,
            imageAlt: evidence.title,
            type: evidence.type,
            capturedAt: evidence.capturedAt,
            statusLabel: evidence.status,
            statusTone: evidence.statusTone,
            observationTitle: movementComments.some(comment=>comment.text.trim()===evidence.observation.trim()) ? undefined : "Comentario",
            observation: movementComments.some(comment=>comment.text.trim()===evidence.observation.trim()) ? undefined : evidence.observation,
          }))}
          onSelect={(key) => onSelectEvidence(key)}
        />
      </section>
      {(selectedTraceNode?.sealDetails?.length || selectedTraceNode?.securityLabels?.length) ? <section className="container-detail-section container-security-section">
        <h4>Sellos y etiquetas</h4>
        {selectedTraceNode?.sealDetails?.length ? <ContainerFacts items={selectedTraceNode.sealDetails}/> : <p className="container-muted">Sin sellos registrados.</p>}
        {Boolean(selectedTraceNode?.securityLabels?.length) && <SecurityLabelsSection labels={selectedTraceNode?.securityLabels ?? []}/>}
      </section> : <p className="container-muted container-detail-section">Sin sellos ni etiquetas registrados en este movimiento.</p>}
      {movementComments.length > 0 && <section className="container-detail-section container-movement-comments">
        <h4>Comentarios del movimiento</h4>
        <CommentList items={movementComments.map(comment=>({key:comment.id,author:comment.author,date:comment.date,children:comment.text}))}/>
      </section>}
      {showReportAction ? (
        <div className="mt-5 flex justify-center border-t border-(--color-border-subtle) pt-4">
          <Button
            variant="filled"
            className="w-full sm:w-auto"
            disabled={isGeneratingReport}
            onClick={onGenerateReport}
          >
            <DocumentFileIcon size={17} />
            {isGeneratingReport ? "Generando..." : "Informe de inspecciones"}
          </Button>
        </div>
      ) : null}
    </aside>
  );
}
export function OperationalAuditWorkbench({ events, renderSelector, hasActiveFilters=false }: OperationalAuditWorkbenchProps) {
  const wrapSelector=renderSelector ?? ((content:React.ReactNode)=>content);
  const { showToast } = useToast();
  const [selectedEventId, setSelectedEventId] = useState(getInitialEvent(events));
  const [selectedTraceNodeId, setSelectedTraceNodeId] = useState(events[0]?.trace[0]?.id ?? "");
  const [selectedEvidenceId, setSelectedEvidenceId] = useState("");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const filteredEvents = events;

  const selectedEvent = filteredEvents.find((event) => event.id === selectedEventId) ?? filteredEvents[0];
  const selectedTraceNode =
    selectedEvent?.trace.find((node) => node.id === selectedTraceNodeId) ?? selectedEvent?.trace[0];
  const selectedTraceEvidenceIds = new Set(selectedTraceNode?.evidenceIds ?? []);
  const allSelectedTraceEvidences =
    selectedEvent?.evidences.filter((evidence) => selectedTraceEvidenceIds.has(evidence.id)) ?? [];
  const selectedTraceEvidences = allSelectedTraceEvidences.filter((evidence) => !evidence.historical);
  const selectedEvidence =
    selectedTraceEvidences.find((evidence) => evidence.id === selectedEvidenceId) ?? selectedTraceEvidences[0];

  useEffect(() => {
    if (!selectedEvent) return;
    if (selectedEvent.id !== selectedEventId) {
      setSelectedEventId(selectedEvent.id);
      setSelectedTraceNodeId(selectedEvent.trace[0]?.id ?? "");
      setSelectedEvidenceId("");
    }
  }, [selectedEvent, selectedEventId]);

  const selectEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    setSelectedTraceNodeId(filteredEvents.find((event) => event.id === eventId)?.trace[0]?.id ?? "");
    setSelectedEvidenceId("");
  };

  const selectTraceNode = (traceNodeId: string) => {
    setSelectedTraceNodeId(traceNodeId);
    setSelectedEvidenceId("");
  };

  const generateInspectionReport = async () => {
    if (!selectedTraceNode?.inspectionId || isGeneratingReport) return;

    setIsGeneratingReport(true);
    try {
      await downloadContainerInspectionReport(selectedTraceNode.inspectionId);
      showToast({
        message: "El informe de inspección se generó y descargó correctamente.",
        variant: "success",
      });
    } catch (error) {
      showToast({
        message:
          error instanceof Error
            ? error.message
            : "No fue posible generar el informe de inspección.",
        variant: "error",
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  if (events.length === 0) {
    return wrapSelector(
      <div className="border-t border-(--color-border-subtle) p-5">
        <Notice variant="info">{hasActiveFilters ? "No hay contenedores que coincidan con los filtros." : "No hay eventos operativos disponibles para revisar."}</Notice>
      </div>
    );
  }

  if (filteredEvents.length === 0 || !selectedEvent) {
    return wrapSelector(
      <div className="border-t border-(--color-border-subtle) p-5">
        <Notice variant="info">No hay eventos que coincidan con los filtros.</Notice>
      </div>
    );
  }

  return (
    <div className="container-separated-blocks">
      {wrapSelector(<div className="container-selector"><CaseCarousel variant="interactive" autoAdvance selectedKey={selectedEvent.id} onSelect={selectEvent} items={filteredEvents.map(event=>({
        key:event.id,eyebrow:`OP-${event.technicalOperationCode.replace(/^OP-/, "")}`,title:event.containerLabel,subtitle:event.locationLabel,meta:`Rad. ${event.filingNumber ?? "—"} · ${event.weekLabel} · ${event.trace.length} ${event.trace.length===1 ? "evento" : "eventos"}`,statusTone:event.statusTone,
      }))}/></div>)}
      <div className="card container-selected-block">
        <ContainerSummary event={selectedEvent}/>
        <div className="container-workspace">
        <OperationPanel event={selectedEvent} selectedTraceNodeId={selectedTraceNode?.id ?? ""} onSelectTraceNode={selectTraceNode}/>
        <EvidencePanel
          event={selectedEvent}
          evidences={selectedTraceEvidences}
          selectedTraceNode={selectedTraceNode}
          selectedEvidence={selectedEvidence}
          isGeneratingReport={isGeneratingReport}
          onGenerateReport={generateInspectionReport}
          onSelectEvidence={setSelectedEvidenceId}
        />
      </div>
      {selectedEvent.comments.some(comment=>!comment.traceNodeId) && <section id="container-operation-comments" className="container-operation-comments" tabIndex={-1}>
        <h4>Comentarios generales de la operación</h4>
        <CommentList emptyState="Sin comentarios registrados." items={selectedEvent.comments.filter(comment=>!comment.traceNodeId).map(comment=>({key:comment.id,author:comment.author,date:comment.date,children:comment.text}))}/>
      </section>}
      </div>


    </div>
  );
}

