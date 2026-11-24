/**
 *
 */
interface ChartGridProps {
    isVisible: boolean;
    yTicks: number[];
    valueToY: (value: number) => number;
    plotWidth: number;
}
export declare const ChartGrid: ({ isVisible, yTicks, valueToY, plotWidth }: ChartGridProps) => import("react/jsx-runtime").JSX.Element | null;
export {};
