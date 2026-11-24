import { BaseChartProps } from '../common/chart.type';
export type LineChartCurve = "linear" | "monotone" | "step";
export interface LineChartProps extends BaseChartProps {
    curve?: LineChartCurve;
    showArea?: boolean;
    showDots?: boolean;
    showAxes?: boolean;
    showAxisLabels?: boolean;
}
export interface Point {
    x: number;
    y: number;
}
