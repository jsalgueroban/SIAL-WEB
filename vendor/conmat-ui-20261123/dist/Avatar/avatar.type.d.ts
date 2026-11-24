import { ReactNode, MouseEvent, KeyboardEvent } from 'react';
/**
 * Tipos primitivos para el componente
 */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarShape = 'circle' | 'square' | 'rounded' | 'triangle' | 'diamond' | 'hexagon' | 'octagon';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away' | 'none';
export type AvatarVariant = 'image' | 'initials' | 'icon' | 'fallback';
/**
 * Avatar menu items
 */
export interface AvatarMenuItem {
    id: string;
    label: string;
    icon?: string | ReactNode;
    disabled?: boolean;
    danger?: boolean;
    shortcut?: string;
    subItems?: AvatarMenuItem[];
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}
/**
 * Items para el menu del avatar
 */
export interface AvatarMenuProps {
    items: AvatarMenuItem[];
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    itemClassName?: string;
    subMenuClassName?: string;
}
/**
 * Avatar badge
 */
export interface AvatarBadgeProps {
    count?: number;
    max?: number;
    dot?: boolean;
    status?: AvatarStatus;
    className?: string;
}
/**
 * Props componente Avatar
 */
export interface AvatarBaseProps {
    /** Image source URL */
    src?: string;
    /** Alt text for the image (required for accessibility) */
    alt: string;
    /** Fallback icon when no src or initials */
    icon?: string | ReactNode;
    /** Auto-generated from alt if src fails */
    initials?: string;
    /** Avatar size token or arbitrary value via className */
    size?: AvatarSize;
    /** Avatar shape */
    shape?: AvatarShape;
    /** Online presence indicator */
    status?: AvatarStatus;
    /** Badge configuration */
    badge?: AvatarBadgeProps;
    /** Context menu items */
    menuItems?: AvatarMenuItem[];
    /** Click handler */
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    /** Keyboard handler */
    onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
    /** Additional class for the root element */
    className?: string;
    /** Class for the inner image/icon/initials container */
    innerClassName?: string;
    /** Class for the status indicator */
    statusClassName?: string;
    /** Class for the badge */
    badgeClassName?: string;
    /** Disable all interactions */
    disabled?: boolean;
    /** Tab index (default 0 when interactive) */
    tabIndex?: number;
    /** Whether the avatar triggers a menu on click */
    hasMenu?: boolean;
    /** Custom CSS variables to inject (e.g. { '--avatar-size': '56px' }) */
    style?: React.CSSProperties;
}
/**
 * Grupo de avatares composicion
 */
export interface AvatarGroupProps {
    avatars: AvatarBaseProps[];
    max?: number;
    size?: AvatarSize;
    shape?: AvatarShape;
    spacing?: 'tight' | 'normal' | 'loose';
    surplusClassName?: string;
    className?: string;
}
export interface AvatarComposition {
    Group: React.FC<AvatarGroupProps>;
    Menu: React.FC<AvatarMenuProps>;
    Badge: React.FC<AvatarBadgeProps>;
}
