import { EChartsOption } from 'echarts';
import { ChartKind, GenericChartData } from './generic-data.ts';
import { ChartTheme } from './chart.type.ts';
export type ChartSettings = {
    motion: boolean;
    labels: boolean;
    grid: boolean;
    smooth: boolean;
    zoom: boolean;
    target: number;
};
export declare const defaultChartSettings: ChartSettings;
export declare function genericOptions(dataset: GenericChartData, kind: ChartKind, settings: ChartSettings, theme: ChartTheme): EChartsOption;
