import { CSSProperties, ReactNode } from 'react';
import { OrnamentMotion } from './use-ornament-motion';
export type ChristmasDecorationProps = {
    children: ReactNode;
    /** Hide decorative artwork without remounting children. */
    enabled?: boolean;
    motion?: OrnamentMotion;
    className?: string;
    style?: CSSProperties;
};
export type ChristmasIndicatorDecorationProps = ChristmasDecorationProps & {
    variant?: "baubles" | "star";
    layout?: "inline" | "stretch";
    attachment?: "none" | "clip";
};
export type ChristmasCandyCaneProps = ChristmasDecorationProps & {
    anchorOffset?: number;
    placement?: "top" | "sides";
};
export declare function ChristmasActionDecoration({ children, enabled, motion, className, style }: ChristmasDecorationProps): ReactNode;
export declare function ChristmasIndicatorDecoration({ children, enabled, layout, attachment, variant, motion, className, style }: ChristmasIndicatorDecorationProps): ReactNode;
export declare function ChristmasCandyCane({ children, enabled, anchorOffset, placement, motion, className, style }: ChristmasCandyCaneProps): ReactNode;
