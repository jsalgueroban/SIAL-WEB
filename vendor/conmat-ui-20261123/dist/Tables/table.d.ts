import { TableProps } from './table.type';
export declare function Table<T>({ columns, data, actions, actionsHeader, actionsWidth, actionsClassName, className, emptyState, loading, loadingState, striped, bordered, minWidth, rowKey, rowClassName, rowProps, sort, onSortChange, tableClassName, tableProps, ...wrapperProps }: TableProps<T>): React.ReactNode;
