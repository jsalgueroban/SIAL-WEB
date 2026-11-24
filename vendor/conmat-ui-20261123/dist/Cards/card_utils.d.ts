import { CSSProperties, ReactNode } from 'react';
export declare const BASE_BORDER_CARD = "3px";
export interface BorderProps {
    leftBorder?: boolean;
    rightBorder?: boolean;
    topBorder?: boolean;
    bottomBorder?: boolean;
    colorBorder?: string;
    widthBorder?: number;
}
export declare const getBorder: (config: BorderProps) => CSSProperties;
interface CardBaseProps extends BorderProps {
    className?: string;
    style?: CSSProperties;
}
export type cardVariant = 'default' | 'stats';
interface DefaultVariantProps extends CardBaseProps {
    variant?: 'default';
    title?: ReactNode;
    description?: ReactNode;
    children?: ReactNode;
}
interface StatsVariantProps extends CardBaseProps {
    variant: 'stats';
    title: string;
    value: string | number;
    titleClassName?: string;
    description?: string;
}
export type CardProps = DefaultVariantProps | StatsVariantProps;
export declare const cardStyleBased = "bui-card";
export {};
