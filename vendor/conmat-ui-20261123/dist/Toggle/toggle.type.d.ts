import { BaseInputProps } from '../Inputs/input.type';
export type MixedValue = boolean | null;
export interface ToggleProps extends Omit<BaseInputProps<boolean>, "variant"> {
    labelPosition?: "left" | "right";
}
export interface ToggleMixedProps extends Omit<BaseInputProps<MixedValue>, "variant"> {
    labelPosition?: "left" | "right";
}
