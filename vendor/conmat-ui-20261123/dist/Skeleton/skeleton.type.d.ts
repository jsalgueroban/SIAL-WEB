import { HTMLAttributes } from 'react';
export type SkeletonShape = "line" | "block" | "circle";
export type SkeletonAnimation = "shimmer" | "pulse" | "none";
export type SkeletonTone = "default" | "soft" | "strong";
export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    visible?: boolean;
    shape?: SkeletonShape;
    width?: string | number;
    height?: string | number;
    lines?: number;
    radius?: string | number;
    gap?: string | number;
    lastLineWidth?: string | number;
    animation?: SkeletonAnimation;
    tone?: SkeletonTone;
}
export interface SkeletonTextProps extends Omit<SkeletonProps, "shape"> {
    lines?: number;
}
export interface SkeletonCardProps extends HTMLAttributes<HTMLDivElement> {
    visible?: boolean;
    avatar?: boolean;
    media?: boolean;
    actions?: boolean;
    lines?: number;
    animation?: SkeletonAnimation;
    tone?: SkeletonTone;
}
export interface SkeletonTableProps extends HTMLAttributes<HTMLDivElement> {
    visible?: boolean;
    rows?: number;
    columns?: number;
    showHeader?: boolean;
    animation?: SkeletonAnimation;
    tone?: SkeletonTone;
}
