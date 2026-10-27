// Escenarios ilustrativos de HU1920. No son datos operativos ni se combinan con el estado local de otras vistas.
export const deliveryControlCases = [
  {
    id: "PED-2026-11021", document: "RPT-2026-0921", order: "OTI-2026-041", delivery: "ENT-2026-041", pod: "POD-2026-041",
    farm: "Finca Santa Isabel", notice: "AC-2026-032", noticeVersion: "v2", materialCode: "101279",
    material: "Caja de cartón corrugado", unit: "UN", approved: 1480, programmed: 1480, dispatched: 1280, delivered: 1180,
    vehicleAssignments: [{ trip: "VIA-2026-041-A", vehicle: "VHC-041", quantity: 900 }, { trip: "VIA-2026-041-B", vehicle: "VHC-052", quantity: 580 }],
    updated: "28 jun 2026 · 16:20"
  },
  {
    id: "PED-2026-11022", document: "REM-2026-0214", order: "OTI-2026-042", delivery: "ENT-2026-042", pod: "POD-2026-042",
    farm: "Finca El Retiro", notice: "AC-2026-034", noticeVersion: "v1", materialCode: "101279",
    material: "Caja de cartón corrugado", unit: "UN", approved: 520, programmed: 520, dispatched: 520, delivered: 520,
    vehicleAssignments: [{ trip: "VIA-2026-042-A", vehicle: "VHC-018", quantity: 520 }],
    updated: "28 jun 2026 · 17:05"
  },
  {
    id: "PED-2026-11021-Z", document: "RPT-2026-0921", order: "OTI-2026-041", delivery: "ENT-2026-041", pod: null,
    farm: "Finca Santa Isabel", notice: "AC-2026-032", noticeVersion: "v2", materialCode: "4925",
    material: "Zuncho amarillo", unit: "M", approved: 400, programmed: 450, dispatched: 380, delivered: null,
    vehicleAssignments: [{ trip: "VIA-2026-041-A", vehicle: "VHC-041", quantity: 300 }, { trip: "VIA-2026-041-B", vehicle: "VHC-052", quantity: 150 }],
    updated: "28 jun 2026 · 16:20"
  },
  {
    id: "PRC-2026-006", document: "RES-2026-0067", order: "OTI-2026-043", delivery: null, pod: null,
    farm: "Finca Las Palmas", notice: null, noticeVersion: null, materialCode: "EPP-024",
    material: "Guantes de seguridad", unit: "PAR", approved: 24, programmed: 24, dispatched: null, delivered: null,
    vehicleAssignments: [{ trip: "VIA-2026-043-A", vehicle: "VHC-033", quantity: 24 }],
    updated: "28 jun 2026 · 15:40"
  },
  {
    id: "PED-2026-11023", document: "REM-2026-0215", order: "OTI-2026-044", delivery: "ENT-2026-044", pod: "POD-2026-044",
    farm: "Finca El Retiro", notice: "AC-2026-034", noticeVersion: "v1", materialCode: "5418",
    material: "Separador de pallet", unit: "PAQ", approved: 35, programmed: 35, dispatched: 35, delivered: 22,
    vehicleAssignments: [{ trip: "VIA-2026-044-A", vehicle: "VHC-018", quantity: 35 }],
    updated: "28 jun 2026 · 17:12"
  }
];

export const deliveryStages = [
  { key: "approved", label: "Consolidado aprobado", source: "Materiales", explanation: "Cantidad autorizada en el pedido y documento de origen vigentes.", href: "aprobacion-pedidos-materiales.html", link: "Abrir aprobación" },
  { key: "programmed", label: "Programado", source: "Transporte", explanation: "Cantidad asignada a viajes de transporte vigentes.", href: "ordenes-transporte-insumos.html", link: "Abrir órdenes" },
  { key: "dispatched", label: "Despacho confirmado", source: "Transporte", explanation: "Cantidad con evento efectivo de salida; una notificación no cuenta como despacho.", href: "../Gestion%20de%20Transporte/gestion-operaciones.html", link: "Abrir operaciones" },
  { key: "delivered", label: "Entregado con POD", source: "Finca y soporte", explanation: "Cantidad recibida con evidencia POD válida vinculada a la entrega.", href: "seguimiento-entregas.html", link: "Abrir entregas" }
];

export function sumStage(cases, key) {
  if (!cases.length || cases.some((item) => !Number.isFinite(item[key]))) return null;
  return cases.reduce((total, item) => total + item[key], 0);
}

export function aggregateStages(cases) {
  return Object.fromEntries(deliveryStages.map((stage) => [stage.key, sumStage(cases, stage.key)]));
}

export function getCaseReading(item) {
  if (item.programmed > item.approved) return { label: "Sobreprogramado", preset: "warning" };
  if (item.dispatched === null) return { label: "Sin despacho confirmado", preset: "info" };
  if (item.dispatched > item.programmed) return { label: "Sobre-despacho", preset: "warning" };
  if (item.delivered === null) return { label: "POD sin validar", preset: "info" };
  if (item.delivered > item.dispatched) return { label: "Entrega por revisar", preset: "warning" };
  if (item.delivered < item.dispatched) return { label: "Entrega por conciliar", preset: "warning" };
  if (item.programmed < item.approved) return { label: "Por programar", preset: "info" };
  return { label: "Conciliado", preset: "active" };
}
