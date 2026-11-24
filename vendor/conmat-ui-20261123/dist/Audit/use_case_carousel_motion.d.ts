import { RefObject } from 'react';
/** Internal motion controller; scrolling never changes controlled selection. */
export declare function useCaseCarouselMotion(root: RefObject<HTMLDivElement | null>, stripRef: RefObject<HTMLDivElement | null>, keys: string, enabled: boolean, autoAdvance: boolean): void;
