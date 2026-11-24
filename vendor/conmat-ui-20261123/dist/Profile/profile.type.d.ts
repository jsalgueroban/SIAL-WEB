import { HTMLAttributes, Key, ReactNode } from 'react';
export interface ProfileUser {
    initials?: string;
    name: string;
    role?: ReactNode;
    username?: ReactNode;
    document?: ReactNode;
    phone?: ReactNode;
    email?: ReactNode;
    alternativeEmail?: ReactNode;
}
export interface ProfileDetail {
    id?: Key;
    label: ReactNode;
    value: ReactNode;
}
export interface ProfileSection {
    id?: Key;
    eyebrow?: ReactNode;
    title: ReactNode;
    details: ProfileDetail[];
}
export interface ProfileFarm {
    id?: Key;
    name: string;
    initials?: string;
}
export interface ProfileFarmCarouselProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    farms: ProfileFarm[];
    variant?: "compact" | "full";
    visibleCount?: number;
    autoPlay?: boolean;
    autoPlayInterval?: number;
    ariaLabel?: string;
}
export interface ProfileMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    user: ProfileUser;
    farms: ProfileFarm[];
    company?: ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    onViewProfile?: () => void;
    onLogout?: () => void;
    viewProfileLabel?: ReactNode;
    logoutLabel?: ReactNode;
    autoPlay?: boolean;
    autoPlayInterval?: number;
}
export interface ProfileDialogProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
    open: boolean;
    user: ProfileUser;
    farms: ProfileFarm[];
    sections?: ProfileSection[];
    onClose: () => void;
    title?: ReactNode;
    closeLabel?: ReactNode;
    autoPlay?: boolean;
    autoPlayInterval?: number;
}
