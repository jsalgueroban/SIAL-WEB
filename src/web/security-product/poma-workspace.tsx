// Adapted from fe-sial-web 4dfeb23d: poma/components/poma-workspace.tsx
import React from "react";
"use client";

import {
 Pagination,
 Card,
 CaseCarousel,
 Chip,
 Notice,
 Table,
 ViewMotion,
 type KeyValueGridItem,
 type TableColumn,
} from "@banasandev/banasan-ui";
import {
 displayPomaValue,
 formatPomaDate,
 formatPomaDocumentReference,
 formatPomaIdentifier,
 formatPomaNumber,
 formatPomaWeight,
 getPomaLoadingDetailAction,
 mapPomaLoadingItem,
 type PomaLoadingDetailDto,
 type PomaLoadingRow,
 type PomaLoadingsResponse,
 type PomaPalletDto,
} from "./bridge";
import { PermissionGate } from "./bridge";
import { useQueryParams } from "./bridge";
import {
 useEffect,
 useState,
 type Dispatch,
 type ReactNode,
 type SetStateAction,
} from "react";
import { readPomaDocument } from "./poma-document-store";
import { PomaDownloadButton } from "./poma-download-button";

const LOADINGS_ERROR =
 "No fue posible realizar la consulta. Inténtalo nuevamente.";
const DETAIL_ERROR =
 "No fue posible consultar la información del documento POMA.";

interface PomaWorkspaceState {
 detail?: PomaLoadingDetailDto;
 error?: string;
 loading: boolean;
 row?: PomaLoadingRow;
 rows: PomaLoadingRow[];
}

const EMPTY_STATE: PomaWorkspaceState = { loading: false, rows: [] };

function responseErrorMessage(response: PomaLoadingsResponse): string {
 return response.message?.trim() || LOADINGS_ERROR;
}

function requestErrorMessage(error: unknown): string {
 return error instanceof Error && error.message.trim()
  ? error.message
  : LOADINGS_ERROR;
}

async function loadRows(
 data: Promise<PomaLoadingsResponse>,
): Promise<PomaLoadingRow[]> {
 const response = await Promise.resolve(data);
 if (!response.ok || response.success === false) {
  throw new Error(responseErrorMessage(response));
 }
 return (response.data?.items ?? []).map(mapPomaLoadingItem);
}

async function loadDetail(row: PomaLoadingRow): Promise<PomaLoadingDetailDto> {
 const detailResponse = await getPomaLoadingDetailAction({
  loadingId: row.loadingId,
  loadingType: row.loadingType,
 });

 if (!detailResponse.ok || detailResponse.success === false || !detailResponse.data) {
  throw new Error(detailResponse.message?.trim() || DETAIL_ERROR);
 }

 return detailResponse.data;
}

function applyDetail(
 row: PomaLoadingRow,
 setState: Dispatch<SetStateAction<PomaWorkspaceState>>,
): void {
 const settle = (patch: Partial<PomaWorkspaceState>) =>
  setState((current) =>
   current.row?.loadingId === row.loadingId
    ? { ...current, ...patch, loading: false }
    : current,
  );

 loadDetail(row)
  .then((detail) => settle({ detail }))
  .catch((error) => settle({ error: requestErrorMessage(error) }));
}

function usePomaWorkspace(data: Promise<PomaLoadingsResponse>) {
 const { params, setParams } = useQueryParams();
 const radication = params.get("radication")?.trim() ?? "";
 const [state, setState] = useState<PomaWorkspaceState>(EMPTY_STATE);

 const selectRow = (row: PomaLoadingRow) => {
  if (row.loadingId === state.row?.loadingId) return;
  setParams({loadingId:row.loadingId});
  setState((current) => ({ ...current, row, detail: undefined, error: undefined, loading: true }));
  applyDetail(row, setState);
 };

 useEffect(() => {
  let active = true;
  if (!radication) {
   setState(EMPTY_STATE);
   return () => {
    active = false;
   };
  }

  setState({ ...EMPTY_STATE, loading: true });
  loadRows(data)
   .then(async (rows) => {
    if (!active) return;
    const first = rows.find(row=>row.loadingId===params.get("loadingId")) || rows[0];
    if (!first) {
     setState({ ...EMPTY_STATE, rows });
     return;
    }
    const detail = await loadDetail(first);
    if (active) setState({ detail, loading: false, row: first, rows });
   })
   .catch((error) => {
    if (active) {
     setState({
      ...EMPTY_STATE,
      error: requestErrorMessage(error),
     });
    }
   });

  return () => {
   active = false;
  };
 }, [data, radication]);

 return { radication, selectRow, ...state };
}

