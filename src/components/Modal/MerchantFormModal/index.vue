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
			<el-form-item label="Название" prop="merchant_name">
				<el-input v-model="form.merchant_name" />
			</el-form-item>
		</el-form>
	</BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import BaseModal from "@/components/Modal/BaseCrud.vue";
import { usersApi } from "@/api/users.api";
import { merchantsApi } from "@/api/merchants.api";
import type { FormInstance, FormItemContext } from "element-plus";

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
	merchant_name: "",
});

const rules = {
	merchant_name: [{ required: true, message: "Обязательное поле", trigger: "blur" }],
};

/* ========================= INIT DATA ========================= */
function resetForm() {
	form.value = {
		merchant_name: "",
	};
}
watch(
	() => props.row,
	(val) => {
		if (val) {
			form.value = {
				merchant_name: val.merchant_name,
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

	formRef.value.validate(async (valid: boolean) => {
		if (valid) {
			loading.value = true;
			try {
				if (isEdit.value) {
					await merchantsApi.update(props.row.id, form.value);
				} else {
					await merchantsApi.create(form.value);
				}

				emit("success");
				visible.value = false;
			} finally {
				loading.value = false;
				resetForm();
			}
		} else {
			return false;
		}
	});
}
</script>
