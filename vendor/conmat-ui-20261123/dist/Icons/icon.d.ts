import { SVGProps } from 'react';
import { SialIconName } from './icon_registry';
export type SialIconAnimation = "default" | "path" | "path-loop" | "pointing" | "pulse" | "shake" | "spin" | "point-right" | "point-left" | "point-down" | "schedule" | "chart-rise" | "confirm" | "dismiss" | "layout" | "place" | "target" | "add" | "document" | "write" | "adjust" | "route" | "menu" | "reveal" | "alert" | "lock" | "clock" | "sun" | "moon" | "ring" | "search" | "drive" | "group" | "info";
export type SialIconProps = Omit<SVGProps<SVGSVGElement>, "children" | "dangerouslySetInnerHTML"> & {
    name: SialIconName;
    size?: number | string;
    title?: string;
    animation?: SialIconAnimation;
    animate?: boolean;
    animateOnHover?: boolean;
    animateOnTap?: boolean;
    animateOnView?: boolean;
    animateOnViewMargin?: string;
    animateOnViewOnce?: boolean;
    loop?: boolean;
    delay?: number;
};
export declare function SialIcon({ name, size, title, className, color, style, animation, animate, animateOnHover, animateOnTap, animateOnView, animateOnViewMargin, animateOnViewOnce, loop, delay, ...svgProps }: SialIconProps): React.ReactNode;