function PomaStageSelector({
 onSelect,
 rows,
 selectedId,
}: {
 onSelect: (row: PomaLoadingRow) => void;
 rows: PomaLoadingRow[];
 selectedId?: string;
}) {
 if (rows.length < 2) return null;

 const byLoadingId = new Map(rows.map((row) => [row.loadingId, row]));

 return (
  <Card className="bg-(--color-surface)">
   <div className="p-5">
    <p className="text-[14px] font-semibold text-(--color-text)">
     Esta radicación tiene {rows.length} cargues asociados a POMA
    </p>
    <p className="mt-1 text-[13px] text-(--color-text-2)">
     Selecciona el cargue y tramo que deseas revisar y genera el POMA.
    </p>
    <div className="mt-4">
     <CaseCarousel
      selectedKey={selectedId}
      onSelect={(key: string) => {
       const row = byLoadingId.get(key);
       if (row) onSelect(row);
      }}
      items={rows.map((row) => ({
       key: row.loadingId,
       eyebrow: row.farmCode,
       title: `${row.originName} → ${row.destinationName}`,
       subtitle: `Salida ${formatPomaDate(row.dispatchedFromOriginAt)}`,
       meta: `${formatPomaNumber(row.palletQuantity)} pallets · ${formatPomaNumber(row.boxQuantity)} cajas`,
       statusLabel: "Salida registrada",
       statusTone: "warning",
      }))}
     />
    </div>
   </div>
  </Card>
 );
}

function CardHeader({
 badge,
 description,
 eyebrow,
 title,
}: {
 badge?: ReactNode;
 description?: string;
 eyebrow?: string;
 title: string;
}) {
 return (
  <header className="flex items-start justify-between gap-4 border-b border-(--color-border-subtle) px-5 py-4 max-[720px]:flex-col">
   <div>
    {eyebrow && (
     <span className="text-[11px] font-semibold uppercase tracking-[.08em] text-(--color-primary-600)">
      {eyebrow}
     </span>
    )}
    <h2 className={`${eyebrow ? "mt-1" : ""} text-[18px] font-semibold text-(--color-text)`}>
     {title}
    </h2>
    {description && (
     <p className="mt-1.5 text-[13px] leading-[1.55] text-(--color-text-2)">
      {description}
     </p>
    )}
   </div>
   {badge}
  </header>
 );
}

function countReferences(detail: PomaLoadingDetailDto): number {
 const references = detail.document.loading.pallets.flatMap((pallet) =>
  pallet.composition.map(
   (item) => `${item.referenceCode}-${item.referenceVersion}`,
  ),
 );
 return new Set(references).size;
}

function getConsolidatedItems(
 detail: PomaLoadingDetailDto,
 row: PomaLoadingRow,
): KeyValueGridItem[] {
 const document = detail.document;

 return [
  { label: "Origen", value: document.origin.locationName },
  { label: "Destino", value: document.destination.locationName },
  {
   label: "Fecha y hora de salida",
   value: formatPomaDate(document.dispatch.dispatchedFromOriginAt),
  },
  { label: "Radicación", value: row.radication },
  {
   label: "Tipo de vehículo",
   value: displayPomaValue(document.transport.vehicleTypeName),
  },
  { label: "Placa", value: document.transport.vehiclePlate },
  { label: "Conductor", value: document.transport.driverName },
  {
   label: "Documento del conductor",
   value: document.transport.driverDocument,
  },
  { label: "Transportadora", value: document.transport.carrierName },
 ];
}

