import { CSSProperties } from 'react';
export type SialMascotPose = "neutral" | "authentication" | "forbidden" | "maintenance";
export interface SialMascotProps {
    pose?: SialMascotPose;
    motion?: "once" | "loop" | "none";
    paused?: boolean;
    size?: number | string;
    label?: string;
    className?: string;
    style?: CSSProperties;
    /** Maintenance timing; motion controls once/loop/none. Changing replayKey restarts the sequence. */
    maintenance?: {
        cycleDurationMs?: number;
        replayKey?: string | number;
        sparks?: boolean;
        /** @deprecated Use sparks. Retained as an alias for existing consumers. */
        dust?: boolean;
    };
}
