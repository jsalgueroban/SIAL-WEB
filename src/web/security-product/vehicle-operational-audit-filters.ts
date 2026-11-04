// Adapted from fe-sial-web 4dfeb23d: operational-vehicles/utils/vehicle-operational-audit-filters.ts
import type { VehicleOperationalAuditEvent } from "./bridge";

export const VEHICLE_OPERATIONAL_ALL_FILTER = "all";

export interface VehicleOperationalFilterValues {
  search: string;
  year: string;
  weekNumber: string;
  vehicleStageId: string;
  locationId: string;
}

export function uniqueVehicleOperationalOptions(
  values: string[],
  fallbackLabel: string,
) {
  const unique = Array.from(new Set(values.filter(Boolean)));
  return [
    { label: fallbackLabel, value: VEHICLE_OPERATIONAL_ALL_FILTER },
    ...unique.map((value) => ({ label: value, value })),
  ];
}

export function getVehicleOperationalFilters(
  params?: URLSearchParams | null,
): VehicleOperationalFilterValues {
  return {
    search: params?.get("search") ?? "",
    year: params?.get("year") ?? VEHICLE_OPERATIONAL_ALL_FILTER,
    weekNumber: params?.get("weekNumber") ?? VEHICLE_OPERATIONAL_ALL_FILTER,
    vehicleStageId: params?.get("vehicleStageId") ?? VEHICLE_OPERATIONAL_ALL_FILTER,
    locationId: params?.get("locationId") ?? VEHICLE_OPERATIONAL_ALL_FILTER,
  };
}

function matchesSearch(
  event: VehicleOperationalAuditEvent,
  search: string,
): boolean {
  const normalized = search.trim().toLowerCase();
  if (!normalized) return true;

  return [
    event.filingNumber,
    `Rad. ${event.filingNumber}`,
    event.carrier,
    event.operationCode,
    event.vehiclePlate,
    event.vehicleType,
    event.transportCompany,
    event.driver,
    event.driverDocument,
    event.destination,
    event.currentLocation,
    event.currentStage,
    event.responsible,
    ...event.trace.flatMap((node) => [
      node.title,
      node.description,
      node.issue,
      node.observation,
    ]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes(normalized);
}

export function filterVehicleOperationalEvents(
  events: VehicleOperationalAuditEvent[],
  filters: VehicleOperationalFilterValues,
): VehicleOperationalAuditEvent[] {
  return events.filter(
    (event) =>
      matchesSearch(event, filters.search) &&
      (filters.year === VEHICLE_OPERATIONAL_ALL_FILTER ||
        event.year === filters.year) &&
      (filters.weekNumber === VEHICLE_OPERATIONAL_ALL_FILTER ||
        event.weekNumber === filters.weekNumber) &&
      (filters.vehicleStageId === VEHICLE_OPERATIONAL_ALL_FILTER ||
        event.currentStageId === filters.vehicleStageId) &&
      (filters.locationId === VEHICLE_OPERATIONAL_ALL_FILTER ||
        event.currentLocationId === filters.locationId),
  );
}
