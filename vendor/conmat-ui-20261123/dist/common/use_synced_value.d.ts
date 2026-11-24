import { Dispatch, SetStateAction } from 'react';
type SyncedValueOptions<T> = {
    value?: T;
    defaultValue: T;
    isEqual?: (current: T, next: T) => boolean;
};
export declare function useSyncedValue<T>({ value, defaultValue, isEqual, }: SyncedValueOptions<T>): readonly [T, Dispatch<SetStateAction<T>>];
export {};
