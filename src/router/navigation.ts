export type MenuItem = {
	label: string;
	icon?: any;
	to?: { name: string };
	access?: any;
	children?: MenuItem[];
};
export const menu: MenuItem[] = [
	// {
	// 	label: "Мерчанты",
	// 	to: { name: "merchants.list" },
	// 	icon: "UserFilled",
	// 	// access: { anyPerm: ["users.read"] },
	// },
	// {
	// 	label: "Пользователи",
	// 	to: { name: "users.list" },
	// 	icon: "UserFilled",
	// 	// access: { anyPerm: ["users.read"] },
	// },

	{
		label: "Филиалы",
		to: { name: "branch.list" },
		icon: "UserFilled",
		// access: { anyPerm: ["users.read"] },
	},
	{
		label: "Услуги",
		to: { name: "services.list" },
		icon: "UserFilled",
		// access: { anyPerm: ["users.read"] },
	},
	{
		label: "Сотрудники",
		to: { name: "merchants.users.list" },
		icon: "UserFilled",
		// access: { anyPerm: ["users.read"] },
	},
];
