import { HTMLAttributes, ReactNode } from 'react';
export type SpinnerSize = "sm" | "md" | "lg";
export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
    visible?: boolean;
    size?: SpinnerSize;
    label?: ReactNode;
    inline?: boolean;
}
