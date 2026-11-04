// Adapted from fe-sial-web 4dfeb23d: poma/utils/poma.mapper.ts
import type {
  PomaLoadingListItemDto,
  PomaLoadingRow,
  PomaLoadingType,
  PomaRouteType,
} from "./bridge";

const LOADING_TYPE_LABEL: Record<PomaLoadingType, string> = {
  CONTAINER: "Tractocamión con contenedor",
  TRUCK: "Camión",
};

const ROUTE_TYPE_LABEL: Record<PomaRouteType, string> = {
  FARM_TO_PORT: "Finca → Puerto",
  FARM_TO_FINAL_PORT: "Finca → Puerto Final",
  PORT_TO_FINAL_PORT: "Puerto → Puerto Final",
};

export function getPomaLoadingTypeLabel(loadingType: PomaLoadingType): string {
  return LOADING_TYPE_LABEL[loadingType];
}

export function getPomaRouteTypeLabel(routeType: PomaRouteType): string {
  return ROUTE_TYPE_LABEL[routeType];
}

export function mapPomaLoadingItem(
  item: PomaLoadingListItemDto,
): PomaLoadingRow {
  return {
    id: `${item.loadingType}-${item.loadingId}`,
    loadingId: item.loadingId,
    loadingType: item.loadingType,
    loadingTypeLabel: getPomaLoadingTypeLabel(item.loadingType),
    routeType: item.routeType,
    routeTypeLabel: getPomaRouteTypeLabel(item.routeType),
    radication: item.radication,
    operationWeek: item.operationWeek,
    vehiclePlate: item.vehiclePlate,
    containerCode: item.containerCode,
    originCode: item.originCode,
    originName: item.originName,
    destinationCode: item.destinationCode,
    destinationName: item.destinationName,
    farmCode: item.farmCode,
    farmName: item.farmName,
    startedAt: item.startedAt,
    closedAt: item.closedAt,
    arrivedAtFarmAt: item.arrivedAtFarmAt,
    dispatchedFromFarmAt: item.dispatchedFromFarmAt,
    arrivedAtOriginAt: item.arrivedAtOriginAt,
    dispatchedFromOriginAt: item.dispatchedFromOriginAt,
    palletQuantity: item.palletQuantity,
    boxQuantity: item.boxQuantity,
    pomaAvailable: item.pomaAvailable,
    pomaLastGeneratedAt: item.pomaLastGeneratedAt,
    pomaGenerationCount: item.pomaGenerationCount,
    pomaTemplateVersion: item.pomaTemplateVersion,
  };
}
