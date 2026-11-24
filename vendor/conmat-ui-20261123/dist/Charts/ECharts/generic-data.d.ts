export type ChartValue = number | null;
export type GenericChartData = {
    categories: {
        id: string;
        label: string;
    }[];
    series: {
        id: string;
        label: string;
        color: string;
        values: ChartValue[];
    }[];
};
export declare const chartDefinitions: readonly [{
    readonly id: "columns";
    readonly label: "Barras verticales";
    readonly family: "Comparación";
    readonly description: "Una serie por categoría. Cambia la serie y edita sus valores.";
}, {
    readonly id: "grouped";
    readonly label: "Barras agrupadas";
    readonly family: "Comparación";
    readonly description: "Compara varias series para una misma categoría.";
}, {
    readonly id: "stacked";
    readonly label: "Barras apiladas";
    readonly family: "Composición";
    readonly description: "Lee el aporte de cada serie al total de la categoría.";
}, {
    readonly id: "horizontal";
    readonly label: "Barras horizontales";
    readonly family: "Comparación";
    readonly description: "Compara categorías sobre un eje horizontal.";
}, {
    readonly id: "stacked-horizontal";
    readonly label: "Apiladas horizontales";
    readonly family: "Composición";
    readonly description: "Desglosa los totales horizontales por serie.";
}, {
    readonly id: "percent";
    readonly label: "Apiladas al 100 %";
    readonly family: "Composición";
    readonly description: "Porcentajes por categoría. Una categoría con total cero permanece en cero.";
}, {
    readonly id: "line";
    readonly label: "Líneas";
    readonly family: "Tendencia";
    readonly description: "Evolución mensual. Las ausencias se ven como huecos, sin unir puntos desconocidos.";
}, {
    readonly id: "area";
    readonly label: "Áreas";
    readonly family: "Tendencia";
    readonly description: "Evolución de una serie con área de referencia al cero.";
}, {
    readonly id: "stacked-area";
    readonly label: "Áreas apiladas";
    readonly family: "Tendencia";
    readonly description: "Evolución del total y contribución de cada serie.";
}, {
    readonly id: "combo";
    readonly label: "Barras y línea";
    readonly family: "Tendencia";
    readonly description: "Compara la primera serie en barras y las demás en líneas, con la misma unidad y escala.";
}, {
    readonly id: "pie";
    readonly label: "Circular";
    readonly family: "Composición";
    readonly description: "Participación de cada categoría en la serie seleccionada.";
}, {
    readonly id: "donut";
    readonly label: "Dona";
    readonly family: "Composición";
    readonly description: "Distribución de una serie con su total en el centro.";
}, {
    readonly id: "scatter";
    readonly label: "Dispersión";
    readonly family: "Relación";
    readonly description: "Relaciona las dos primeras series visibles: X frente a Y. Cada punto es un mes.";
}, {
    readonly id: "radar";
    readonly label: "Radar";
    readonly family: "Relación";
    readonly description: "Compara perfiles sobre ejes con un mismo máximo y unidad.";
}, {
    readonly id: "heatmap";
    readonly label: "Mapa de calor";
    readonly family: "Relación";
    readonly description: "Cruza categorías y series; el color representa la magnitud del valor.";
}, {
    readonly id: "gauge";
    readonly label: "Indicador de avance";
    readonly family: "Indicadores";
    readonly description: "Total de la serie frente a una meta. La escala se amplía si el resultado supera el 100 %.";
}];
export type ChartKind = (typeof chartDefinitions)[number]["id"];
export declare function isSingleSeries(kind: ChartKind): boolean;
export declare function supportsData(kind: ChartKind, dataset: GenericChartData): boolean;
export declare function normalizeGenericData(dataset: GenericChartData): GenericChartData;
