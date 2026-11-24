import { CSSProperties } from 'react';
export type ChristmasGarlandProps = {
    lights?: "ambient" | "all" | "off";
    motion?: "none" | "twinkle" | "paused";
    layout?: "auto" | "wide" | "compact";
    className?: string;
    style?: CSSProperties;
};
export declare function ChristmasGarland({ lights, motion, layout, className, style }: ChristmasGarlandProps): React.ReactNode;
