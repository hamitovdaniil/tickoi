<template>
	<the-header>
		<div class="head">
			<div class="head__left">
				<h1>Пользователи</h1>
			</div>
			<div class="head__right">
				<el-button type="primary" @click="create"> Добавить </el-button>
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
				<el-button size="small" @click="edit(row)">Edit</el-button>
				<el-button size="small" type="danger" @click="remove(row)"> Delete </el-button>
			</template>
		</BaseDataTable>
	</el-main>
	<UserFormModal v-model="modalVisible" :user="selectedUser" @success="reload" />
</template>

<script setup lang="ts">
import BaseDataTable from "@/components/BaseDataTable/index.vue";
import TheHeader from "@/components/navigation/TheHeader.vue";
import { usersApi } from "@/api/users.api";
import { defaultDateTime } from "@/utils/date";
import { ref } from "vue";
import UserFormModal from "@/components/Modal/UserFormModal/index.vue";
const columns = [
	{
		prop: "name",
		label: "Name",
		sortable: true,
	},
	{
		prop: "email",
		label: "Email",
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

/* ========================= FETCHER ========================= */

async function fetchUsers(params: any) {
	const response = await usersApi.list(params);

	return {
		data: response.data,
		total: response.meta?.total ?? 0,
		last_page: response.meta?.last_page ?? 0,
	};
}

const modalVisible = ref(false);
const selectedUser = ref(null);

function edit(row: any) {
	selectedUser.value = row;
	modalVisible.value = true;
}

function create() {
	selectedUser.value = null;
	modalVisible.value = true;
}
const tableRef = ref(null);
function reload() {
	tableRef.value?.reload?.();
}
</script>

<style scoped>
.head {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
