import { createCrudApi } from "./baseCtud";
export const merchantUsersApi = {
	...createCrudApi("/api/merchant-user"),
};
