import { BaseInputProps } from '../input.type';
export interface TextInputProps extends BaseInputProps<string> {
    type?: "text" | "email" | "password";
    maxLength?: number;
    minLength?: number;
    disableFocusEffect?: boolean;
    validationRegex?: RegExp | string;
    validationMessage?: string;
}
