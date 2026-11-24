import { ChartSeries, ChartMargin } from './common/chart.type';
export declare const CHART_DEFAULT_COLORS: string[];
export declare const CHART_DEFAULT_MARGIN: ChartMargin;
export declare function resolveSeriesColor(series: ChartSeries, index: number): string;
export declare function resolveSeriesColors(series: ChartSeries[]): ChartSeries[];
export declare function formatAxisValue(value: number): string;
export declare function getChartClass(...parts: (string | undefined)[]): string;
/**
 * Calcula los ticks del eje Y dado un rango de valores y una cantidad deseada de ticks.
 */
export declare function computeYTicks(min: number, max: number, tickCount?: number): number[];
/**
 * Calcula el maximo y el minimo que debe tener el eje Y
 */
export declare function computeYDomain(data: {
    [key: string]: string | number;
}[], keys: string[], paddingFactor?: number): [number, number];
