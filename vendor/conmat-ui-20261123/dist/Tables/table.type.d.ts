import { HTMLAttributes, Key, ReactNode, TableHTMLAttributes } from 'react';
export type TableColumnAlign = "left" | "center" | "right";
export type TableSortDirection = "asc" | "desc";
export interface TableSortState {
    key: string;
    direction: TableSortDirection;
}
export interface TableColumn<T> {
    key: string;
    header: ReactNode;
    render: (row: T, index: number) => ReactNode;
    width?: string;
    align?: TableColumnAlign;
    className?: string;
    headerClassName?: string;
    sortable?: boolean;
    sortKey?: string;
    initialSortDirection?: TableSortDirection;
    sortLabel?: string;
}
export interface PaginationState {
    page: number;
    pageSize: number;
}
export interface TableProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    columns: TableColumn<T>[];
    data: T[];
    actions?: (row: T, index: number) => ReactNode;
    actionsHeader?: ReactNode;
    actionsWidth?: string;
    actionsClassName?: string;
    emptyState?: ReactNode;
    loading?: boolean;
    loadingState?: ReactNode;
    striped?: boolean;
    bordered?: boolean;
    minWidth?: string;
    rowKey?: (row: T, index: number) => Key;
    rowClassName?: string | ((row: T, index: number) => string | undefined);
    rowProps?: (row: T, index: number) => HTMLAttributes<HTMLTableRowElement>;
    sort?: TableSortState;
    onSortChange?: (sort: TableSortState) => void;
    tableClassName?: string;
    tableProps?: Omit<TableHTMLAttributes<HTMLTableElement>, "children">;
}
