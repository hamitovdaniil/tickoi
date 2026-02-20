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
			<el-form-item label="Имя" prop="name">
				<el-input v-model="form.name" />
			</el-form-item>

			<el-form-item label="Email" prop="email">
				<el-input v-model="form.email" />
			</el-form-item>

			<el-form-item v-if="!isEdit" label="Пароль" prop="password">
				<el-input v-model="form.password" type="password" />
			</el-form-item>
			<el-form-item label="Филиал" prop="merchant">
				<el-select
					v-model="form.branches"
					popper-class="branchSelect"
					multiple
					filterable
					placeholder="Выберите"
				>
					<el-option
						v-for="item in branches"
						:key="item.id"
						:disabled="!item.active"
						:label="item.branch_name"
						:value="item.id"
					/>
				</el-select>
			</el-form-item>
		</el-form>
	</BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import BaseModal from "@/components/Modal/BaseCrud.vue";
import { usersApi } from "@/api/users.api";
import { merchantsApi } from "@/api/merchants.api";
import { ElNotification, type FormInstance, type FormItemContext } from "element-plus";
import { useBranchStore } from "@/stores/branch";
import { merchantUsersApi } from "@/api/merchantUsers.api";

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
	email: "",
	password: "",
	branches: [] as number[],
});

const rules = {
	name: [{ required: true, message: "Обязательное поле", trigger: "blur" }],
	email: [{ required: true, message: "Обязательное поле", trigger: "blur" }],
	password: [{ required: true, message: "Обязательное поле", trigger: "blur" }],
	branches: [{ required: true, message: "Обязательное поле", trigger: "blur" }],
};
const branchStore = useBranchStore();
const branches = computed(() => branchStore.branchList);
const currentBranch = computed(() => branchStore.currentBranch);

/* ========================= INIT DATA ========================= */
function resetForm() {
	form.value = {
		name: "",
		email: "",
		password: "",
		branches: [],
	};
}
watch(
	() => props.row,
	(val) => {
		if (val) {
			form.value = {
				name: val.name,
				email: val.email,
				password: "",
				branches: val.branches,
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
		} else {
			if (currentBranch.value?.id && !props.row) {
				form.value.branches.push(currentBranch.value?.id);
			}
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
			await merchantUsersApi.update(props.row.id, form.value);
		} else {
			await merchantUsersApi.create(form.value);
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
