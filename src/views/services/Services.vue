<template>
	<the-header>
		<div class="head">
			<div class="head__left">
				<h1>Services</h1>
			</div>
			<div class="head__right">
				<HeadAddBtn @handle-click="handleCreate" />
			</div>
		</div>
	</the-header>

	<el-main>
		<BaseDataTable ref="tableRef" :columns="columns" :fetcher="fetchData">
			<template #filters="{ setFilter }">
				<div class="filters">
					<el-input
						clearable
						placeholder="Поиск по названию"
						v-model="name"
						@input="(val: any) => setFilter('name', 'like', val)"
						style="max-width: 250px; width: 100%"
					/>
				</div>
			</template>

			<template #actions="{ row }">
				<Actions :row="row" @handle="handleAction" edit :moreActions="moreActions" />
			</template>
		</BaseDataTable>
	</el-main>
	<ServiceFormModal @success="reload" width="500px" v-model="modalVisible" :row="selectedRow" />
</template>
<script setup lang="ts">
import { ref } from "vue";

import BaseDataTable from "@/components/BaseDataTable/index.vue";
import TheHeader from "@/components/navigation/TheHeader.vue";
import ServiceFormModal from "@/components/Modal/ServiceFormModal/index.vue";
import Actions from "@/components/BaseDataTable/Actions.vue";
import { merchantsApi } from "@/api/merchants.api";
import HeadAddBtn from "@/components/HeadAddBtn/index.vue";

import { ElNotification } from "element-plus";
import { defaultDateTime } from "@/utils/date";
import type { TableColumn } from "@/types/table";
import { servicesApi } from "@/api/services.api";
import { formatMinutesToHours, formatNumber } from "@/utils/number";

const columns: TableColumn[] = [
	{
		prop: "name",
		label: "Название",
		sortable: true,
		showOverflowTooltip: true,
		minWidth: "150",
	},
	{
		prop: "base_price",
		label: "Цена",
		sortable: true,
		formatter: formatNumber,
		showOverflowTooltip: true,
	},
	{
		prop: "base_duration_minutes",
		label: "Длительность",
		sortable: true,
		formatter: formatMinutesToHours,
		showOverflowTooltip: true,
	},
	{
		prop: "created_at",
		label: "Дата создания",
		sortable: true,
		formatter: defaultDateTime,
		showOverflowTooltip: true,
		width: "250",
	},
	{
		prop: "updated_at",
		label: "Дата обновления",
		sortable: true,
		formatter: defaultDateTime,
		showOverflowTooltip: true,
		width: "250",
	},
];
const name = ref("");
const moreActions = [
	{
		action: "active",
		activeLabel: "Скрыть",
		inactiveLabel: "Показать",
	},
];

async function fetchData(params: any) {
	const response = await servicesApi.list(params);
	return {
		data: response.data,
		total: response.meta?.total ?? 0,
		last_page: response.meta?.last_page ?? 0,
	};
}

const modalVisible = ref(false);
const selectedRow = ref(null);

function handleEdit(row: any) {
	selectedRow.value = row;
	modalVisible.value = true;
}

function handleCreate() {
	selectedRow.value = null;
	modalVisible.value = true;
}

const handleDelete = (row: any) => perform(() => servicesApi.delete(row.id), true);
const handleActive = (row: any) => perform(() => servicesApi.activate(row.id), true);

const tableRef = ref<InstanceType<typeof BaseDataTable> | null>(null);
function reload(forceReload = false) {
	tableRef.value?.reload?.(forceReload);
}

const handleAction = (value: any) => {
	const { action, row } = value;
	switch (action) {
		case "edit":
			handleEdit(row);
			break;
		case "delete":
			handleDelete(row);
			break;
		case "active":
			handleActive(row);
			break;
	}
};

async function perform(action: () => Promise<any>, forceReload = false) {
	try {
		await action();
	} catch {
		ElNotification({
			title: "Ошибка",
			message: "Произошла ошибка",
			type: "error",
		});
	} finally {
		reload(forceReload);
	}
}
</script>
<style scoped>
.head {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
