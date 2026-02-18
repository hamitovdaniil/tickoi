import type { TableColumnCtx } from "element-plus";

export function defaultDate(row: any, column: TableColumnCtx, cellValue: any, index: number) {
	const date = new Date(cellValue);
	return new Date(date).toLocaleDateString("ru-RU", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

export function defaultDateTime(row: any, column: TableColumnCtx, cellValue: any, index: number) {
	const date = new Date(cellValue);
	return new Date(date).toLocaleDateString("ru-RU", {
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
	});
}
