<template>
	<el-table
		:data="employees || []"
		@cell-click="handleCellClick"
		class="schuduleTable"
		:height="'calc(100vh - 40px - 40px - 35px - 42px)'"
		style="width: 100%"
		size="small"
		table-layout="fixed"
		row-key="key"
	>
		<!-- FIXED LEFT COLUMN -->
		<el-table-column fixed prop="name" label="Сотрудник" width="180" />

		<!-- DYNAMIC DATE COLUMNS -->
		<el-table-column
			v-for="(date, index) in dates"
			:resizable="false"
			:key="date.key"
			:label="date.label"
			:class-name="getColumnClassName(date)"
			width="40"
		>
			<template #header>
				<span v-html="date.label"></span>
			</template>
			<template #default="{ row }">
				<Transition name="scale">
					<div class="tile" :class="getTileClasses(row, date.key)">
						<div class="tile__wrapper">
							<span v-if="row.schedule[date.key]?.type === 1">
								{{ row.schedule[date.key].name ?? "" }}
							</span>
							<span class="icon" v-if="getIcon(row.schedule[date.key]?.type)">
								<component :is="getIcon(row.schedule[date.key]?.type)" />
							</span>
							<span class="icon" v-if="isEmpty(row, date.key)">
								<el-icon size="15"><CirclePlusFilled /></el-icon>
							</span>
						</div>
					</div>
				</Transition>
				<div
					class="tile"
					:class="getTileClasses(row, date.key)"
					v-if="!row.schedule[date.key]"
				>
					<div class="tile__wrapper">
						<el-icon size="15"><CirclePlusFilled /></el-icon>
					</div>
				</div>
			</template>
		</el-table-column>
	</el-table>
</template>

<script setup lang="ts">
import { ref, markRaw, watch, computed } from "vue";
import { CirclePlusFilled } from "@element-plus/icons-vue";
import IconSick from "@/components/TimeTable/Add/Icons/Sick.vue";
import IconHoliday from "@/components/TimeTable/Add/Icons/Holiday.vue";
import IconDayOff from "@/components/TimeTable/Add/Icons/DayOff.vue";
import IconAbsence from "@/components/TimeTable/Add/Icons/Absence.vue";
import { useTimetableStore } from "@/stores/timetable";

const timetableStore = useTimetableStore();
const props = defineProps({
	employees: { type: Array || null, required: false },
	// isSelected: { type: Boolean, required: true },
	period: { type: Object, required: true },
});

// watch(
// 	() => props.isSelected,
// 	() => {
// 		if (!props.isSelected) {
// 			clickedSell.value = [];
// 		}
// 	},
// );

const toDay = new Date();

function getDatesForMonth() {
	const result: { key: string; label: string }[] = [];

	const { from } = props.period;
	const date = new Date(from);

	const year = date.getFullYear();
	const month = date.getMonth();
	const daysInMonth = new Date(year, month + 1, 0).getDate();

	for (let day = 1; day <= daysInMonth; day++) {
		const d = new Date(year, month, day);

		const iso = formatDate(d);

		const weekday = d.toLocaleDateString("ru-RU", { weekday: "short" }).toUpperCase();

		result.push({
			key: iso,
			label: `${weekday} <br/> ${String(day).padStart(2, "0")}`,
		});
	}

	return result;
}
function formatDate(date: Date) {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");

	return `${y}-${m}-${d}`;
}

function isSelected(rowId: number, date: string) {
	return timetableStore.selectedDates.includes(date) && rowId == timetableStore.userId;
}

function isEmpty(row: any, date: string) {
	return !row.schedule[date];
}

function isFilled(row: any, date: string) {
	return !!row.schedule[date];
}

function isDirty(row: any, date: string) {
	return clickedSell.value.includes(generateUnic(row, date));
}

function getTypeClass(type?: number) {
	switch (type) {
		case 1:
			return "tile--work";
		case 2:
			return "tile--sick";
		case 3:
			return "tile--holiday";
		case 4:
			return "tile--unpaid-dayOff";
		case 5:
			return "tile--absence";
		case 6:
			return "tile--paid-dayOff";
		default:
			return "";
	}
}

function getTileClasses(row: any, date: string) {
	const empty = isEmpty(row, date);
	const filled = isFilled(row, date);
	const selected = isSelected(row.id, date);
	const dirty = isDirty(row, date);
	const type = row.schedule[date]?.type;

	return {
		// base
		"is-empty": empty,
		"is-filled": filled,

		// data
		"is-dirty": dirty,

		// interaction
		"is-selected": selected,

		// type
		[getTypeClass(type)]: filled,
	};
}
const getIcon = (type: number) => {
	switch (type) {
		case 2:
			return markRaw(IconSick);
		case 3:
			return markRaw(IconHoliday);
		case 4:
			return markRaw(IconDayOff);
		case 5:
			return markRaw(IconAbsence);
		case 6:
			return markRaw(IconDayOff);
	}
};
const dates = computed(() => getDatesForMonth());
console.log(dates);

const emits = defineEmits(["cellClick"]);
const clickedSell = ref<string[]>([]);
const handleCellClick = (row: any, column: any, cell: HTMLTableCellElement, event: Event) => {
	const date = column.rawColumnKey;

	timetableStore.setUser(row.id);
	timetableStore.toggleDate(date);

	emits("cellClick");
};
const generateUnic = (row: any, rawColumnKey: string): string => {
	return `${row.id}-${rawColumnKey}`;
};

