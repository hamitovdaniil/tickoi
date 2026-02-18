import { http } from "./http";
type ListData = {
	data: any;
	meta: any;
};
export const merchantsApi = {
	async list(params: any) {
		const { data } = await http.get<{ data: ListData }>("/api/merchant", { params });

		return data;
	},

	async update(id: number, payload: any) {
		const { data } = await http.put<{ data: any }>("/api/merchant/" + id, payload);
		return data;
	},

	async create(payload: any) {
		const { data } = await http.post<{ data: any }>("/api/merchant", payload);
		return data;
	},

	async delete(id: number) {
		const { data } = await http.delete<{ data: any }>("/api/merchant/" + id);
		return data;
	},

	async get(id: number) {
		const { data } = await http.get<{ data: any }>("/api/merchant/" + id);
		return data;
	},

	async activate(id: number) {
		const { data } = await http.put<{ data: any }>("/api/merchant/" + id + "/activate");
		return data;
	},
};
