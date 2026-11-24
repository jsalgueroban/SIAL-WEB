import { BaseInputProps } from '../input.type';
export interface NumberInputProps extends BaseInputProps<number> {
    min?: number;
    max?: number;
    step?: number;
}
