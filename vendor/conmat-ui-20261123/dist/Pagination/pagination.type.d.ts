import { HTMLAttributes, ReactNode } from 'react';
export interface PaginationProps extends HTMLAttributes<HTMLElement> {
    page: number;
    pageSize: number;
    total: number;
    pageSizeOptions?: number[];
    onPageChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    emptyState?: ReactNode;
    label?: string;
}
