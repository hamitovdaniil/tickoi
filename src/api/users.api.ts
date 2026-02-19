import { createCrudApi } from "./baseCtud";
export const usersApi = {
	...createCrudApi("/api/user"),
};
