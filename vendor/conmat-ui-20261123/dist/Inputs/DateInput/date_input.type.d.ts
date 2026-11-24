import { BaseInputProps } from '../input.type';
export interface DateInputProps extends BaseInputProps<Date | null> {
    minDate?: Date;
    maxDate?: Date;
}
