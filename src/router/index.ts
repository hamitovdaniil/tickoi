import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes";
import { useAuthStore } from "@/stores/auth";
import { useAccess } from "@/composables/useAccess";

declare module "vue-router" {
	interface RouteMeta {
		requiresAuth?: boolean;
		access?: any; // AccessRule, можно типизировать точнее
	}
}

export const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach(async (to) => {
	const auth = useAuthStore();

	// 1) подтянуть /me если есть токен
	await auth.bootstrap();

	// 2) гость пытается зайти в админку
	if (to.meta.requiresAuth && !auth.isAuthed) {
		return { name: "login", query: { redirect: to.fullPath } };
	}

	// 3) авторизованный на /auth/login — кинуть на дашборд
	if (to.name === "login" && auth.isAuthed) {
		return { path: "/" };
	}

	// 4) проверка прав на route
	if (to.meta.access) {
		const { can } = useAccess();
		if (!can(to.meta.access)) return { name: "forbidden" };
	}

	return true;
});
