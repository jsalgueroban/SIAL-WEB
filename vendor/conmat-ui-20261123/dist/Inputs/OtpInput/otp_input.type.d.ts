import { BaseInputProps } from '../input.type';
export interface OtpInputProps extends BaseInputProps<string> {
    digits: number;
    cellClassName?: string;
}
