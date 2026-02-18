<script setup lang="ts">
import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const form = reactive({ email: "vlad@mail.com", password: "123" });

const submit = async () => {
	await auth.login(form.email, form.password);
	const redirect = (route.query.redirect as string) || "/";
	router.replace(redirect);
};
</script>

<template>
	<el-form @submit.prevent="submit" label-position="top">
		<el-form-item label="Email">
			<el-input v-model="form.email" autocomplete="username" />
		</el-form-item>

		<el-form-item label="Password">
			<el-input
				v-model="form.password"
				type="password"
				autocomplete="current-password"
				show-password
			/>
		</el-form-item>

		<el-button type="primary" :loading="auth.loading" @click="submit" style="width: 100%">
			Sign in
		</el-button>
	</el-form>
</template>