const getColumnClassName = (column: { key: string }) => {
	if (!column?.key) return "";

	const date = new Date(column.key);
	const day = date.getDay(); // 0 = воскресенье, 6 = суббота

	const today = new Date();

	const isToday =
		date.getFullYear() === today.getFullYear() &&
		date.getMonth() === today.getMonth() &&
		date.getDate() === today.getDate();

	return [
		isToday && "is-today",
		day === 0 && "is-sunday",
		day === 6 && "is-saturday",
		(day === 0 || day === 6) && "is-weekend",
	]
		.filter(Boolean)
		.join(" ");
};
</script>
<style lang="scss">
.scale-enter-active,
.scale-leave-active {
	transition: all 0.2s ease;
}
.scale-enter-from,
.scale-leave-to {
	opacity: 0;
	transform: scale(0);
}
.schuduleTable {
	&.el-table {
		--table-head-height: 45px;
		--table-cell-height: 55px;
		--table-head-font-size: 10px;
		--table-cell-font-size: 8px;
		.el-table {
			&__header {
				.el-table__cell {
					height: var(--table-head-height);
					font-weight: 600;
					.cell {
						line-height: 16px;
					}
					color: #222;
					&.is-today {
						color: var(--today-color);
						font-weight: 600;
						position: relative;
						&::before {
							content: "";
							position: absolute;
							top: 0;
							left: 0;
							right: 0;
							height: 2px;
							background: var(--today-color);
						}
					}
					&.is-weekend {
						color: var(--weekend-background);
						// &::before {
						// 	content: "";
						// 	position: absolute;
						// 	top: 0;
						// 	left: 0;
						// 	right: 0;
						// 	height: 2px;
						// 	background: var(--weekend-background);
						// }
					}
					// &.is-sunday {
					// 	border-right-color: var(--weekend-color);
					// }
					.cell {
						padding: 0;
						font-size: var(--table-head-font-size);
						text-align: center;
					}
				}
			}
			&__body {
				.el-table__cell {
					height: var(--table-cell-height);
					padding: 0;
					border-right: 1px solid #ebeef5;

					&.is-today {
						position: relative;
						background: rgba(236, 201, 27, 0.08); // ослабили
					}

					&.is-last-column {
						.cell {
							font-size: 1rem;
							display: flex;
							justify-content: center;
							align-items: center;
						}
					}

					.cell {
						font-size: var(--table-cell-font-size);
						text-align: center;
						font-weight: 500;
						line-height: normal;
						padding: 0;
						height: 100%;
						width: 100%;
						.tile {
							width: 100%;
							height: 100%;
							display: flex;
							padding: 2px;
							transition: 0.3s ease;
							cursor: pointer;
							&__wrapper {
								width: 100%;
								height: 100%;
								border-radius: var(--tile-border-radius);

								background: var(--tile-background, transparent);
								color: var(--tile-color, inherit);
								border: var(--tile-border, 1px solid transparent);

								transition: 0.2s ease;
								display: flex;
								align-items: center;
								justify-content: center;
							}
							&.is-selected {
								.tile__wrapper {
									outline: 2px solid var(--tile-selected-outline, #409eff);
									outline-offset: -2px;
								}
								&:hover {
									.tile__wrapper {
										filter: none;
									}
								}
							}
							&.is-dirty {
								.tile__wrapper {
									border-style: dashed !important;
								}
							}
							&.is-empty {
								--tile-background: transparent;
								--tile-border: 1px dashed transparent;
								opacity: 0.3;
								transition: 0s ease;
								.icon {
									opacity: 0;
									.el-icon {
										color: var(--tile--new-color);
									}
									svg {
										fill: var(--tile--new-color);
									}
								}
								&:hover {
									opacity: 1;
									.tile__wrapper {
										background: var(--tile-empty-hover-bg);
										border: var(--tile--new-border);
									}
									.icon {
										opacity: 1;
									}
								}
								&.is-selected {
									.icon {
										opacity: 0;
									}
								}
							}
							&--work {
								--tile-background: var(--tile--work-background);
								--tile-color: var(--tile--work-color);
								--tile-border: var(--tile--work-border);
								&:hover {
									--tile-background: var(--tile--work-hover--background);
								}
							}

							&--sick {
								--tile-background: var(--tile--sick-background);
								--tile-color: var(--tile--sick-color);
								--tile-border: var(--tile--sick-border);
								&:hover {
									--tile-background: var(--tile--sick-hover--background);
								}
							}
							&--holiday {
								--tile-background: var(--tile--holiday-background);
								--tile-color: var(--tile--holiday-color);
								--tile-border: var(--tile--holiday-border);
								&:hover {
									--tile-background: var(--tile--holiday-hover--background);
								}
							}
							&--unpaid-dayOff {
								--tile-background: var(--tile--unpaid-dayOff-background);
								--tile-color: var(--tile--unpaid-dayOff-color);
								--tile-border: var(--tile--unpaid-dayOff-border);
								&:hover {
									--tile-background: var(--tile--unpaid-dayOff-hover--background);
								}
							}
							&--absence {
								--tile-background: var(--tile--absence-background);
								--tile-color: var(--tile--absence-color);
								--tile-border: var(--tile--absence-border);
								&:hover {
									--tile-background: var(--tile--absence-hover--background);
								}
							}
							&--paid-dayOff {
								--tile-background: var(--tile--paid-dayOff-background);
								--tile-color: var(--tile--paid-dayOff-color);
								--tile-border: var(--tile--paid-dayOff-border);
								&:hover {
									--tile-background: var(--tile--paid-dayOff-hover--background);
								}
							}

							.icon {
								display: flex;
								justify-content: center;
								align-items: center;
								width: 100%;
								height: 100%;
								svg {
									width: 20px;
									height: 20px;
								}
							}
						}
					}
				}
			}
		}
	}
}
</style>
