// types/table.ts
export type FilterOp = "like" | "eq" | "in" | "between";

export type FilterValue = {
	op: FilterOp;
	value: any;
};

export type TableParams = {
	page: number;
	limit: number;
	sortField: string | null;
	sortAs: "ASC" | "DESC" | null;
	filters: Record<string, FilterValue>;
};

export type TableColumn<T = any> = {
	prop: string;
	label: string;
	sortable?: boolean;
	width?: string | number;
	searchable?: boolean;
	formatter?: (row: T) => string | null;
};