function getLoadingSummaryItems(
 detail: PomaLoadingDetailDto,
): KeyValueGridItem[] {
 const loading = detail.document.loading;

 return [
  { label: "Contenedor", value: displayPomaValue(loading.containerCode) },
  {
   label: "Tipo de contenedor",
   value: displayPomaValue(loading.containerType),
  },
  { label: "Cargue cerrado", value: formatPomaDate(loading.closedAt) },
  {
   label: "Precinto final",
   value: displayPomaValue(loading.finalSealNumber),
  },
  { label: "Sincronización", value: formatPomaDate(loading.syncedAt) },
  {
   label: "Pallets activos",
   value: formatPomaNumber(loading.palletQuantity),
  },
  {
   label: "SSCC trazados",
   value: formatPomaNumber(loading.pallets.length),
  },
  { label: "Total cajas", value: formatPomaNumber(loading.boxQuantity) },
  {
   label: "Peso estimado",
   value: formatPomaWeight(loading.estimatedWeightKg),
  },
  {
   label: "Referencias",
   value: formatPomaNumber(countReferences(detail)),
  },
 ];
}

// Feature-local semantic composition: KeyValueGrid has no plain/section variant.
function PomaDataSection({title, items}: {title: string; items: KeyValueGridItem[]}) {
 return <section className="poma-data-section"><h3>{title}</h3><dl className="poma-facts">{items.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></section>;
}

function PomaConsolidatedData({
 detail,
 row,
}: {
 detail: PomaLoadingDetailDto;
 row: PomaLoadingRow;
}) {
 return (
  <Card className="bg-(--color-surface) p-0!">
   <CardHeader
    title={`Datos del cargue · Rad. ${row.radication}`}
    description="Revisa la salida, el transporte y el contenido antes de descargar."
    badge={<Chip tone="active">Salida confirmada</Chip>}
   />
   <div className="p-5 poma-data-groups">
    <PomaDataSection title="Salida" items={getConsolidatedItems(detail,row).slice(0,3)} />
    <PomaDataSection title="Transporte" items={getConsolidatedItems(detail,row).slice(4)} />
    <PomaDataSection title="Cargue" items={getLoadingSummaryItems(detail).slice(0,5)} />
    <PomaDataSection title="Contenido" items={getLoadingSummaryItems(detail).slice(5)} />
   </div>
  </Card>
 );
}

function PalletReferences({ pallet }: { pallet: PomaPalletDto }) {
 if (pallet.composition.length === 0) return "—";

 return (
  <div className="grid gap-1">
   {pallet.composition.map((item, index) => (
    <span key={`${item.referenceCode}-${item.referenceVersion}-${index}`}>
     {item.referenceCode}{item.referenceName && item.referenceName !== item.referenceCode ? ` · ${item.referenceName}` : ""}{item.referenceVersion ? ` · V${item.referenceVersion}` : ""}
    </span>
   ))}
  </div>
 );
}

const PALLET_COLUMNS: TableColumn<PomaPalletDto>[] = [
 {
  key: "position",
  header: "Posición",
  width: "90px",
  align: "center",
  render: (row) => String(row.position).padStart(2, "0"),
 },
 { key: "sscc", header: "SSCC", width: "190px", render: (row) => row.sscc },
 {
  key: "reference",
  header: "Referencia",
  render: (row) => <PalletReferences pallet={row} />,
 },
 {
  key: "boxQuantity",
  header: "Cajas",
  width: "100px",
  align: "right",
  render: (row) => formatPomaNumber(row.boxQuantity),
 },
 {
  key: "estimatedWeightKg",
  header: "Peso estimado",
  width: "150px",
  align: "right",
  render: (row) => formatPomaWeight(row.estimatedWeightKg),
 },
];

function PomaPalletDetail({ detail }: { detail: PomaLoadingDetailDto }) {
 const [page, setPage] = useState(1);
 const [pageSize, setPageSize] = useState(10);
 useEffect(() => setPage(1), [detail]);
 const pallets = [...detail.document.loading.pallets].sort(
  (left, right) => left.position - right.position,
 );

 return (
  <Card className="overflow-hidden bg-(--color-surface) p-0!">
   <CardHeader
    title="Pallets del cargue"
    description="El documento incluye el detalle completo de los pallets activos de la salida seleccionada."
    badge={<Chip preset="info">{formatPomaNumber(pallets.length)} pallets</Chip>}
   />
   <div className="overflow-x-auto">
    <Table<PomaPalletDto>
     columns={PALLET_COLUMNS}
     data={pallets.slice((page-1)*pageSize,page*pageSize)}
     minWidth="780px"
     rowKey={(row) => row.palletId}
     emptyState="No hay pallets asociados al cargue seleccionado."
    />
   </div>
   <Pagination page={page} pageSize={pageSize} total={pallets.length} pageSizeOptions={[10,25,50]} onPageChange={setPage} onPageSizeChange={(size) => {setPageSize(size);setPage(1);}} />
  </Card>
 );
}

function PomaEmission({
 detail,
 row,
}: {
 detail: PomaLoadingDetailDto;
 row: PomaLoadingRow;
}) {
 return (
  <Card className="bg-(--color-surface) p-0!">
   <CardHeader
    title="Generación del documento"
    description="Registro de emisión de la POMA seleccionada."
   />
   <div className="p-5">
    <dl className="poma-emission-facts poma-facts">{getEmissionItems(detail).map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
    {readPomaDocument(row.loadingId) && <p className="poma-local-generation">Última generación local: {formatPomaDate(readPomaDocument(row.loadingId).generatedAt)} · {readPomaDocument(row.loadingId).localCount} {readPomaDocument(row.loadingId).localCount === 1 ? "documento de demostración" : "documentos de demostración"}</p>}
    <PomaEmissionAction row={row} />
   </div>
  </Card>
 );
}

function getEmissionItems(detail: PomaLoadingDetailDto): KeyValueGridItem[] {
 const document = detail.document;
 const generatedAt = detail.pomaLastGeneratedAt
  ? formatPomaDate(detail.pomaLastGeneratedAt)
  : "Se asigna al generar";

 return [
  { label: "Formato", value: "PDF" },
  {
   label: "Plantilla",
   value: detail.pomaTemplateVersion ?? document.templateVersion,
  },
  {
   label: "Número de documento",
   value: formatPomaDocumentReference(document.documentReference),
  },
  { label: "Fecha de generación", value: generatedAt },
  {
   label: "Usuario emisor",
   value: formatPomaIdentifier(document.audit.requestedBy),
  },
  {
   label: "Generaciones previas",
   value: formatPomaNumber(detail.pomaGenerationCount),
  },
 ];
}

function PomaEmissionAction({ row }: { row: PomaLoadingRow }) {
  return (
    <div className="poma-download-action">
      <p>El PDF incluye la remisión de carga y el detalle de pallets.</p>
      <PermissionGate requiredKey={"audit.poma.management.page"} requiredAction={["export"]} fallback={null}>
        <PomaDownloadButton
          loadingId={row.loadingId}
          loadingType={row.loadingType}
          pomaAvailable={row.pomaAvailable}
          pomaGenerationCount={row.pomaGenerationCount}
        />
      </PermissionGate>
    </div>
  );
}

export function PomaWorkspace({ data }: { data: Promise<PomaLoadingsResponse> }) {
 const workspace = usePomaWorkspace(data);

 if (!workspace.radication) return null;
 if (workspace.error) return <Notice variant="error">{workspace.error}</Notice>;

 const selector = (
  <PomaStageSelector
   rows={workspace.rows}
   selectedId={workspace.row?.loadingId}
   onSelect={workspace.selectRow}
  />
 );

 if (workspace.loading) {
  return (
   <>
    {selector}
    <Card className="bg-(--color-surface)">
     <ViewMotion visible message="Consolidando la información de la POMA..." />
    </Card>
   </>
  );
 }
 if (!workspace.row || !workspace.detail) {
  return (
   <Notice variant="info">
    No encontramos cargues asociados a POMA para la radicación{" "}
    {workspace.radication}. Verifica el número e inténtalo nuevamente.
   </Notice>
  );
 }

 return (
  <>
   {selector}
   <PomaConsolidatedData detail={workspace.detail} row={workspace.row} />
   <PomaPalletDetail detail={workspace.detail} />
   <PomaEmission detail={workspace.detail} row={workspace.row} />
  </>
 );
}
