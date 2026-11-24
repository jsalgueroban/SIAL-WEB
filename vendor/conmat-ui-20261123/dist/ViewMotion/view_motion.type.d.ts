import { HTMLAttributes, ReactNode } from 'react';
export interface ViewMotionProps extends HTMLAttributes<HTMLDivElement> {
    visible?: boolean;
    message?: ReactNode;
    delay?: number;
    inline?: boolean;
    showBar?: boolean;
    brand?: ReactNode;
    cardClassName?: string;
    barClassName?: string;
}
