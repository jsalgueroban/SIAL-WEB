export type PaginationPageItem = number | "gap";
export declare function clampPage(page: number, totalPages: number): number;
export declare function getTotalPages(total: number, pageSize: number): number;
export declare function getPaginationSummary(page: number, pageSize: number, total: number): {
    start: number;
    end: number;
};
export declare function getVisiblePages(page: number, totalPages: number): PaginationPageItem[];
export declare function normalizePageSizeOptions(options: number[] | undefined, pageSize: number): number[];
