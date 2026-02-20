<template>
	<the-header>
		<div class="head">
			<div class="head__left">
				<h1>Сотрудники</h1>
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
			<template #expand="{ row, expanded }">
				<MerchantUserExpand :row="row" :expanded="expanded" />
			</template>
			<template #actions="{ row }">
				<Actions :row="row" @handle="handleAction" edit :moreActions="moreActions" />
			</template>
		</BaseDataTable>
	</el-main>
	<MerchantUserFormModal
		v-model="modalVisible"
		width="500px"
		:row="selectedRow"
		@success="reload"
	/>
</template>

<script setup lang="ts">
import BaseDataTable from "@/components/BaseDataTable/index.vue";
import TheHeader from "@/components/navigation/TheHeader.vue";
import { usersApi } from "@/api/users.api";
import { defaultDateTime } from "@/utils/date";
import { computed, ref } from "vue";
import MerchantUserFormModal from "@/components/Modal/MerchantUserFormModal/index.vue";
import { ElNotification } from "element-plus";
import Actions from "@/components/BaseDataTable/Actions.vue";
import { merchantUsersApi } from "@/api/merchantUsers.api";
import { useAuthStore } from "@/stores/auth";
import HeadAddBtn from "@/components/HeadAddBtn/index.vue";
import MerchantUserExpand from "@/components/TablesExpand/MerchantUser/index.vue";
const authStore = useAuthStore();
const user = computed(() => authStore.user);
const columns = [
	{
		prop: "name",
		label: "Имя",
		sortable: true,
	},
	{
		prop: "email",
		label: "Email",
		sortable: true,
	},
	// {
	// 	prop: "created_at",
	// 	label: "Created",
	// 	sortable: true,
	// 	formatter: defaultDateTime,
	// },
	// {
	// 	prop: "updated_at",
	// 	label: "Updated",
	// 	sortable: true,
	// 	formatter: defaultDateTime,
	// },
];
const name = ref("");
const moreActions = [
	{
		action: "active",
		activeLabel: "Заблокировать",
		inactiveLabel: "Разблокировать",
	},
];

async function fetchData(params: any) {
	params.filters.merchant_id = user.value?.merchant_id;
	const response = await merchantUsersApi.list(params);
	return {
		data: response.data,
		total: response.meta?.total ?? 0,
		last_page: response.meta?.last_page ?? 0,
	};
}

const modalVisible = ref(false);
const selectedRow = ref(null);

function handleEdit(row: any) {
	console.log(row);

	selectedRow.value = row;
	modalVisible.value = true;
}

function handleCreate() {
	selectedRow.value = null;
	modalVisible.value = true;
}

const handleDelete = (row: any) => perform(() => usersApi.delete(row.id), true);
const handleActive = (row: any) => perform(() => usersApi.activate(row.id), true);

const tableRef = ref<InstanceType<typeof BaseDataTable> | null>(null);
function reload(forceReload = false) {
	tableRef.value?.reload?.(forceReload);
}

const handleAction = (value: any) => {
	const { action, row } = value;
	console.log(value);

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
