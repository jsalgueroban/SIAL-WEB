import { ChartSelection } from './chart.type';
import { ChartKind, GenericChartData } from './generic-data';
import { ChartSettings } from './generic-options';
export interface SialChartProps {
    data: GenericChartData;
    kind: ChartKind;
    label: string;
    height?: number;
    settings?: Partial<ChartSettings>;
    status?: "ready" | "loading" | "error";
    errorMessage?: string;
    replayKey?: number;
    onSelect?: (selection: ChartSelection) => void;
}
export declare function SialChart({ data, kind, label, height, settings, status, errorMessage, replayKey, onSelect, }: SialChartProps): import("react/jsx-runtime").JSX.Element;
