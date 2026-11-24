import { HTMLAttributes, ReactNode } from 'react';
export interface FilterToolbarProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    active: boolean;
    onClear: () => void;
    clearLabel?: string;
    actions?: ReactNode;
    /** Maximum number of primary fields; narrower containers reveal the rest on demand. */
    primaryCount?: number;
}
/** Controlled filter composition. Values and reset semantics belong to the consumer. */
export declare function FilterToolbar({ children, active, onClear, clearLabel, actions, primaryCount, className, ...props }: FilterToolbarProps): ReactNode;
