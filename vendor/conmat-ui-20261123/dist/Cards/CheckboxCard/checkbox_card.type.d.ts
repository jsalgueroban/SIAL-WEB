import { BorderProps } from '../card_utils';
export interface CheckboxCardProps<T> extends BorderProps {
    children?: React.ReactNode;
    isChecked?: boolean;
    value: T;
    title: string;
    onChecked?: (value: T, checked: boolean) => void;
    hasShadow?: boolean;
    titleClassName?: string;
    className?: string;
}
