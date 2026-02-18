<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

// Глобальный флаг инициализации
const appReady = computed(() => {
	// если нет токена — приложение готово
	console.log(auth);
	if (!auth.token) return true;

	// если есть токен — ждём bootstrap
	return auth.bootstrapped;
});
</script>

<template>
	<el-config-provider namespace="el">
		<template v-if="appReady">
			<router-view v-slot="{ Component }">
				<transition name="fade" mode="out-in">
					<component :is="Component" />
				</transition>
			</router-view>
		</template>

		<!-- Глобальный preload экран -->
		<div v-else class="app-loader" v-loading="!appReady"></div>
	</el-config-provider>
</template>

<style>
html,
body,
#app {
	height: 100%;
	margin: 0;
}

.app-loader {
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #f5f7fa;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
