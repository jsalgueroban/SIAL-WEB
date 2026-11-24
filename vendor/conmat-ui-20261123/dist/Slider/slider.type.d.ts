import { ReactElement, ReactNode } from 'react';
export type SliderVariant = "coverflow" | "carousel";
export interface SliderFrameProps {
    children?: ReactNode;
    label?: string;
    caption?: string;
    className?: string;
}
export interface SliderProps {
    className?: string;
    children?: ReactElement<SliderFrameProps> | ReactElement<SliderFrameProps>[];
    drawable?: boolean;
    disabled?: boolean;
    variant?: SliderVariant;
    stopButton?: ReactElement;
}
