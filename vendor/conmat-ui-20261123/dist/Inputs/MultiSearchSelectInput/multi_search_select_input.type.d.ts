import { BaseInputProps } from '../input.type';
import { SearchSelectLoadParams, SearchSelectLoadResult, SearchSelectOption } from '../SearchSelectInput/search_select_input.type';
export interface MultiSearchSelectInputProps<T = string> extends Omit<BaseInputProps<T[]>, "readonly"> {
    options?: SearchSelectOption<T>[];
    /** Mantiene los metadatos de valores remotos que no estén en la página actual. */
    selectedOptions?: SearchSelectOption<T>[];
    /** grid: place the control and full-width selection pool in the parent's CSS grid. */
    selectionLayout?: "stacked" | "grid";
    searchPlaceholder?: string;
    emptyText?: string;
    emptySelectionText?: string;
    loadingText?: string;
    errorText?: string;
    selectedLabel?: string;
    pageSize?: number;
    debounceMs?: number;
    maxSelections?: number;
    onSearch?: (query: string) => void;
    filterOption?: (option: SearchSelectOption<T>, query: string) => boolean;
    loadOptions?: (params: SearchSelectLoadParams) => Promise<SearchSelectLoadResult<T>>;
}
