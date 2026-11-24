export type ChartTheme = {
    text: string;
    muted: string;
    border: string;
    surface: string;
    palette?: {
        primary: string;
        info: string;
        neutral: string;
        warning: string;
        success: string;
        soft: string;
        overlay: string;
    };
    fontFamily?: string;
    controlRadius?: number;
};
export type ChartSelection = {
    dataIndex: number;
    seriesIndex: number;
    name: string;
    categoryId?: string;
    seriesId?: string;
};
