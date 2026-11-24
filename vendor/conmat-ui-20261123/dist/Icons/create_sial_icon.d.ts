import { ReactNode } from 'react';
import { SialIconProps } from './icon';
import { SialIconName } from './icon_registry';
type SialNamedIconComponent = ((props: Omit<SialIconProps, "name">) => ReactNode) & {
    displayName?: string;
};
export declare function createSialIcon(name: SialIconName): SialNamedIconComponent;
export {};
