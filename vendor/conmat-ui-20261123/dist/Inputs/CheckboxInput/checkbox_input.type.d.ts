import { BaseInputProps } from '../input.type';
export interface CheckboxProps extends BaseInputProps<boolean> {
    labelPosition?: "left" | "right";
    boxClassName?: string;
}
