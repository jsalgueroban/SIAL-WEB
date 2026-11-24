import { TooltipState, TooltipEntry } from './chart.type';
interface UseChartTooltipReturn {
    tooltip: TooltipState;
    showTooltip: (x: number, y: number, label: string, entries: TooltipEntry[]) => void;
    hideTooltip: () => void;
    tooltipRef: React.RefObject<HTMLDivElement | null>;
}
export declare function useChartTooltip(): UseChartTooltipReturn;
export {};
