import { ReactNode } from 'react';
export interface DrawerDetail {
    label: string;
    children?: ReactNode;
}
export type DrawerPosition = "left" | "right";
export interface DrawerAuditItemData {
    title: ReactNode;
    meta?: ReactNode;
}
export interface DrawerAuditItemProps extends DrawerAuditItemData {
    className?: string;
}
export interface DrawerAuditListProps {
    items: DrawerAuditItemData[];
    className?: string;
}
export interface DrawerProps {
    show: boolean;
    onClose?: () => void;
    title?: string;
    subtitle?: string;
    data?: DrawerDetail[];
    children?: ReactNode;
    position?: DrawerPosition;
    width?: string;
    ariaLabel?: string;
}
