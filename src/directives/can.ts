import type { Directive } from "vue";
import { useAccess } from "@/composables/useAccess";

export const vCan: Directive<HTMLElement, any> = {
	mounted(el, binding) {
		const { can } = useAccess();
		const ok = can(binding.value);
		if (!ok) el.style.display = "none";
	},
};
