import { defineStore } from "pinia";
import { authApi } from "@/api/auth.api";
import { router } from "@/router";

type User = Awaited<ReturnType<typeof authApi.me>>;

export const useAuthStore = defineStore("auth", {
	state: () => ({
		token: (localStorage.getItem("token") as string | null) ?? null,
		user: null as User | null,
		bootstrapped: false,
		loading: false,
	}),

	getters: {
		isAuthed: (s) => !!s.token && !!s.user,
		roles: (s) => s.user?.roles ?? [],
		permissions: (s) => s.user?.permissions ?? [],
	},

	actions: {
		async login(email: string, password: string) {
			this.loading = true;
			try {
				const res = await authApi.login({ email, password });
				console.log(res, "vdsvsv");

				this.token = res.token;
				localStorage.setItem("token", res.token);
				this.user = res.user;
			} finally {
				this.loading = false;
			}
		},

		async bootstrap() {
			// Вызывается один раз при старте приложения (если есть token)
			if (this.bootstrapped) return;
			this.bootstrapped = true;

			if (!this.token) return;
			try {
				this.user = await authApi.me();
			} catch {
				this.logout();
			}
		},

		async logout() {
			await authApi.logout().catch(() => {});
			this.token = null;
			this.user = null;
			localStorage.removeItem("token");
			router.push({ name: "login" });
		},
	},
});
