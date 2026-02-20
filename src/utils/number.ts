import type { TableColumnCtx } from "element-plus";

export function formatNumber(row?: any, column?: TableColumnCtx, cellValue?: any, index?: number) {
	const num = Number(cellValue);

	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
}

export function formatMinutesToHours(
	row?: any,
	column?: TableColumnCtx,
	cellValue?: any,
	index?: number,
) {
	const num = Number(cellValue);

	const hours = Math.floor(num / 60);
	const minutes = num % 60;

	return `${hours}ч ${minutes}м`;
}
