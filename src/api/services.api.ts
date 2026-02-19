import { createCrudApi } from "./baseCtud";
export const servicesApi = {
	...createCrudApi("/api/service"),
};
