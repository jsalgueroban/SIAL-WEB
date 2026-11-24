import { HTMLAttributes, ReactNode } from 'react';
export type ToastVariant = "info" | "success" | "warning" | "error";
export type ToastPlacement = "top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center";
export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    variant?: ToastVariant;
    title?: ReactNode;
    description?: ReactNode;
    /** Reemplaza el símbolo semántico predeterminado dentro de la cápsula de feedback. */
    icon?: ReactNode;
    /** Acción contextual, por ejemplo "Deshacer" o "Ver detalle". */
    action?: ReactNode;
    visible?: boolean;
    closable?: boolean;
    onClose?: () => void;
}
export interface ToastData {
    id?: string;
    variant?: ToastVariant;
    title?: ReactNode;
    description?: ReactNode;
    icon?: ReactNode;
    action?: ReactNode;
    duration?: number;
    closable?: boolean;
}
export interface ToastProviderProps {
    children: ReactNode;
    placement?: ToastPlacement;
    duration?: number;
    maxToasts?: number;
}
export interface ToastContextValue {
    show: (toast: ToastData) => string;
    info: (toast: Omit<ToastData, "variant">) => string;
    success: (toast: Omit<ToastData, "variant">) => string;
    warning: (toast: Omit<ToastData, "variant">) => string;
    error: (toast: Omit<ToastData, "variant">) => string;
    dismiss: (id: string) => void;
    clear: () => void;
}
