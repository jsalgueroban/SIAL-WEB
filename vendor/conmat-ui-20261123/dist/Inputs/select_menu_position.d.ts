export interface FloatingMenuPosition {
    left: number;
    width: number;
    maxListHeight: number;
    top?: number;
    bottom?: number;
}
export interface FloatingMenuOptions {
    preferredHeight: number;
    reservedHeight: number;
    maxListHeight?: number;
    minWidth?: number;
}
export declare function shouldPaginateSelectResults(isRemote: boolean, total: number, pageSize: number): boolean;
export declare function getFloatingMenuPosition(trigger: HTMLButtonElement, { preferredHeight, reservedHeight, maxListHeight, minWidth, }: FloatingMenuOptions): FloatingMenuPosition;
