import { HTMLAttributes, Key, ReactNode } from 'react';
export type TreeListVariant = "navigation" | "selection";
export interface TreeListNode<T = string> {
    label: ReactNode;
    value: T;
    description?: ReactNode;
    children?: TreeListNode<T>[];
    disabled?: boolean;
}
export interface TreeListProps<T = string> extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onSelect"> {
    nodes: TreeListNode<T>[];
    variant?: TreeListVariant;
    selectable?: boolean;
    checkedValues?: Set<T>;
    onChecked?: (value: T, checked: boolean, node: TreeListNode<T>) => void;
    selectedValue?: T;
    onSelect?: (value: T, node: TreeListNode<T>) => void;
    expandedValues?: Iterable<T>;
    defaultExpandedValues?: Iterable<T>;
    onExpandedChange?: (values: T[], node: TreeListNode<T>, expanded: boolean) => void;
    getNodeKey?: (node: TreeListNode<T>, index: number, path: number[]) => Key;
    emptyState?: ReactNode;
}
