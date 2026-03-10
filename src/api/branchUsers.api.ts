import { createCrudApi } from "./baseCtud";
export const branchUsersApi = {
	...createCrudApi("/api/branch-user"),
};
