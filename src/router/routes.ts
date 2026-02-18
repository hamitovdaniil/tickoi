import type { RouteRecordRaw } from "vue-router";

export const routes: RouteRecordRaw[] = [
	{
		path: "/auth",
		component: () => import("@/layouts/Admin/AuthLayout.vue"),
		children: [
			{ path: "login", name: "login", component: () => import("@/views/auth/LoginView.vue") },
		],
	},
	{
		path: "/",
		component: () => import("@/layouts/Admin/DefaultLayout.vue"),
		meta: { requiresAuth: true },
		children: [
			{
				path: "merchants",
				components: {
					default: () => import("@/views/merchant/index.vue"),
				},
				name: "merchants.list",
			},
			{
				path: "",
				components: {
					default: () => import("@/views/users/UsersListView.vue"),
				},
				name: "users.list",
			},

			{
				path: "services",
				components: {
					default: () => import("@/views/services/Services.vue"),
				},
				name: "services.list",
			},
		],
	},
	{ path: "/:pathMatch(.*)*", redirect: "/" },
];
