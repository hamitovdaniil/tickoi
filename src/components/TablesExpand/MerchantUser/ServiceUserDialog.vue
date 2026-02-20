<template>
	<el-dialog
		v-model="model"
		:title="isEdit ? 'Изменить услугу' : 'Добавить услугу'"
		width="520"
		@closed="reset"
	>
		<!-- В режиме создания показываем select -->
		<el-form label-position="top" :model="form" :rules="rules" ref="formRef">
			<el-form-item v-if="!isEdit" label="Услуга" prop="service_id">
				<el-select
					v-model="form.service_id"
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

			<!-- В режиме редактирования показываем только название (readonly) -->
			<el-form-item v-else label="Услуга">
				<el-input :model-value="editRow?.name" disabled />
			</el-form-item>

			<el-form-item label="Цена" prop="base_price">
				<el-input
					v-model="form.base_price"
					:formatter="moneyFormatter"
					:parser="digitsParser"
					inputmode="numeric"
					placeholder="Введите цену"
				/>
			</el-form-item>

			<el-form-item label="Длительность (мин)" prop="base_duration_minutes">
				<el-input
					v-model="form.base_duration_minutes"
					:formatter="moneyFormatter"
					:parser="digitsParser"
					inputmode="numeric"
					placeholder="Например 60"
				/>
			</el-form-item>
		</el-form>

		<template #footer>
			<el-button @click="model = false">Отмена</el-button>
			<el-button type="primary" :loading="saving" @click="submit">
				{{ isEdit ? "Сохранить" : "Добавить" }}
			</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { servicesUsersApi } from "@/api/servicesUser.api";

const props = defineProps<{
	modelValue: boolean;
	userId: number;
	services: any[]; // общий каталог услуг
	userServices: any[]; // услуги текущего юзера
	editRow: any | null; // строка для редактирования (если есть)
}>();

const emit = defineEmits(["update:modelValue", "saved"]);

const model = computed({
	get: () => props.modelValue,
	set: (v) => emit("update:modelValue", v),
});

const isEdit = computed(() => !!props.editRow);

const saving = ref(false);
const formRef = ref();

const form = ref<{
	service_id: number | null;
	base_price: string; // храним как string чтобы formatter/parser работали нормально
	base_duration_minutes: string; // тоже string
}>({
	service_id: null,
	base_price: "",
	base_duration_minutes: "",
});

const rules = {
	service_id: [{ required: true, message: "Выберите услугу", trigger: "change" }],
	base_price: [{ required: true, message: "Обязательное поле", trigger: "blur" }],
	base_duration_minutes: [{ required: true, message: "Обязательное поле", trigger: "blur" }],
};

// твои formatter/parser
const moneyFormatter = (value: string) => `${value ?? ""}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const digitsParser = (value: string) => `${value ?? ""}`.replace(/[^\d]/g, "");

// услуги которых нет у юзера (для добавления)
const serviceNotInUser = computed(() => {
	// предполагаю что в userServices лежит service_id или id сервиса.
	// У тебя ранее было userItem.id === item.id, значит userServices содержит сервисы.
	// Оставляю как было (по id сервиса):
	return props.services.filter((s: any) => !props.userServices.find((u: any) => u.id === s.id));
});

/**
 * 1) Если editRow -> заполнить форму значениями связи
 * 2) Если create -> чистим форму
 */
watch(
	() => props.editRow,
	(val) => {
		if (val) {
			form.value.service_id = val.service_id ?? null; // если у тебя в row нет service_id — не критично
			form.value.base_price = String(val.base_price ?? "");
			form.value.base_duration_minutes = String(val.base_duration_minutes ?? "");
		} else {
			reset();
		}
	},
	{ immediate: true },
);

/**
 * ✅ КЛЮЧЕВОЕ: автозаполнение при выборе услуги (create mode)
 * Берём выбранную услугу из props.services и ставим её base_* в инпуты
 */
watch(
	() => form.value.service_id,
	(serviceId) => {
		if (!serviceId || isEdit.value) return;

		const svc = props.services.find((x: any) => x.id === serviceId);
		if (!svc) return;

		form.value.base_price = String(svc.base_price ?? "");
		form.value.base_duration_minutes = String(svc.base_duration_minutes ?? "");
	},
);

function reset() {
	form.value = {
		service_id: null,
		base_price: "",
		base_duration_minutes: "",
	};
}

async function submit() {
	// validate
	if (formRef.value) {
		const ok = await formRef.value.validate().catch(() => false);
		if (!ok) return;
	}

	saving.value = true;

	try {
		const next = editMode.value
			? userServices.value.map((x: any) =>
					x.id === selectedService.value.id ? selectedService.value : x,
				)
			: [...userServices.value, selectedService.value];

		await servicesUsersApi.create({
			user_id: props.row.id,
			services: next,
		});

		await fetchUserServices();
		emit("saved");
		model.value = false;
	} finally {
		saving.value = false;
	}
}
</script>
