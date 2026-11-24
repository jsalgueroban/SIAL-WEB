import { HTMLAttributes, Key, ReactElement, ReactNode } from 'react';
import { CheckboxCardProps } from '../Cards/CheckboxCard/checkbox_card.type';
import { TreeListNode } from '../TreeList/tree_list.type';
export type TransferListVariant = "card" | "tree";
export interface CardTransferListData<T> {
    render: ReactElement<CheckboxCardProps<T>>;
    selected?: boolean;
}
export interface TransferListItem<T> {
    value: T;
    label: ReactNode;
    description?: ReactNode;
    selected?: boolean;
    disabled?: boolean;
}
export interface TransferListProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    variant?: TransferListVariant;
    inverted?: boolean;
    titles?: [ReactNode, ReactNode];
    onChange?: (selected: T[], unselected: T[]) => void;
    items?: TransferListItem<T>[];
    data?: CardTransferListData<T>[];
    selectedValues?: T[];
    getItemKey?: (value: T) => Key;
    treeNodes?: TreeListNode<T>[];
    treeSelected?: T[];
    emptyState?: ReactNode;
    emptyStates?: [ReactNode, ReactNode];
    showBulkActions?: boolean;
    panelClassName?: string;
    listClassName?: string;
    actionsClassName?: string;
}
export type { TreeListNode };
