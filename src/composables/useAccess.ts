import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";

type AccessRule =
	| { anyRole?: string[]; allRole?: string[]; anyPerm?: string[]; allPerm?: string[] }
	| string; // permission shorthand: "users.read"

export function useAccess() {
	const auth = useAuthStore();

	const rolesSet = computed(() => new Set(auth.roles));
	const permsSet = computed(() => new Set(auth.permissions));

	const hasRole = (role: string) => rolesSet.value.has(role);

	const can = (rule: AccessRule) => {
		if (typeof rule === "string") return permsSet.value.has(rule);

		const anyRoleOk = !rule.anyRole?.length || rule.anyRole.some((r) => rolesSet.value.has(r));
		const allRoleOk = !rule.allRole?.length || rule.allRole.every((r) => rolesSet.value.has(r));

		const anyPermOk = !rule.anyPerm?.length || rule.anyPerm.some((p) => permsSet.value.has(p));
		const allPermOk = !rule.allPerm?.length || rule.allPerm.every((p) => permsSet.value.has(p));

		return anyRoleOk && allRoleOk && anyPermOk && allPermOk;
	};

	return { can, hasRole };
}
