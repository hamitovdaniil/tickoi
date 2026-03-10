<template>
	<el-table
		:data="employees"
		@cell-click="handleCellClick"
		class="schuduleTable"
		border
		:height="'calc(100vh - 40px - 40px - 35px)'"
		style="width: 100%"
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
			width="40"
		>
			<template #header>
				<span v-html="date.label"></span>
			</template>
			<template #default="{ row }">
				<div
					class="tile"
					:class="[
						getClass(row.schedule[date.key].type),
						{ 'tile--added-new': clickedSell.includes(row.id) },
					]"
					v-if="row.schedule[date.key]"
				>
					<div class="tile__wrapper">
						<span v-if="row.schedule[date.key].type === 1">
							{{ row.schedule[date.key].name ?? "" }}
						</span>
						<span class="icon">
							<component :is="getIcon(row.schedule[date.key].type)" />
						</span>
					</div>
				</div>
				<div
					class="tile tile--new"
					:class="[
						{ 'tile--added-new': clickedSell.includes(generateUnic(row, date.key)) },
					]"
					v-else
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
import { ref, markRaw, watch } from "vue";
import { CirclePlusFilled } from "@element-plus/icons-vue";
import IconSick from "@/components/TimeTable/Add/Icons/Sick.vue";
import IconHoliday from "@/components/TimeTable/Add/Icons/Holiday.vue";
import IconDayOff from "@/components/TimeTable/Add/Icons/DayOff.vue";
import IconAbsence from "@/components/TimeTable/Add/Icons/Absence.vue";
const props = defineProps({
	employees: { type: Array, required: true },
	isSelected: { type: Boolean, required: true },
});
watch(
	() => props.isSelected,
	() => {
		if (!props.isSelected) {
			clickedSell.value = [];
		}
	},
);
function getDatesForTwoMonths() {
	const result: { key: string; label: string }[] = [];

	const now = new Date();

	const months = [
		new Date(now.getFullYear(), now.getMonth(), 1),
		new Date(now.getFullYear(), now.getMonth() + 1, 1),
	];

	months.forEach((monthDate) => {
		const year = monthDate.getFullYear();
		const month = monthDate.getMonth();
		const daysInMonth = new Date(year, month + 1, 0).getDate();

		for (let day = 1; day <= daysInMonth; day++) {
			const date = new Date(year, month, day);

			const iso = formatDate(date);

			const weekday = date.toLocaleDateString("ru-RU", { weekday: "short" }).toUpperCase();

			result.push({
				key: iso,
				label: `${weekday} <br/> ${String(day).padStart(2, "0")}`,
			});
		}
	});

	return result;
}
function formatDate(date: Date) {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");

	return `${y}-${m}-${d}`;
}
const getClass = (type: number) => {
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
		case 7:
			// new for added
			return "tile--added-new";
	}
};
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
const dates = ref(getDatesForTwoMonths());
const emits = defineEmits(["cellClick"]);
const clickedSell = ref<string[]>([]);
const handleCellClick = (row: any, column: any, cell: HTMLTableCellElement, event: Event) => {
	emits("cellClick", { row, column, cell });
	clickedSell.value.push(generateUnic(row, column.rawColumnKey));
};
const generateUnic = (row: any, rawColumnKey: string): string => {
	return `${row.id}-${rawColumnKey}`;
};
</script>
<style lang="scss">
.schuduleTable {
	&.el-table {
		--table-head-height: 55px;
		--table-cell-height: 55px;
		--table-head-font-size: 10px;
		--table-cell-font-size: 8px;
		.el-table {
			&__header {
				.el-table__cell {
					height: var(--table-head-height);

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
						font-weight: 600;
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
							&--new {
								--tile-background: var(--tile--new-background);
								--tile-color: var(--tile--new-color);
								--tile-border: var(--tile--new-border);
								opacity: 0;
								transition: 0.3s ease;
								height: 100%;
								&:hover {
									opacity: 1;
								}
								.tile__wrapper {
									display: flex;
									justify-content: center;
									align-items: center;
								}
							}
							&--added-new {
								--tile-background: var(--tile--new-background);
								--tile-color: var(--tile--new-color);
								--tile-border: var(--tile--new-border);
								opacity: 1;
								transition: 0.3s ease;
								height: 100%;

								.tile__wrapper {
									display: flex;
									justify-content: center;
									align-items: center;
								}
							}
							&__wrapper {
								height: 100%;
								width: 100%;
								background: var(--tile-background);
								padding: 4px;
								color: var(--tile-color);
								border: var(--tile-border);
								border-radius: var(--tile-border-radius);
								user-select: none;
								overflow: hidden;
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
