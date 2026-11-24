import { AvatarSize, AvatarShape, AvatarStatus } from './avatar.type';
export declare const AVATAR_SIZE_CLASSES: Record<AvatarSize, string>;
export declare const AVATAR_STATUS_BADGE_SIZE: Record<AvatarSize, string>;
export declare const AVATAR_SHAPE_CLASSES: Record<AvatarShape, string>;
export declare const AVATAR_STATUS_COLORS: Record<AvatarStatus, string>;
export declare const AVATAR_GROUP_SPACING: {
    readonly tight: "-space-x-4";
    readonly normal: "-space-x-3";
    readonly loose: "-space-x-1";
};
export declare const AVATAR_DEFAULTS: {
    readonly size: AvatarSize;
    readonly shape: AvatarShape;
    readonly status: AvatarStatus;
    readonly maxBadge: 99;
};
