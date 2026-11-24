import { RefObject } from 'react';
export declare function useCaseCarouselNavigation(stripRef: RefObject<HTMLDivElement | null>, keys: string, selectedKey?: string): {
    scroll: (direction: number, keyboard: boolean) => void;
    previous: boolean;
    next: boolean;
};
