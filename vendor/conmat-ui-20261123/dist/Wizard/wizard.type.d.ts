export type WizardFormVariant = "default" | "dots";
export interface WizardFormProps {
    children: React.ReactNode;
    onFinish: () => void;
    className?: string;
    variant?: WizardFormVariant;
    hideActions?: boolean;
}
export interface WizardStepProps {
    title: string;
    children?: React.ReactNode;
    validate?: () => boolean | Promise<boolean>;
}
