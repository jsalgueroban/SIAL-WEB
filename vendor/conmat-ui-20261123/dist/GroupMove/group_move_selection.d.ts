import { GroupMoveGroup, GroupMoveItem, GroupMoveManyEvent } from './group_move.type';
export declare function selectableItemIds(group: GroupMoveGroup): string[];
export declare function resolveMoveItems(groups: GroupMoveGroup[], move: GroupMoveManyEvent): GroupMoveItem[];
