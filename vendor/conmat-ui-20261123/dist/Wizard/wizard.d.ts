export interface WizardContextValue {
    next: () => void;
    prev: () => void;
    currentIndex: number;
    stepsCount: number;
}
export declare const WizardContext: import('react').Context<WizardContextValue | null>;
export declare function useWizard(): WizardContextValue;
