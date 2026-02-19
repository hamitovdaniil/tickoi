<template>
	<BaseModal
		v-model="visible"
		:title="isEdit ? 'Редактировать' : 'Создать'"
		:loading="loading"
		@submit="handleSubmit"
	>
		<el-form label-position="top" :model="form" :rules="rules" ref="formRef">
			<el-form-item label="Имя" prop="name">
				<el-input v-model="form.name" />
			</el-form-item>

			<el-form-item label="Email" prop="email">
				<el-input v-model="form.email" />
			</el-form-item>

			<el-form-item v-if="!isEdit" label="Пароль" prop="password">
				<el-input v-model="form.password" type="password" />
			</el-form-item>
			<el-form-item label="Мерчант" prop="merchant">
				<el-select
					v-model="form.merchant_id"
					filterable
					remote
					reserve-keyword
					:remote-method="searchMerchants"
					:loading="merchantLoading"
					placeholder="Выберите"
				>
					<el-option
						v-for="item in merchants"
						:key="item.id"
						:label="item.merchant_name"
						:value="item.id"
					/>
				</el-select>
			</el-form-item>
		</el-form>
	</BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import BaseModal from "@/components/Modal/BaseCrud.vue";
import { usersApi } from "@/api/users.api";
import type { Imerchant } from "@/types/merchant";
import { merchantsApi } from "@/api/merchants.api";
import { debounce } from "@/utils/input";
import { tr } from "element-plus/es/locales.mjs";
import { ElNotification } from "element-plus";

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

const formRef = ref();
const loading = ref(false);

const form = ref({
	name: "",
	email: "",
	password: "",
	merchant_id: null,
});

const rules = {
	name: [{ required: true, message: "Обязательное поле", trigger: "blur" }],
	email: [{ required: true, message: "Обязательное поле", trigger: "blur" }],
	password: [{ required: true, message: "Обязательное поле", trigger: "blur" }],
	merchant_id: [{ required: true, message: "Обязательное поле", trigger: "blur" }],
};

/* ========================= INIT DATA ========================= */

watch(
	() => props.row,
	async (val) => {
		if (val) {
			form.value = {
				name: val.name,
				email: val.email,
				password: "",
				merchant_id: val.merchant_id,
			};
			if (val.merchant_id) {
				getMerchant(val.merchant_id);
			}
		} else {
			form.value = {
				name: "",
				email: "",
				password: "",
				merchant_id: null,
			};
		}
	},
	{ immediate: true },
);

/* ========================= SUBMIT ========================= */

async function handleSubmit() {
	if (!formRef.value) return;
	await formRef.value.validate();

	loading.value = true;

	try {
		if (isEdit.value) {
			const payload: any = {
				name: form.value.name,
				email: form.value.email,
				merchant_id: form.value.merchant_id,
			};
			await usersApi.update(props.row.id, payload);
		} else {
			await usersApi.create(form.value);
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
	}
}

const merchants = ref<Imerchant[]>([]);
const merchantLoading = ref(false);
const searchMerchants = debounce(async (query: string) => {
	if (!query && form.value.merchant_id) {
		merchants.value = [];
		return;
	}

	merchantLoading.value = true;

	try {
		const response = await merchantsApi.list({
			page: 1,
			limit: 20,
			filters: {
				merchant_name: {
					op: "like",
					value: query,
				},
			},
		});

		merchants.value = response.data;
	} finally {
		merchantLoading.value = false;
	}
}, 400);

const getMerchant = async (id: number) => {
	merchantLoading.value = true;
	try {
		const response = await merchantsApi.get(id);
		merchants.value = [response.data];
	} finally {
		merchantLoading.value = false;
	}
};
</script>
