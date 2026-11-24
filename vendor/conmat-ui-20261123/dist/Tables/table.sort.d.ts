import { TableSortDirection, TableSortState } from './table.type';
export type TableAriaSort = "none" | "ascending" | "descending";
interface SortableColumn {
    key: string;
    initialDirection?: TableSortDirection;
}
export declare function getNextTableSort(current: TableSortState | undefined, column: SortableColumn): TableSortState;
export declare function getTableAriaSort(sort: TableSortState | undefined, columnKey: string): TableAriaSort;
export {};
