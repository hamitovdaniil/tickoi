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

export function formatDate(dateString: string) {
	const date = new Date(dateString);
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = String(date.getFullYear()).slice(-2); // последние 2 цифры года
	return `${day}.${month}.${year}`;
}
export function formatDateTimeByString(dateString: string) {
	const date = new Date(dateString);
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = String(date.getFullYear()).slice(-2); // последние 2 цифры года
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	return `${day}.${month}.${year} ${hours}:${minutes}`;
}

export function formatTime(time: string) {
	if (!time) return "";
	return time.split(":").slice(0, 2).join(":");
}

export function formatDateTime(ms: number) {
	const date = new Date(ms);
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = String(date.getFullYear()).slice(-2);
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	return `${day}.${month}.${year} ${hours}:${minutes}`;
}
export function getRelativeTime(date: string | Date): string {
	const now = new Date();
	const past = new Date(date);
	const diffMs = now.getTime() - past.getTime();
	const diffSec = Math.floor(diffMs / 1000);
	const diffMin = Math.floor(diffSec / 60);
	const diffHour = Math.floor(diffMin / 60);
	const diffDay = Math.floor(diffHour / 24);

	if (diffSec < 60) return "только что";
	if (diffMin < 60) return `${diffMin} ${plural(diffMin, "минута", "минуты", "минут")} назад`;
	if (diffHour < 24) {
		const mins = diffMin % 60;
		if (mins === 0) return `${diffHour} ${plural(diffHour, "час", "часа", "часов")} назад`;
		return `${diffHour} ${plural(diffHour, "час", "часа", "часов")} ${mins} ${plural(mins, "минута", "минуты", "минут")} назад`;
	}
	if (diffDay === 1) return "вчера";
	if (diffDay < 7) return `${diffDay} ${plural(diffDay, "день", "дня", "дней")} назад`;
	return past.toLocaleDateString();
}

// вспомогательная функция для правильных окончаний
function plural(n: number, one: string, few: string, many: string): string {
	const mod10 = n % 10;
	const mod100 = n % 100;
	if (mod10 === 1 && mod100 !== 11) return one;
	if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
	return many;
}

export function formatYMD(date: Date) {
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = String(date.getFullYear());
	return `${year}-${month}-${day}`;
}
