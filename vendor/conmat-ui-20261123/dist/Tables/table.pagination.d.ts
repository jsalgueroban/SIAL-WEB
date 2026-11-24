import { PaginationState } from './table.type';
interface TablePaginationProps {
    state: PaginationState;
    totalItems: number;
    pageSizeOptions: number[];
    onChange: (next: PaginationState) => void;
}
export declare function TablePagination({ state, totalItems, pageSizeOptions, onChange, }: TablePaginationProps): import("react/jsx-runtime").JSX.Element;
export {};
