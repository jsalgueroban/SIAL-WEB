import { TableColumn } from './table.type';
/**
 * Definición abreviada de una columna.
 * Acepta dos formas:
 * - `'fieldName'` -> columna simple, header auto-generado
 * - `{ key: 'fieldName', render: ... }` -> columna con opciones custom
 */
export type ColumnDef<T> = (keyof T & string) | (Partial<Omit<TableColumn<T>, 'key'>> & {
    key: keyof T & string;
});
/**
 * Convierte un array de definiciones abreviadas en TableColumn completos.
 * @example
 * createColumns<User>([
 *   'id',
 *   'fullName',
 *   { key: 'role', align: 'left' },
 *   { key: 'status', render: (row) => <Badge>{row.status}</Badge> },
 * ])
 */
export declare function createColumns<T extends Record<string, unknown>>(defs: ColumnDef<T>[]): TableColumn<T>[];
