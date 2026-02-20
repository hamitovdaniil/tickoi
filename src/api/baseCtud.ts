import { http } from "@/api/http";
import type { ListResponse } from "@/types/api";

export function createCrudApi(baseUrl: string) {
	return {
		async list(params: any) {
			const { data } = await http.get<ListResponse>(baseUrl, { params });
			return data;
		},

		async get(id: number) {
			const { data } = await http.get<{ data: any }>(`${baseUrl}/${id}`);
			return data;
		},

		async create(payload: any) {
			const { data } = await http.post<{ data: any }>(baseUrl, payload);
			return data;
		},

		async update(id: number, payload: any) {
			const { data } = await http.put<{ data: any }>(`${baseUrl}/${id}`, payload);
			return data;
		},

		async delete(id: number) {
			const { data } = await http.delete<{ data: any }>(`${baseUrl}/${id}`);
			return data;
		},

		async activate(id: number) {
			const { data } = await http.get<{ data: any }>(`${baseUrl}/${id}/active`);
			return data;
		},
	};
}
