import { HTMLAttributes, ReactNode } from 'react';
export type NoticeVariant = "info" | "warning" | "success" | "error";
export type NoticeIconPosition = "left" | "right";
export interface NoticeProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    heading?: ReactNode;
    variant?: NoticeVariant;
    iconPosition?: NoticeIconPosition;
}
