<template>
	<BaseModal
		v-model="visible"
		:title="isEdit ? 'Edit User' : 'Create User'"
		:loading="loading"
		@submit="handleSubmit"
	>
		<el-form
			label-position="top"
			:model="form"
			:rules="rules"
			ref="formRef"
			label-width="100px"
		>
			<el-form-item label="Name" prop="name">
				<el-input v-model="form.name" />
			</el-form-item>

			<el-form-item label="Email" prop="email">
				<el-input v-model="form.email" />
			</el-form-item>

			<el-form-item v-if="!isEdit" label="Password" prop="password">
				<el-input v-model="form.password" type="password" />
			</el-form-item>
		</el-form>
	</BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import BaseModal from "@/components/Modal/BaseCrud.vue";
import { usersApi } from "@/api/users.api";

const props = defineProps<{
	modelValue: boolean;
	user?: any | null;
}>();

const emit = defineEmits(["update:modelValue", "success"]);

const visible = computed({
	get: () => props.modelValue,
	set: (v) => emit("update:modelValue", v),
});

const isEdit = computed(() => !!props.user?.id);

const formRef = ref();
const loading = ref(false);

const form = ref({
	name: "",
	email: "",
	password: "",
});

const rules = {
	name: [{ required: true, message: "Required", trigger: "blur" }],
	email: [{ required: true, message: "Required", trigger: "blur" }],
};

/* ========================= INIT DATA ========================= */

watch(
	() => props.user,
	(val) => {
		if (val) {
			form.value = {
				name: val.name,
				email: val.email,
				password: "",
			};
		} else {
			form.value = {
				name: "",
				email: "",
				password: "",
			};
		}
	},
	{ immediate: true },
);

/* ========================= SUBMIT ========================= */

async function handleSubmit() {
	await formRef.value.validate();

	loading.value = true;

	try {
		if (isEdit.value) {
			await usersApi.update(props.user.id, form.value);
		} else {
			await usersApi.create(form.value);
		}

		emit("success");
		visible.value = false;
	} finally {
		loading.value = false;
	}
}
</script>
