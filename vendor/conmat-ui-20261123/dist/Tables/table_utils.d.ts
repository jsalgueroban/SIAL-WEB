import { TableColumnAlign } from './table.type';
export declare function joinClasses(...classes: Array<string | undefined | false>): string;
export declare function autoHeader(key: string): string;
export declare function getTableClass(striped?: boolean, bordered?: boolean): string;
export declare function getTableAlignClass(align?: TableColumnAlign): string;
export declare function getTotalPages(total: number, pageSize: number): number;
export type PageRangeItem = number | "...";
export declare function getPageRange(page: number, totalPages: number): PageRangeItem[];
