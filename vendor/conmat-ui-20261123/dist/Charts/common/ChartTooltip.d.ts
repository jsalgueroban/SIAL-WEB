import { TooltipState } from './chart.type';
interface ChartTooltipProps {
    tooltip: TooltipState;
    tooltipRef: React.RefObject<HTMLDivElement | null>;
}
export declare function ChartTooltip({ tooltip, tooltipRef }: ChartTooltipProps): React.ReactNode;
export {};
