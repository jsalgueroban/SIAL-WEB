import { ChartSelection } from './chart.type';
import { EChartsCoreOption } from 'echarts/core';
export default function EChartCanvas({ option, label, height, onSelect, replayKey, }: {
    option: EChartsCoreOption;
    label: string;
    height?: number;
    replayKey?: number;
    onSelect?: (selection: ChartSelection) => void;
}): import("react/jsx-runtime").JSX.Element;
