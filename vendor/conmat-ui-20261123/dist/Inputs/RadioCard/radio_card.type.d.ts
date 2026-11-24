import { FocusEventHandler, ReactNode } from 'react';
import { ChipTone } from '../../Chips/chip.type';
export interface RadioCardProps<T extends string | number = string> {
    value: T;
    title: ReactNode;
    checked?: boolean;
    defaultChecked?: boolean;
    description?: ReactNode;
    meta?: ReactNode;
    statusLabel?: ReactNode;
    statusTone?: ChipTone;
    name?: string;
    id?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    inputClassName?: string;
    onChange?: (value: T) => void;
    onBlur?: FocusEventHandler<HTMLInputElement>;
    onFocus?: FocusEventHandler<HTMLInputElement>;
}
