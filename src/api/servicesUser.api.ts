import { createCrudApi } from "./baseCtud";
import { http } from "./http";
export const servicesUsersApi = {
	...createCrudApi("/api/service-user"),
	async updateServives(payload: any) {
		const { data } = await http.post<{ data: any }>(`/api/service-user`, payload);
		return data;
	},
};
