import { ChartDataPoint, SeriesResolved } from '../common/chart.type';
import { BarChartLayout, BarChartOrientation, BarChartScale, BarRect } from './bar_chart.type';
/**
 * Calcula el ancho del grupo basado en orientación
 */
export declare const calculateGroupWidth: (orientation: BarChartOrientation, dataLength: number, plotWidth: number, plotHeight: number) => number;
/**
 * Construye el path con esquinas redondeadas para una barra
 */
export declare const buildRoundedBarPath: (x: number, y: number, width: number, height: number, radius: number, orientation: BarChartOrientation) => string;
/**
 * Calcula las barras agrupadas
 */
export declare const computeGroupedBars: (data: ChartDataPoint[], series: SeriesResolved[], scale: BarChartScale, orientation: BarChartOrientation, groupWidth: number) => BarRect[][];
/**
 * Calcula las barras apiladas
 */
export declare const computeStackedBars: (data: ChartDataPoint[], series: SeriesResolved[], scale: BarChartScale, orientation: BarChartOrientation, groupWidth: number) => BarRect[][];
/**
 * Obtiene el layout de barras según el tipo
 */
export declare const getBarLayout: (layout: BarChartLayout, data: ChartDataPoint[], series: SeriesResolved[], scale: BarChartScale, orientation: BarChartOrientation, groupWidth: number) => BarRect[][];
/**
 * Construye las entradas del tooltip
 */
export declare const buildTooltipEntries: (data: ChartDataPoint[], resolvedSeries: SeriesResolved[], groupIndex: number) => {
    name: string;
    value: number;
    color: string | undefined;
}[];
