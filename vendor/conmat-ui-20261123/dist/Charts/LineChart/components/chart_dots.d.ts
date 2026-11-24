import { ChartDataPoint } from '../../common/chart.type';
import { SeriesResolved } from '../../common/chart_legend';
interface ChartDotsProps {
    isVisible: boolean;
    series: SeriesResolved[];
    dataPoints: ChartDataPoint[];
    buildPoints: (seriesKey: string) => Array<{
        x: number;
        y: number;
    }>;
    onDotMouseEnter: (event: React.MouseEvent<SVGCircleElement>, index: number) => void;
    onDotMouseLeave: () => void;
}
export declare const ChartDots: ({ isVisible, series, dataPoints, buildPoints, onDotMouseEnter, onDotMouseLeave }: ChartDotsProps) => import("react/jsx-runtime").JSX.Element | null;
export {};
