import { BaseInputProps } from '../input.type';
export interface SelectOption<T = string> {
    label: string;
    value: T;
    description?: string;
    disabled?: boolean;
}
export interface SelectProps<T = string> extends Omit<BaseInputProps<T>, 'readonly'> {
    options: SelectOption<T>[];
    /** Clases del contenedor para composición dentro de layouts flex o grid. */
    containerClassName?: string;
}
