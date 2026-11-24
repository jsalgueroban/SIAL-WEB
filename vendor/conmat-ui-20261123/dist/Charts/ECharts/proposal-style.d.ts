import { ChartTheme } from './chart.type.ts';
export declare const proposalChartStyle: {
    axisFontSize: number;
    labelFontSize: number;
    legendFontSize: number;
    lineWidth: number;
    pointSize: number;
    barRadius: number;
    horizontalBarSize: number;
    entryDuration: number;
    gridDash: number[];
};
export declare function proposalPalette(theme: ChartTheme): {
    primary: string;
    info: string;
    neutral: string;
    warning: string;
    success: string;
    soft: string;
    overlay: string;
};
export declare function proposalCategoryColors(theme: ChartTheme): string[];
export declare function proposalSeriesColor(color: string, theme: ChartTheme, index: number): string;
export declare function proposalAxisTooltip(params: unknown, colors: Map<string, string>): string;
