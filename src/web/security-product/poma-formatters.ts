// Adapted from fe-sial-web 4dfeb23d: poma/utils/poma-formatters.ts
import { formatDate } from "./bridge";

const NUMBER_FORMATTER = new Intl.NumberFormat("es-CO");
const UUID_PATTERN =
  /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
const PREFIXED_UUID_PATTERN =
  /^(.+?-)([0-9a-f]{8})(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
const WEIGHT_FORMATTER = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 3,
  minimumFractionDigits: 0,
});

export function displayPomaValue(value?: null | string): string {
  const normalized = value?.trim();
  return normalized ? normalized : "—";
}

export function formatPomaDate(value?: null | string): string {
  if (!value?.trim()) return "—";
  return formatDate(value) || "—";
}

export function formatPomaNumber(value: number): string {
  return NUMBER_FORMATTER.format(value);
}

export function formatPomaIdentifier(value?: null | string): string {
  const normalized = value?.trim();
  if (!normalized) return "—";
  return UUID_PATTERN.test(normalized) ? normalized.slice(0, 8) : normalized;
}

export function formatPomaDocumentReference(value?: null | string): string {
  const normalized = value?.trim();
  if (!normalized) return "—";
  const match = PREFIXED_UUID_PATTERN.exec(normalized);
  return match ? `${match[1]}${match[2]}` : normalized;
}

export function formatPomaWeight(value: number): string {
  return `${WEIGHT_FORMATTER.format(value)} kg`;
}
