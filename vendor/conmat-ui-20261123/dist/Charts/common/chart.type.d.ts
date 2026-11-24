export interface ChartDataPoint {
    label: string;
    [key: string]: string | number;
}
export interface ChartSeries {
    key: string;
    name: string;
    color?: string;
}
export interface BaseChartProps {
    data: ChartDataPoint[];
    series: ChartSeries[];
    className?: string;
    height?: number;
    showLegend?: boolean;
    showTooltip?: boolean;
    showGrid?: boolean;
    title?: string;
    subtitle?: string;
}
export interface ChartMargin {
    top: number;
    right: number;
    bottom: number;
    left: number;
}
export interface TooltipState {
    visible: boolean;
    x: number;
    y: number;
    label: string;
    entries: TooltipEntry[];
}
export interface TooltipEntry {
    name: string;
    value: number;
    color: string;
}
export interface SeriesResolved {
    key: string;
    name: string;
    color?: string | undefined;
}
