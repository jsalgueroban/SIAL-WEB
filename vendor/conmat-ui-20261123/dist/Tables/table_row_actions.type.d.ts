import { HTMLAttributes, ReactNode } from 'react';
export interface TableRowActionsProps extends Omit<HTMLAttributes<HTMLDivElement>, "aria-label" | "children" | "role"> {
    /** Nombre accesible del grupo de acciones de la fila. */
    label?: string;
    children: ReactNode;
}
