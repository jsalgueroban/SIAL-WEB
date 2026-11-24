import { HTMLAttributes, ReactNode } from 'react';
export interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    compact?: boolean;
}
