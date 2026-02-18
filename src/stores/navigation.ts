
import { defineStore } from "pinia";
export const useNavigationStore = defineStore("navigation", {
	state: () => ({
		isCollapsed: false,
		isDrawerOpen: false,
	}),

	getters: {},
	actions: {
		collapse() {
			this.isCollapsed = !this.isCollapsed;
		},
		closeDrawer() {
			this.isDrawerOpen = false;
		},
		toggleAside(isMobile: boolean) {
			if (isMobile) {
				this.isDrawerOpen = true;
			} else {
				this.isCollapsed = !this.isCollapsed;
			}
		},
	},
});
