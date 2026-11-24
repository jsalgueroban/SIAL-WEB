import { GroupMoveGroup, GroupMoveItem, GroupMoveManyEvent, GroupMoveProps } from './group_move.type';
type Selection = Pick<GroupMoveManyEvent, "itemIds" | "fromGroupId">;
export declare function useGroupMove({ groups, onMove, onMoveMany, canMove, disabled }: GroupMoveProps): {
    selection: {
        fromGroupId: string;
        itemIds: string[];
    } | null;
    selectedItems: GroupMoveItem[];
    dragged: Selection | null;
    over: string | null;
    setOver: import('react').Dispatch<import('react').SetStateAction<string | null>>;
    announcement: string;
    buttons: import('react').RefObject<Map<string, HTMLButtonElement>>;
    allowed: (batch: Selection, group: GroupMoveGroup) => boolean;
    moveTo: (batch: Selection, group: GroupMoveGroup, focus: boolean) => void;
    select: (group: GroupMoveGroup, item: GroupMoveItem, range: boolean) => void;
    selectAll: (group: GroupMoveGroup) => void;
    allSelected: (group: GroupMoveGroup) => boolean;
    startDrag: (group: GroupMoveGroup, item: GroupMoveItem) => {
        fromGroupId: string;
        itemIds: string[];
    };
    cancel: () => void;
    endDrag: () => void;
};
export {};
