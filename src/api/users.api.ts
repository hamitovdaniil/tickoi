import { http } from "./http";
export const usersApi = {
	async list(params: any) {
		const { data } = await http.get<{ data: any }>("/api/user", { params });
		return data;
	},

	async update(id: number, payload: any) {
		const { data } = await http.put<{ data: any }>("/api/user/" + id, payload);
		return data;
	},

	async create(payload: any) {
		const { data } = await http.post<{ data: any }>("/api/user", payload);
		return data;
	},
};
