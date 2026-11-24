import { ReactNode } from 'react';
export interface GroupMoveItem {
    id: string;
    label: string;
    description?: ReactNode;
    icon?: ReactNode;
    badge?: ReactNode;
    detail?: ReactNode;
    dragPreview?: {
        icon?: ReactNode;
        label?: string;
    };
    disabled?: boolean;
}
export interface GroupMoveGroup {
    id: string;
    label: string;
    items: GroupMoveItem[];
    eyebrow?: string;
    disabled?: boolean;
    emptyText?: string;
    moveAll?: {
        toGroupId: string;
        label: string;
    };
    moveHereLabel?: (count: number) => string;
}
export interface GroupMoveEvent {
    itemId: string;
    fromGroupId: string;
    toGroupId: string;
}
export interface GroupMoveManyEvent {
    itemIds: string[];
    fromGroupId: string;
    toGroupId: string;
}
export interface GroupMoveProps {
    groups: GroupMoveGroup[];
    onMove: (event: GroupMoveEvent) => void;
    onMoveMany?: (event: GroupMoveManyEvent) => void;
    canMove?: (event: GroupMoveEvent) => boolean;
    label?: string;
    disabled?: boolean;
}
