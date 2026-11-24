import { BaseInputProps } from '../input.type';
export interface SearchSelectOption<T = string> {
    label: string;
    value: T;
    description?: string;
    disabled?: boolean;
}
export interface SearchSelectLoadParams {
    query: string;
    page: number;
    pageSize: number;
}
export interface SearchSelectLoadResult<T = string> {
    options: SearchSelectOption<T>[];
    total: number;
}
export interface SearchSelectInputProps<T = string> extends Omit<BaseInputProps<T>, "readonly"> {
    options?: SearchSelectOption<T>[];
    selectedOption?: SearchSelectOption<T>;
    searchPlaceholder?: string;
    emptyText?: string;
    loadingText?: string;
    errorText?: string;
    pageSize?: number;
    debounceMs?: number;
    onSearch?: (query: string) => void;
    filterOption?: (option: SearchSelectOption<T>, query: string) => boolean;
    loadOptions?: (params: SearchSelectLoadParams) => Promise<SearchSelectLoadResult<T>>;
}
