import { HTMLAttributes, ReactNode } from 'react';
export type ChipVariant = "outlined" | "filled";
export type ChipTone = "default" | "primary" | "info" | "success" | "active" | "warning" | "error" | "inactive";
export type ChipPreset = Exclude<ChipTone, "default" | "primary">;
export type RibbonCodeValue = "BL" | "AZ" | "RO" | "CA" | "NE" | "NA" | "VE" | "AM" | "PU";
export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
    children: ReactNode;
    variant?: ChipVariant;
    tone?: ChipTone;
    preset?: ChipPreset;
    color?: string;
}
export type ChipsProps = ChipProps;
export interface RibbonCodeProps extends HTMLAttributes<HTMLSpanElement> {
    code: RibbonCodeValue;
    children?: ReactNode;
}
export interface RibbonLabelProps extends HTMLAttributes<HTMLSpanElement> {
    code: RibbonCodeValue;
    children?: ReactNode;
}
