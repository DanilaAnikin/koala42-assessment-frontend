export interface DataItem {
    data: Record<string, string>;
    children: Partial<Record<string, { records: DataItem[] }>>;
}

export interface HierarchyTableProps {
    items: DataItem[];
    onDelete: (id: string) => void;
}

export interface HierarchyRowProps {
  item: DataItem;
  onDelete: (id: string) => void;
}