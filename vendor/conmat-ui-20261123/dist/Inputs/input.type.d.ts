export type InputVariant = "outlined" | "ghost";
export interface BaseInputProps<T> {
    placeholder?: string;
    label?: string;
    value?: T;
    defaultValue?: T;
    onChange?: (value: T) => void;
    onBlur?: () => void;
    onFocus?: () => void;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    className?: string;
    helperText?: string;
    id?: string;
    name?: string;
    variant?: InputVariant;
    validate?: {
        status: boolean;
        message?: string;
    };
}
export interface baseInputError {
    message?: string;
    hasError: boolean;
}
