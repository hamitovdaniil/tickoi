import { http } from "@/api/http";
import type { IAuthResponse, IUser } from "@/types/user";
export type LoginPayload = { email: string; password: string };

export const authApi = {
	async login(payload: LoginPayload) {
		const { data } = await http.post<IAuthResponse>("/api/login", payload);
		return data;
	},

	async me() {
		const { data } = await http.get<{ data: IUser }>("/api/me");
		return data.data;
	},

	async logout() {
		await http.post("/api/logout").catch(() => {});
	},
};
