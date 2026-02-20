import { branchesApi } from "@/api/branches.api";
import type { Ibranch } from "@/types/branch";
import { defineStore } from "pinia";

export const useBranchStore = defineStore("branch", {
	state: () => ({
		currentBranchId: null as number | null,
		branchList: [] as Ibranch[],
		params: {
			limit: 100,
			page: 1,
		},
	}),

	getters: {
		currentBranch(state) {
			return state.branchList.find((b) => b.id === state.currentBranchId) || null;
		},
	},

	actions: {
		setCurrentBranch(id: number) {
			this.currentBranchId = id;
			localStorage.setItem("branch_id", String(id));
		},

		clearCurrentBranch() {
			this.currentBranchId = null;
		},

		async getBranchList() {
			try {
				const { data } = await branchesApi.list(this.params);
				this.branchList = data;

				if (!this.branchList.length) return;

				const saved = localStorage.getItem("branch_id");

				// 1️⃣ если есть сохранённый
				if (saved) {
					const exists = this.branchList.find((b) => b.id === Number(saved));
					if (exists) {
						this.currentBranchId = exists.id;
						return;
					}
				}

				// 2️⃣ иначе берём активный
				const active = this.branchList.find((b) => b.active);

				if (active) {
					this.currentBranchId = active.id;
				} else {
					// 3️⃣ fallback — первый
					this.currentBranchId = this.branchList[0].id;
				}
			} catch (error) {
				console.error(error);
			}
		},
	},
});
