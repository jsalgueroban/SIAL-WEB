import { FocusEvent, PointerEvent } from 'react';
export type OrnamentMotion = "reactive" | "paused" | "none";
type Swing = {
    amplitude: number;
    rest: number;
    duration: number;
    delay?: number;
};
export declare function useOrnamentMotion(motion: OrnamentMotion, swings: readonly Swing[]): {
    registerTarget: (index: number, node: SVGGElement | null) => void;
    onPointerEnter: () => void;
    onPointerDown: (event: PointerEvent<HTMLElement>) => void;
    onFocus: (event: FocusEvent<HTMLElement>) => void;
};
export {};
