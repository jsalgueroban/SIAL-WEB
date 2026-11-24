import { BaseChartProps } from '../common/chart.type';
export type BarChartOrientation = "vertical" | "horizontal";
export type BarChartLayout = "grouped" | "stacked";
export interface BarChartProps extends BaseChartProps {
    orientation?: BarChartOrientation;
    layout?: BarChartLayout;
    barRadius?: number;
}
export interface BarRect {
    x: number;
    y: number;
    width: number;
    height: number;
    value: number;
    label: string;
    seriesIndex: number;
}
export interface BarChartScale {
    yTicks: number[];
    yMin: number;
    yMax: number;
    plotWidth: number;
    plotHeight: number;
    valueToY: (value: number) => number;
    valueToX: (value: number) => number;
}
