import { TreeListProps } from './tree_list.type';
export declare function TreeList<T = string>({ checkedValues, className, defaultExpandedValues, emptyState, expandedValues, getNodeKey, nodes, onChecked, onExpandedChange, onSelect, selectable, selectedValue, variant: variantProp, ...rootProps }: TreeListProps<T>): React.ReactNode;
