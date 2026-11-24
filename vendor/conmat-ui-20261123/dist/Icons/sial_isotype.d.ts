import { SVGProps } from 'react';
export type SialIsotypeProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
    variant?: "default" | "christmas" | "new-year";
    motion?: "none" | "welcome" | "festive";
    size?: number | string;
    title?: string;
};
export declare function SialIsotype({ size, variant, motion, title, className, ...svgProps }: SialIsotypeProps): React.ReactNode;
