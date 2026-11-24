import { ChartDataPoint, TooltipEntry } from '../common/chart.type';
import { SeriesResolved } from '../common/chart_legend';
import { Point } from './line_chart.type';
/**
 * Interfaz que define las funciones de escala del gráfico
 */
export interface ChartScale {
    indexToX: (index: number) => number;
    valueToY: (value: number) => number;
    yTicks: number[];
}
/**
 * Construye las entradas del tooltip para un punto específico
 */
export declare const buildTooltipEntries: (data: ChartDataPoint[], resolvedSeries: SeriesResolved[], pointIndex: number) => TooltipEntry[];
/**
 * Construye los puntos de datos para una serie (coordenadas x,y)
 */
export declare const buildSeriesPoints: (data: ChartDataPoint[], scale: ChartScale, seriesKey: string) => Point[];
/**
 * Calcula la posición del tooltip relativa al SVG
 */
export declare const getTooltipPosition: (event: React.MouseEvent<SVGCircleElement>, svgRef: React.RefObject<SVGSVGElement | null>) => {
    x: number;
    y: number;
};
