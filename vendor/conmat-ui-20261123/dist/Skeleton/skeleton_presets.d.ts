import { SkeletonCardProps, SkeletonTableProps, SkeletonTextProps } from './skeleton.type';
export declare function SkeletonText({ lines, width, lastLineWidth, ...props }: SkeletonTextProps): React.ReactNode;
export declare function SkeletonCard({ visible, avatar, media, actions, lines, animation, tone, className, ...props }: SkeletonCardProps): React.ReactNode;
export declare function SkeletonTable({ visible, rows, columns, showHeader, animation, tone, className, ...props }: SkeletonTableProps): React.ReactNode;
