// Adapted from fe-sial-web 4dfeb23d: operational/utils/operational-audit-filters.ts
import type { OperationalAuditEvent } from "./bridge";

export const OPERATIONAL_AUDIT_ALL_FILTER = "all";

export const OPERATIONAL_AUDIT_STAGE_OPTIONS = [
  { label: "Todas las etapas", value: OPERATIONAL_AUDIT_ALL_FILTER },
  { label: "Disponible", value: "AVAILABLE" },
  { label: "En inspección", value: "WAITING_SECURITY_INSPECTION" },
  { label: "Inspección Externa Aprobada", value: "EXTERNAL_INSPECTION_APPROVED" },
  { label: "Inspección Interna Aprobada", value: "INTERNAL_INSPECTION_APPROVED" },
  { label: "Asignado a Vehículo", value: "ASSIGNED_TO_VEHICLE" },
  { label: "Despachado a Finca", value: "DISPATCHED_TO_FARM" },
  { label: "Recibido en Finca", value: "RECEIVED_AT_FARM" },
  { label: "En Cargue", value: "LOADING" },
  { label: "Cargado en Finca", value: "LOADED_AT_FARM" },
  { label: "Despachado desde Finca", value: "DISPATCHED_FROM_FARM" },
  { label: "Recibido en Puerto", value: "RECEIVED_AT_PORT" },
  { label: "En Cross Docking", value: "IN_CROSS_DOCKING" },
  { label: "Exportado", value: "EXPORTED" },
  { label: "Cerrado Operativamente", value: "OPERATIONALLY_CLOSED" },
  { label: "Rechazado por Inspección Externa", value: "REJECTED_BY_EXTERNAL_INSPECTION" },
  { label: "Rechazado por Inspección Interna", value: "REJECTED_BY_INTERNAL_INSPECTION" },
];

export interface OperationalAuditFilterValues {
  search: string;
  year: string;
  weekNumber: string;
  containerStage: string;
  status: string;
  fromDate: string;
  toDate: string;
}

export function uniqueOperationalAuditOptions(values: string[], fallbackLabel: string) {
  const unique = Array.from(new Set(values.filter(Boolean)));
  return [
    { label: fallbackLabel, value: OPERATIONAL_AUDIT_ALL_FILTER },
    ...unique.map((value) => ({ label: value, value })),
  ];
}

export function getOperationalAuditFilters(params?: URLSearchParams | null): OperationalAuditFilterValues {
  return {
    search: params?.get("search") ?? "",
    year: params?.get("year") ?? OPERATIONAL_AUDIT_ALL_FILTER,
    weekNumber: params?.get("weekNumber") ?? OPERATIONAL_AUDIT_ALL_FILTER,
    containerStage: params?.get("containerStage") ?? OPERATIONAL_AUDIT_ALL_FILTER,
    status: params?.get("status") ?? OPERATIONAL_AUDIT_ALL_FILTER,
    fromDate: params?.get("fromDate") ?? "",
    toDate: params?.get("toDate") ?? "",
  };
}

function includesText(value: string, search: string) {
  return value.toLowerCase().includes(search.toLowerCase());
}

function eventMatchesSearch(event: OperationalAuditEvent, search: string) {
  if (!search.trim()) return true;
  const searchable = [
    event.operationCode,
    event.travelOrder,
    event.container,
    event.vehicle,
    event.responsible,
    event.status,
    event.syncStatus,
    event.operationName,
    event.locationLabel,
    event.location.code,
    event.location.farm?.code,
    event.location.farm?.name,
    ...event.trace.map((node) => node.zoneLabel),
    ...event.comments.map((comment) => comment.text),
    ...event.evidences.map((evidence) => evidence.title),
    ...(event.securityLabels ?? []).flatMap((label) => [
      label.code,
      label.typeLabel,
      label.status,
    ]),
  ].join(" ");

  return includesText(searchable, search.trim());
}

function eventMatchesDateRange(event: OperationalAuditEvent, from: string, to: string) {
  const eventDate = new Date(event.registeredAt).getTime();
  if (Number.isNaN(eventDate)) return true;
  if (from && eventDate < new Date(`${from}T00:00:00`).getTime()) return false;
  if (to && eventDate > new Date(`${to}T23:59:59`).getTime()) return false;
  return true;
}

export function filterOperationalAuditEvents(
  events: OperationalAuditEvent[],
  filters: OperationalAuditFilterValues,
) {
  const { containerStage, fromDate, search, status, toDate, weekNumber, year } = filters;

  return events.filter(
    (event) =>
      eventMatchesSearch(event, search) &&
      (year === OPERATIONAL_AUDIT_ALL_FILTER || event.year === year) &&
      (weekNumber === OPERATIONAL_AUDIT_ALL_FILTER || event.weekNumber === weekNumber) &&
      (containerStage === OPERATIONAL_AUDIT_ALL_FILTER || event.eventType === containerStage) &&
      (status === OPERATIONAL_AUDIT_ALL_FILTER || event.status === status || event.syncStatus === status) &&
      eventMatchesDateRange(event, fromDate, toDate),
  );
}
