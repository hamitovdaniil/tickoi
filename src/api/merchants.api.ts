import { createCrudApi } from "./baseCtud";
export const merchantsApi = {
	...createCrudApi("/api/merchant"),
};
