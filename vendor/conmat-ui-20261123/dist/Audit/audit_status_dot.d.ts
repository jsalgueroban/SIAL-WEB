import { ReactNode } from 'react';
import { AuditStatusTone } from './audit.type';
export interface AuditStatusDotProps {
    tone?: AuditStatusTone;
    label?: ReactNode;
    active?: boolean;
    className?: string;
}
export declare function AuditStatusDot({ active, className, label, tone, }: AuditStatusDotProps): ReactNode;
