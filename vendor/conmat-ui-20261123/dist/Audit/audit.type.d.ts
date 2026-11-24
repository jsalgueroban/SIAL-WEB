import { HTMLAttributes, ReactNode } from 'react';
import { ChipTone } from '../Chips/chip.type';
export type AuditStatusTone = ChipTone;
export interface CaseCarouselItem {
    key: string;
    title: ReactNode;
    eyebrow?: ReactNode;
    subtitle?: ReactNode;
    meta?: ReactNode;
    statusLabel?: ReactNode;
    statusTone?: AuditStatusTone;
}
export interface CaseCarouselProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
    /** Opt into refined cards and mouse drag with momentum. */
    variant?: "default" | "interactive";
    /** Interactive only: drift while idle, without changing selection. Defaults false. */
    autoAdvance?: boolean;
    items: CaseCarouselItem[];
    selectedKey?: string;
    emptyState?: ReactNode;
    onSelect?: (key: string, item: CaseCarouselItem) => void;
}
export interface FlowTimelineItem {
    key: string;
    title: ReactNode;
    description?: ReactNode;
    meta?: ReactNode;
    /** Persistent context, independent from selection (for example latest movement). */
    markerLabel?: ReactNode;
    timestamp?: {
        dateTime: string;
        label: ReactNode;
    };
    statusLabel?: ReactNode;
    statusTone?: AuditStatusTone;
    muted?: boolean;
}
export interface FlowTimelineProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
    items: FlowTimelineItem[];
    selectedKey?: string;
    emptyState?: ReactNode;
    reverseIndex?: boolean;
    variant?: "cards" | "connected";
    maxHeight?: React.CSSProperties["maxHeight"];
    onSelect?: (key: string, item: FlowTimelineItem) => void;
}
export interface KeyValueGridItem {
    label: ReactNode;
    value: ReactNode;
}
export interface KeyValueGridProps extends HTMLAttributes<HTMLDivElement> {
    items: KeyValueGridItem[];
    columns?: 2 | 3 | 4;
}
export interface EvidenceViewerItem {
    key: string;
    title: ReactNode;
    imageSrc?: string;
    imageAlt?: string;
    type?: ReactNode;
    capturedAt?: ReactNode;
    statusLabel?: ReactNode;
    statusTone?: AuditStatusTone;
    observationTitle?: ReactNode;
    observation?: ReactNode;
}
export interface EvidenceViewerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
    items: EvidenceViewerItem[];
    selectedKey?: string;
    emptyState?: ReactNode;
    onSelect?: (key: string, item: EvidenceViewerItem) => void;
}
export interface ControlPointItem {
    key: string;
    title: ReactNode;
    description?: ReactNode;
    statusLabel?: ReactNode;
    statusTone?: AuditStatusTone;
}
export interface ControlPointListProps extends HTMLAttributes<HTMLDivElement> {
    items: ControlPointItem[];
    emptyState?: ReactNode;
    compact?: boolean;
}
export interface CommentListItem {
    key: string;
    author: ReactNode;
    date?: ReactNode;
    children: ReactNode;
}
export interface CommentListProps extends HTMLAttributes<HTMLDivElement> {
    items: CommentListItem[];
    emptyState?: ReactNode;
}
