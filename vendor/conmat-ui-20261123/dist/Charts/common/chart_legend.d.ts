import { SeriesResolved } from './chart.type';
export type { SeriesResolved };
export interface ChartLegendProps {
    series: SeriesResolved[];
    isVisible: boolean;
}
export declare const ChartLegend: ({ series, isVisible }: ChartLegendProps) => import("react/jsx-runtime").JSX.Element | null;
