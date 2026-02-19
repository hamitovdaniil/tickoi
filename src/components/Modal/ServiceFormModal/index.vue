<template>
	<BaseModal
		v-model="visible"
		:title="isEdit ? 'Редактировать' : 'Создать'"
		:loading="loading"
		:width="width"
		@submit="handleSubmit"
	>
		<el-form
			label-position="top"
			:model="form"
			:rules="rules"
			ref="formRef"
			@submit.prevent="handleSubmit"
		>
			<el-form-item label="Название" prop="name">
				<el-input v-model="form.name" />
			</el-form-item>
			<el-form-item label="Цена" prop="base_price">
				<el-input
					:formatter="(value: string) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')"
					:parser="(value: string) => value.replace(/[^\d]/g, '')"
					v-model="form.base_price"
				/>
			</el-form-item>
			<el-form-item label="Длительность (мин)" prop="base_duration_minutes">
				<el-input
					:formatter="(value: string) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')"
					:parser="(value: string) => value.replace(/[^\d]/g, '')"
					v-model="form.base_duration_minutes"
				/>
			</el-form-item>
		</el-form>
	</BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import BaseModal from "@/components/Modal/BaseCrud.vue";
import { usersApi } from "@/api/users.api";
import { merchantsApi } from "@/api/merchants.api";
import { ElNotification, type FormInstance, type FormItemContext } from "element-plus";
import { servicesApi } from "@/api/services.api";

const props = defineProps<{
	modelValue: boolean;
	row?: any | null;
	width?: string | number;
}>();

const emit = defineEmits(["update:modelValue", "success"]);

const visible = computed({
	get: () => props.modelValue,
	set: (v) => emit("update:modelValue", v),
});

const isEdit = computed(() => !!props.row?.id);

const formRef = ref<FormInstance>();
const loading = ref(false);

const form = ref({
	name: "",
	base_price: null,
	base_duration_minutes: null,
});

const rules = {
	name: [{ required: true, message: "Обязательное поле", trigger: "blur" }],
	base_price: [{ required: true, message: "Обязательное поле", trigger: "blur" }],
	base_duration_minutes: [{ required: true, message: "Обязательное поле", trigger: "blur" }],
};

/* ========================= INIT DATA ========================= */
function resetForm() {
	form.value = {
		name: "",
		base_price: null,
		base_duration_minutes: null,
	};
}
watch(
	() => props.row,
	(val) => {
		if (val) {
			form.value = {
				name: val.name,
				base_price: val.base_price,
				base_duration_minutes: val.base_duration_minutes,
			};
		} else {
			resetForm();
		}
	},
	{ immediate: true, deep: true },
);

watch(
	() => visible.value,
	(val) => {
		if (!val) {
			resetForm();
		}
	},
);

/* ========================= SUBMIT ========================= */

async function handleSubmit() {
	if (!formRef.value) return;
	await formRef.value.validate();
	loading.value = true;
	try {
		if (isEdit.value) {
			await servicesApi.update(props.row.id, form.value);
		} else {
			await servicesApi.create(form.value);
		}

		emit("success");
		visible.value = false;
	} catch (error) {
		ElNotification({
			title: "Ошибка",
			message: "Произошла ошибка",
			type: "error",
		});
	} finally {
		loading.value = false;
		resetForm();
	}
}
</script>
