/**
 * Componente encargado de la renderización del eje Y de la grafica.
 */
interface ChartYAxisProps {
    isVisible: boolean;
    yTicks: number[];
    valueToY: (value: number) => number;
    plotHeight: number;
}
export declare const ChartYAxis: ({ isVisible, yTicks, valueToY, plotHeight }: ChartYAxisProps) => import("react/jsx-runtime").JSX.Element | null;
export {};
