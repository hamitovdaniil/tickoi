<template>
	<div class="myExpand">
		<el-tabs v-model="activeName" tab-position="left">
			<el-tab-pane label="Услуги" name="services">
				<el-table
					:data="userServices"
					:loading="loading"
					style="width: 100%"
					max-height="250"
				>
					<el-table-column prop="name" label="Название" />
					<el-table-column prop="price" :formatter="formatNumber" label="Цена">
						<template #default="{ row }">
							{{ formatNumber(null, null, row.pivot.price) }}
						</template>
						<!-- {{ formatNumber(row.pivot.price) }} -->
					</el-table-column>
					<el-table-column
						prop="duration_minutes"
						:formatter="formatMinutesToHours"
						label="Длительность"
					>
						<template #default="{ row }">
							{{ formatMinutesToHours(null, null, row.pivot.duration_minutes) }}
						</template>
					</el-table-column>

					<el-table-column align="right" fixed="right" min-width="140">
						<template #header>
							<el-button type="primary" size="small" @click="openAdd">
								Добавить услугу
							</el-button>
						</template>

						<template #default="{ row }">
							<el-button
								link
								type="primary"
								size="small"
								@click.prevent="openEdit(row)"
							>
								<el-icon><Edit /></el-icon>
							</el-button>

							<el-button
								link
								type="danger"
								size="small"
								@click.prevent="deleteRow(row)"
							>
								<el-icon><Delete /></el-icon>
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
		</el-tabs>
	</div>

	<Teleport to="body">
		<el-dialog
			v-model="dialogVisible"
			:title="editMode ? 'Изменить услугу' : 'Добавить услугу'"
			width="520"
			@closed="resetDialog"
		>
			<el-form label-position="top" :model="form">
				<!-- В режиме создания показываем выбор услуги -->
				<el-form-item v-if="!editMode" label="Услуга">
					<el-select
						v-model="form.id"
						placeholder="Выберите услугу"
						style="width: 100%"
						filterable
					>
						<el-option
							v-for="item in serviceNotInUser"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						/>
					</el-select>
				</el-form-item>

				<!-- В режиме редактирования просто название -->
				<el-form-item v-else label="Услуга">
					<el-input :model-value="form.name" disabled />
				</el-form-item>

				<el-form-item label="Цена">
					<el-input
						v-model="form.price"
						:formatter="moneyFormatter"
						:parser="digitsParser"
						inputmode="numeric"
					/>
				</el-form-item>

				<el-form-item label="Длительность (мин)">
					<el-input
						v-model="form.duration_minutes"
						:formatter="moneyFormatter"
						:parser="digitsParser"
						inputmode="numeric"
					/>
				</el-form-item>
			</el-form>

			<template #footer>
				<el-button @click="dialogVisible = false">Отмена</el-button>
				<el-button type="primary" :loading="saving" @click="onSubmit">
					{{ editMode ? "Сохранить" : "Добавить" }}
				</el-button>
			</template>
		</el-dialog>
	</Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Delete, Edit } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

import { servicesApi } from "@/api/services.api";
import { servicesUsersApi } from "@/api/servicesUser.api";
import { formatMinutesToHours, formatNumber } from "@/utils/number";

const props = defineProps<{ row: any; expanded: any }>();

const activeName = ref("services");
const services = ref<any[]>([]);
const userServices = ref<any[]>([]);
const loading = ref(false);

const dialogVisible = ref(false);
const editMode = ref(false);
const saving = ref(false);

const form = ref<any>({
	id: null,
	name: "",
	price: "",
	duration_minutes: "",
});

/* ---------------- FETCH ---------------- */

async function fetchServices() {
	const response = await servicesApi.list({ limit: 100, page: 1 });
	services.value = response.data;
}

async function fetchUserServices() {
	const response = await servicesUsersApi.list({
		userId: props.row.id,
	});
	userServices.value = response.data;
}

async function getServices() {
	loading.value = true;
	await Promise.all([fetchServices(), fetchUserServices()]);
	loading.value = false;
}

if (props.row && props.expanded) {
	getServices();
}

/* ---------------- COMPUTED ---------------- */

const serviceNotInUser = computed(() => {
	return services.value.filter(
		(item: any) => !userServices.value.find((u: any) => u.id === item.id),
	);
});

/* ---------------- FORMATTERS ---------------- */

const moneyFormatter = (value: string) => `${value ?? ""}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const digitsParser = (value: string) => `${value ?? ""}`.replace(/[^\d]/g, "");

/* ---------------- WATCH (автоподстановка) ---------------- */

watch(
	() => form.value.id,
	(id) => {
		if (!id || editMode.value) return;

		const service = services.value.find((s: any) => s.id === id);
		if (!service) return;

		form.value.name = service.name;
		form.value.price = String(service.base_price);
		form.value.duration_minutes = String(service.base_duration_minutes);
	},
);

/* ---------------- UTILS ---------------- */

function buildPayload(list: any[]) {
	return list.map((item) => ({
		id: item.id,
		price: Number(digitsParser(item.price)),
		duration_minutes: Number(digitsParser(item.duration_minutes)),
	}));
}

/* ---------------- CRUD ---------------- */

function openAdd() {
	editMode.value = false;
	dialogVisible.value = true;
}

function openEdit(row: any) {
	editMode.value = true;

	form.value = {
		id: row.id,
		name: row.name,
		price: String(Math.round(row.pivot.price)), // ⚠ pivot
		duration_minutes: String(row.pivot.duration_minutes), // ⚠ pivot
	};

	dialogVisible.value = true;
}

async function onSubmit() {
	saving.value = true;

	try {
		const prepared = {
			id: form.value.id,
			name: form.value.name,
			price: form.value.price,
			duration_minutes: form.value.duration_minutes,
		};

		const next = editMode.value
			? userServices.value.map((x: any) => (x.id === prepared.id ? prepared : x))
			: [...userServices.value, prepared];

		await servicesUsersApi.create({
			user_id: props.row.id,
			services: buildPayload(next), // ⚠ ВАЖНО
		});

		await fetchUserServices();
		dialogVisible.value = false;

		ElMessage.success("Сохранено");
	} finally {
		saving.value = false;
	}
}

async function deleteRow(row: any) {
	await ElMessageBox.confirm(`Удалить услугу "${row.name}" у сотрудника?`, "Подтверждение", {
		type: "warning",
		confirmButtonText: "Удалить",
		cancelButtonText: "Отмена",
	});

	const next = userServices.value.filter((item: any) => item.id !== row.id);

	await servicesUsersApi.create({
		user_id: props.row.id,
		services: buildPayload(next), // ⚠ ВАЖНО
	});

	await fetchUserServices();
	ElMessage.success("Удалено");
}

function resetDialog() {
	form.value = {
		id: null,
		name: "",
		price: "",
		duration_minutes: "",
	};
	editMode.value = false;
}
</script>
