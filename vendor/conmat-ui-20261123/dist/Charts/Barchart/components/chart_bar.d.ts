import { MouseEvent } from 'react';
import { SeriesResolved } from '../../common/chart_legend';
import { BarChartOrientation, BarRect } from '../bar_chart.type';
export interface ChartBarsProps {
    barGroups: BarRect[][];
    series: SeriesResolved[];
    orientation: BarChartOrientation;
    barRadius: number;
    onBarMouseEnter: (event: MouseEvent<SVGPathElement>, label: string, groupIndex: number) => void;
    onBarMouseLeave: () => void;
}
export declare const ChartBars: ({ barGroups, series, orientation, barRadius, onBarMouseEnter, onBarMouseLeave }: ChartBarsProps) => import("react/jsx-runtime").JSX.Element;
