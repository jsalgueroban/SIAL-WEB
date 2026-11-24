import { ChartDataPoint } from './chart.type';
interface ChartXAxisProps {
    isVisible: boolean;
    dataPoints: ChartDataPoint[];
    indexToX: (index: number) => number;
    plotHeight: number;
}
export declare const ChartXAxis: ({ isVisible, dataPoints, indexToX, plotHeight }: ChartXAxisProps) => import("react/jsx-runtime").JSX.Element | null;
export {};
