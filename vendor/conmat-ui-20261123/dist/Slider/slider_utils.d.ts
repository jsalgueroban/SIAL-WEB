import { ReactElement, ReactNode } from 'react';
export declare function cloneChildrens(children?: ReactNode, activeIndex?: number): ReactNode | undefined;
export declare function validateSingleChild(children: ReactElement): boolean;
export declare function addButtonClassAndMethod(child?: ReactElement, onClick?: () => void, disabled?: boolean): ReactElement | undefined;
export declare function getChildrenCount(children?: ReactNode): number;
export declare function useSlider(children: ReactNode, initialIndex?: number): {
    activeIndex: number;
    slidesCount: number;
    start: () => void;
    stop: () => void;
    next: () => void;
    prev: () => void;
    goTo: (index: number) => void;
};
