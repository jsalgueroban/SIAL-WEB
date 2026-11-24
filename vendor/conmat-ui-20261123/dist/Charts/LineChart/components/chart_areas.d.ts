import { SeriesResolved } from '../../common/chart_legend';
import { LineChartCurve } from '../line_chart.type';
interface ChartAreasProps {
    isVisible: boolean;
    series: SeriesResolved[];
    buildPoints: (seriesKey: string) => Array<{
        x: number;
        y: number;
    }>;
    curve: LineChartCurve;
    plotHeight: number;
}
export declare const ChartAreas: ({ isVisible, series, buildPoints, curve, plotHeight }: ChartAreasProps) => import("react/jsx-runtime").JSX.Element | null;
export {};
