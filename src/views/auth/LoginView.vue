<template>
	<div class="login">
		<div class="login__wrapper">
			<div class="login__img">
				<!-- <img src="@/assets/images/logo.svg" class="logo" alt="" /> -->
				TICKIO
			</div>
			<div class="login__form">
				<el-form
					@submit.prevent="submit"
					:rules="rules"
					ref="formRef"
					:model="form"
					label-position="top"
				>
					<el-form-item label="Логин" prop="email">
						<el-input v-model="form.email" type="email" autocomplete="username" />
					</el-form-item>

					<el-form-item label="Пароль" prop="password">
						<el-input
							v-model="form.password"
							type="password"
							autocomplete="current-password"
							show-password
						/>
					</el-form-item>

					<el-button
						type="primary"
						:loading="auth.loading"
						@click="submit"
						style="width: 100%"
					>
						Войти
					</el-button>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import type { FormInstance } from "element-plus";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const form = reactive({ email: "vlad@mail.com", password: "123" });
const rules = reactive({
	email: [
		{
			required: true,
			message: "Поле обязательно для заполнения",
			trigger: "blur",
		},
		{
			type: "email",
			message: "Введите корректный email",
			trigger: ["blur", "change"],
		},
	],
	password: [
		{
			required: true,
			message: "Поле обязательно для заполнения",
			trigger: "blur",
		},
	],
});
const formRef = ref<FormInstance>();
const submit = async () => {
	if (!formRef.value) return;
	await formRef.value.validate();
	await auth.login(form.email, form.password);
	const redirect = (route.query.redirect as string) || "/";
	router.replace(redirect);
};
</script>
<style lang="scss">
.login {
	width: 100%;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	background: #1f2d3d;
	&__wrapper {
		padding: 30px;
		border-radius: 10px;
		max-width: 440px;
		width: 100%;
		background: #fff;
	}
	&__form {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		.el-form {
			max-width: 440px;
			width: 100%;
			flex-shrink: 0;
		}
	}
	.el-button {
		margin-top: 20px;
		width: 100%;
	}
	&__img {
		margin-bottom: 40px;
		display: flex;
		justify-content: center;
		align-items: center;

		.img {
			width: 100%;
			height: 100%;
			img {
				width: 100%;
				height: 100%;
			}
		}
	}
}
</style>
