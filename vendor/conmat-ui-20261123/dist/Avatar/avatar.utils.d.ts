import { AvatarShape } from './avatar.type';
/**
 * Toma el nombre completo y devuelve las iniciales - 2 caracteres definidos
 * @param name
 * @returns "?" si el nombre esta vacio "
 */
export declare function getInitials(name: string): string;
/**
 * Shapes that use CSS clip-path instead of border-radius.
 * These require the image to fill the entire container (object-cover).
 */
export declare const CLIP_PATH_SHAPES: AvatarShape[];
export declare function isClipPathShape(shape: AvatarShape): boolean;
/**
 * Clamps a number between min and max.
 */
export declare function clamp(value: number, min: number, max: number): number;
/**
 * Formats a badge count: 100 → "99+" with configurable max.
 */
export declare function formatBadgeCount(count: number, max?: number): string;
/**
 * Lightweight class-name merger (no dependency on clsx/cn).
 * Filters falsy values and joins with a space.
 */
export declare function cn(...classes: Array<string | undefined | null | false>): string;
