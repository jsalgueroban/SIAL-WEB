export type TimelineOrientation = "vertical" | "horizontal";
export type TimelineItemStatus = "pending" | "active" | "completed" | "error";
export interface TimelineItemData {
    key: string;
    title: string;
    description?: string;
    date?: string;
    status?: TimelineItemStatus;
    color?: string;
    children?: React.ReactNode;
}
export interface TimelineProps {
    items: TimelineItemData[];
    orientation?: TimelineOrientation;
    className?: string;
    expandedKeys?: string[];
    selectedKey?: string;
    onExpandChange?: (key: string, expanded: boolean) => void;
    onSelect?: (key: string) => void;
}
