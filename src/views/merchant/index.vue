<template>
	<the-header>
		<div class="head">
			<div class="head__left">
				<h1>Merchant</h1>
			</div>
			<div class="head__right">
				<el-button type="primary" @click="handleCreate"> Добавить </el-button>
			</div>
		</div>
	</the-header>

	<el-main>
		<BaseDataTable ref="tableRef" :columns="columns" :fetcher="fetchUsers">
			<!-- FILTERS -->
			<!-- <template #filters="{ setFilter }">
					<div class="filters">
						<el-input
							placeholder="Search name"
							clearable
							v-model="name"
							@input="(val) => setFilter('name', 'like', val)"
							style="width: 250px"
						/>
					</div>
				</template> -->

			<!-- ACTIONS -->
			<template #actions="{ row }">
				<Actions
					:row="row"
					@handle="handleAction"
					remove="merchant_name"
					edit
					:moreActions="moreActions"
				/>
			</template>
		</BaseDataTable>
	</el-main>
	<MerchantFormModal @success="reload" width="500px" v-model="modalVisible" :row="selectedRow" />
</template>
<script setup lang="ts">
import BaseDataTable from "@/components/BaseDataTable/index.vue";
import TheHeader from "@/components/navigation/TheHeader.vue";
import { usersApi } from "@/api/users.api";
import { defaultDateTime } from "@/utils/date";
import { ref } from "vue";
import MerchantFormModal from "@/components/Modal/MerchantFormModal/index.vue";
import { merchantsApi } from "@/api/merchants.api";
import Actions from "@/components/BaseDataTable/Actions.vue";
import { ElNotification } from "element-plus";
const columns = [
	{
		prop: "merchant_name",
		label: "Name",
		sortable: true,
	},
	{
		prop: "created_at",
		label: "Created",
		sortable: true,
		formatter: defaultDateTime,
	},
	{
		prop: "updated_at",
		label: "Updated",
		sortable: true,
		formatter: defaultDateTime,
	},
];

const moreActions = [
	{
		action: "active",
		activeLabel: "Deactivate",
		inactiveLabel: "Activate",
	},
];

/* ========================= FETCHER ========================= */

async function fetchUsers(params: any) {
	const response = await merchantsApi.list(params);

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

const handleActive = async (row: any) => {
	try {
		await merchantsApi.activate(row.id);
	} catch (error) {
		ElNotification({
			title: "Ошибка",
			message: "Произошла ошибка",
			type: "error",
		});
	} finally {
		reload();
	}
};

const handleDelete = async (row: any) => {
	try {
		await merchantsApi.delete(row.id);
	} catch (error) {
		ElNotification({
			title: "Ошибка",
			message: "Произошла ошибка",
			type: "error",
		});
	} finally {
		reload();
	}
};
const tableRef = ref(null);
function reload() {
	tableRef.value?.reload?.();
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
</script>
<style scoped>
.head {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
