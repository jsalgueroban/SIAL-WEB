import {CaseCarousel} from "@banasandev/banasan-ui";
// Adapted from fe-sial-web 4dfeb23d: operational-vehicles/components/operational-vehicle-audit-workbench.tsx
import React from "react";
import {VehicleFacts, VehiclePreviewSwitch, VehicleRouteContext} from "./vehicle-facts-exploration";
"use client";

import {

  Chip,
  FlowTimeline,
  Notice,
} from "@banasandev/banasan-ui";
import {
  type VehicleOperationalAuditEvent,
  type VehicleOperationalTraceNode,
} from "./bridge";
import {
  PomaDispatchDownloadButton,
  type PomaDispatchLookup,
  useHasPomaForDispatch,
} from "./bridge";
import { useEffect, useState } from "react";

interface OperationalVehicleAuditWorkbenchProps {
  events: VehicleOperationalAuditEvent[];
  hasActiveFilters?: boolean;
  renderSelector?: (content: React.ReactNode) => React.ReactNode;
}

function getLatestTraceNode(
  event?: VehicleOperationalAuditEvent,
): VehicleOperationalTraceNode | undefined {
  return event?.trace.reduce((latest, node) => !latest || Date.parse(node.occurredAtValue) > Date.parse(latest.occurredAtValue) ? node : latest, undefined as VehicleOperationalTraceNode | undefined);
}

function getDispatchLookup(
  event: VehicleOperationalAuditEvent,
  node?: VehicleOperationalTraceNode,
): PomaDispatchLookup | undefined {
  if (node?.type !== "exit" || !node.occurredAtValue) return undefined;
  return { radication: event.filingNumber, dispatchedAt: node.occurredAtValue };
}

function JourneyPanel({
  event,
  selectedTraceNodeId,
  onSelectTraceNode,
  maxHeight,
}: {
  event: VehicleOperationalAuditEvent;
  selectedTraceNodeId: string;
  onSelectTraceNode: (key: string) => void;
  maxHeight?: number;
}) {
  const latest = getLatestTraceNode(event);
  const nodes = [...event.trace].sort((a,b) => Date.parse(b.occurredAtValue) - Date.parse(a.occurredAtValue));
  return (
    <section className="vehicle-journey">
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="text-[14px] font-semibold text-(--color-text)">Recorrido de la operación</span>
          <p className="mt-1 text-[12px] text-(--color-text-3)">Del más reciente al primero.</p>
        </div>
        <Chip tone="info">{event.trace.length} hitos</Chip>
      </div>
      <div className="vehicle-journey-list">
        <FlowTimeline
          variant="connected"
          maxHeight={maxHeight}
          aria-label="Hitos del recorrido, del más reciente al primero"
          reverseIndex
          items={nodes.map(node=>({
            key:node.id,
            title:node.title,
            markerLabel:node.id===latest?.id ? "Último movimiento" : undefined,
            description:node.description,
            timestamp:{dateTime:node.occurredAtValue,label:node.occurredAt},
          }))}
          selectedKey={selectedTraceNodeId}
          onSelect={onSelectTraceNode}
        />
      </div>
    </section>
  );
}

function SelectedTracePanel({
  event,
  selectedTraceNode,
}: {
  event: VehicleOperationalAuditEvent;
  selectedTraceNode?: VehicleOperationalTraceNode;
}) {
  const dispatchLookup = getDispatchLookup(event, selectedTraceNode);
  const hasDispatchPoma = useHasPomaForDispatch(dispatchLookup);

  return (
    <aside className="grid content-start gap-5">
      <section key={selectedTraceNode?.id} className="vehicle-detail-section">
        <span className="text-[12px] font-semibold uppercase tracking-[.08em] text-(--color-text-3)">
          Hito seleccionado
        </span>
        <h3 className="mt-2 text-[20px] font-semibold text-(--color-text)">
          {selectedTraceNode?.title ?? "Sin hito seleccionado"}
        </h3>
        <p className="mt-2 text-[13px] text-(--color-text-2)">
          {selectedTraceNode?.occurredAt ?? "Fecha sin registro"} ·{" "}
          {selectedTraceNode?.locationLabel ?? "Ubicación sin registro"}
        </p>

        <div className="mt-4">
          {selectedTraceNode?.issue ? (
            <Notice variant="warning">
              Novedad registrada: {selectedTraceNode.issue}
            </Notice>
          ) : (
            <p className="vehicle-hint">{selectedTraceNode?.description ?? "Selecciona un hito para revisar su información."}</p>
          )}
        </div>

        <div className="mt-4">
          <VehicleFacts
            scope="milestone"
            columns={2}
            items={[
              {
                label: "Etapa",
                value: selectedTraceNode?.stageLabel ?? "Sin registro",
              },
              {
                label: "Contenedor asignado",
                value: selectedTraceNode?.containerLabel ?? event.containerLabel ?? "N/A",
              },
              {
                label: "Carga",
                value: selectedTraceNode?.cargoSummary ?? "N/A",
              },
              {
                label: "Observación",
                value: selectedTraceNode?.observation || "Sin observaciones",
              },
              {
                label: "Responsable",
                value: selectedTraceNode?.responsible ?? "Sin registro",
              },
            ]}
          />
        </div>

        {dispatchLookup && hasDispatchPoma ? (
          <div className="mt-5 flex justify-center">
            <PomaDispatchDownloadButton {...dispatchLookup} />
          </div>
        ) : null}
      </section>

    </aside>
  );
}

