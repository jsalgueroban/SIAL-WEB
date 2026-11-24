import { SeriesResolved } from '../../common/chart_legend';
import { LineChartCurve } from '../line_chart.type';
interface ChartLinesProps {
    series: SeriesResolved[];
    buildPoints: (seriesKey: string) => Array<{
        x: number;
        y: number;
    }>;
    curve: LineChartCurve;
}
export declare const ChartLines: ({ series, buildPoints, curve }: ChartLinesProps) => import("react/jsx-runtime").JSX.Element;
export {};
