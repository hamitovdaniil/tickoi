import type { ListResponse } from "@/types/api";
import { http } from "@/api/http";
import { createCrudApi } from "./baseCtud";
export const branchesApi = {
	...createCrudApi("/api/branch"),
};