export function OperationalVehicleAuditWorkbench({
  events,
  hasActiveFilters = false,
  renderSelector,
}: OperationalVehicleAuditWorkbenchProps) {
  const [selectedEventId, setSelectedEventId] = useState(
    events[0]?.id ?? "",
  );
  const [selectedTraceNodeId, setSelectedTraceNodeId] = useState(
    getLatestTraceNode(events[0])?.id ?? "",
  );

  const filteredEvents = events;

  const selectedEvent =
    filteredEvents.find((event) => event.id === selectedEventId) ??
    filteredEvents[0];
  const selectedTraceNode =
    selectedEvent?.trace.find((node) => node.id === selectedTraceNodeId) ??
    getLatestTraceNode(selectedEvent);
  useEffect(() => {
    if (!selectedEvent || selectedEvent.id === selectedEventId) return;

    setSelectedEventId(selectedEvent.id);
    setSelectedTraceNodeId(getLatestTraceNode(selectedEvent)?.id ?? "");
  }, [selectedEvent, selectedEventId]);

  const selectEvent = (eventId: string) => {
    const event = filteredEvents.find((item) => item.id === eventId);
    setSelectedEventId(eventId);
    setSelectedTraceNodeId(getLatestTraceNode(event)?.id ?? "");
  };

  const selectTraceNode = (traceNodeId: string) => {
    setSelectedTraceNodeId(traceNodeId);
  };

  const wrapSelector = renderSelector ?? ((content: React.ReactNode) => content);

  if (events.length === 0) {
    return wrapSelector(
      <div className="border-t border-(--color-border-subtle) p-5">
        <Notice variant="info">
          {hasActiveFilters ? "No hay vehículos que coincidan con los filtros seleccionados." : "No hay operaciones de vehículos disponibles para revisar."}
        </Notice>
      </div>
    );
  }

  if (!selectedEvent || filteredEvents.length === 0) {
    return wrapSelector(
      <div className="border-t border-(--color-border-subtle) p-5">
        <Notice variant="info">
          No hay vehículos que coincidan con los filtros seleccionados.
        </Notice>
      </div>
    );
  }

  return (
    <div className={renderSelector ? "vehicle-separated-blocks" : "vehicle-review-content grid gap-5 border-t border-(--color-border-subtle) p-5"}>
      {wrapSelector(<div className="vehicle-selector-content">
      <VehiclePreviewSwitch/>
      <CaseCarousel variant="interactive" autoAdvance
        selectedKey={selectedEvent.id}
        onSelect={(key) => selectEvent(key)}
        items={filteredEvents.map((event) => ({
          key: event.id,
          eyebrow: `Rad. ${event.filingNumber} · ${event.operationCode}`,
          title: event.vehiclePlate,
          subtitle: event.vehicleType,
          meta: event.currentLocation,

        }))}
      />

      </div>)}
      <div className={renderSelector ? "card vehicle-selected-block vehicle-review-content" : "vehicle-selected-contents"}>
      <section className="vehicle-context">
        <div className="vehicle-context-heading">
          <div><h3>Rad. {selectedEvent.filingNumber} · {selectedEvent.operationCode}</h3><p className="vehicle-hint">{selectedEvent.weekLabel} · Último movimiento: {getLatestTraceNode(selectedEvent)?.occurredAt ?? "Sin movimientos"}</p></div>
          <div className="vehicle-context-actions"><Chip tone={selectedEvent.statusTone}>{selectedEvent.currentStage}</Chip></div>
        </div>
        <VehicleFacts scope="context" columns={4} items={[
          {label:"Placa",value:selectedEvent.vehiclePlate},
          {label:"Tipo de vehículo",value:selectedEvent.vehicleType},
          {label:"Contenedor",value:selectedEvent.containerLabel},
          {label:"Capacidad pallets",value:selectedEvent.palletCapacity},
          {label:"Conductor",value:selectedEvent.driver},
          {label:"Documento del conductor",value:selectedEvent.driverDocument},
          {label:"Transportadora",value:selectedEvent.transportCompany},
          {label:"Carrier",value:selectedEvent.carrier},
          {label:"Sincronización",value:selectedEvent.syncStatus},
          {label:"Ubicación actual",value:selectedEvent.currentLocation},
          {label:"Destino",value:selectedEvent.destination},
          {label:"Registro de la operación",value:selectedEvent.registeredAt},
          {label:"Responsable de la operación",value:selectedEvent.responsible},
        ]}/>
      </section>
      <div className="vehicle-workspace">
        <VehicleRouteContext event={selectedEvent}/>
        <JourneyPanel
          event={selectedEvent}
          selectedTraceNodeId={selectedTraceNode?.id ?? ""}
          onSelectTraceNode={selectTraceNode}
        />
        <SelectedTracePanel
          event={selectedEvent}
          selectedTraceNode={selectedTraceNode}
        />
      </div>

      </div>


    </div>
  );
}

