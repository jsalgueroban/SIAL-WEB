import { ButtonHTMLAttributes, ReactNode } from 'react';
export type ButtonVariant = "outlined" | "filled" | "ghost";
export type IconButtonVariant = "base" | ButtonVariant;
export interface BaseButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className" | "disabled" | "onClick" | "onSubmit" | "type"> {
    type?: "button" | "submit" | "reset";
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onSubmit?: (event: React.SubmitEvent<HTMLButtonElement>) => void;
    children: ReactNode;
    disabled?: boolean;
}
export interface ButtonsProps extends BaseButtonProps {
    variant?: ButtonVariant;
}
export interface IconButtonsProps extends BaseButtonProps {
    variant?: IconButtonVariant;
}
