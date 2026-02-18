<template>
	<!-- MOBILE DRAWER -->
	<transition name="fade">
		<div v-if="isMobile && isDrawerOpen" class="aside-overlay" @click="closeDrawer"></div>
	</transition>

	<aside
		:class="[
			'aside',
			{ 'aside--collapsed': isCollapsed && !isMobile },
			{ 'aside--mobile-open': isDrawerOpen && isMobile },
		]"
	>
		<div class="aside__wrapper">
			<div class="aside__header">
				<span v-if="!isCollapsed || isMobile">TICKIO</span>
				<span v-if="isCollapsed">T</span>
				<button v-if="isMobile" class="aside__close" @click="closeDrawer">✕</button>
			</div>
			<el-scrollbar class="aside__scrollbar">
				<el-menu router :default-active="activeRoute" :collapse="isCollapsed && !isMobile">
					<template v-for="item in visibleMenu" :key="item.label">
						<el-sub-menu v-if="item.children?.length" :index="item.label">
							<template #title>
								<el-icon v-if="item?.icon">
									<component :is="getIcon(item?.icon)" />
								</el-icon>
								{{ item.label }}
							</template>

							<el-menu-item
								v-for="child in item.children"
								:key="child.label"
								:index="child?.to?.name"
								:route="item.to"
							>
								<el-icon v-if="child?.icon">
									<component :is="getIcon(child?.icon)" />
								</el-icon>
								<template #title>{{ child.label }}</template>
							</el-menu-item>
						</el-sub-menu>

						<el-menu-item v-else :index="item.to?.name" :route="item.to">
							<el-icon v-if="item?.icon">
								<component :is="getIcon(item?.icon)" />
							</el-icon>
							<template #title>{{ item.label }}</template>
						</el-menu-item>
					</template>
				</el-menu>
			</el-scrollbar>

			<div class="aside__foter">
				<div class="aside__foter_me">
					<template v-if="!isCollapsed">
						<span class="aside__foter_me_name"> {{ user?.name ?? "Admin" }} </span>
						<span class="aside__foter_me_email"> {{ user?.email ?? "Admin" }} </span>
					</template>
					<template v-else>
						<el-avatar :size="30" :icon="UserFilled"> </el-avatar>
					</template>
				</div>
				<div class="aside__foter_btn" v-if="!isCollapsed">
					<el-button type="danger" @click="authStore.logout()" size="small" link>
						<el-icon size="20">
							<icon-exit />
						</el-icon>
					</el-button>
				</div>
			</div>
		</div>
	</aside>
</template>
<script setup lang="ts">
import { ref, computed, watch, type ComputedRef } from "vue";
import { UserFilled } from "@element-plus/icons-vue";
import { ElMenu, ElMenuItem, ElSubMenu, ElButton, ElIcon, ElAvatar } from "element-plus";
import { useRoute } from "vue-router";
import { menu } from "@/router/navigation";
import { useAccess } from "@/composables/useAccess";
import { useBreakpoint } from "@/composables/useBreakpoint";
import IconExit from "../Icons/IconExit.vue";
import { useAuthStore } from "@/stores/auth";
import type { IUser } from "@/types/user";
import { useNavigationStore } from "@/stores/navigation";
import { el } from "element-plus/es/locales.mjs";
const authStore = useAuthStore();
const navigationStore = useNavigationStore();
const user: ComputedRef<IUser | null> = computed(() => authStore.user);

const route = useRoute();
const { can } = useAccess();
const { isMobile } = useBreakpoint();

const isCollapsed = computed(() => navigationStore.isCollapsed);
const isDrawerOpen = computed(() => navigationStore.isDrawerOpen);

function closeDrawer() {
	navigationStore.closeDrawer();
}

watch(route, () => {
	if (isMobile.value) closeDrawer();
});
interface MenuItem {
	label: string;
	icon?: any;
	to?: { name: string };
	access?: AccessRule;
	children?: MenuItem[];
}
const getIcon = (icon: any) => {
	switch (icon) {
		case "UserFilled":
			return UserFilled;
	}
};
type AccessRule =
	| { anyRole?: string[]; allRole?: string[]; anyPerm?: string[]; allPerm?: string[] }
	| string; // permission shorthand: "users.read"
function filterMenu(items: MenuItem[]): MenuItem[] {
	return items
		.filter((i) => !i.access || can(i.access))
		.map((i) => ({
			...i,
			children: i.children ? filterMenu(i.children) : undefined,
		}));
}

const visibleMenu = computed(() => filterMenu(menu));
const activeRoute = computed(() => route.name as string);
</script>
<style lang="scss">
.aside {
	--aside-width: 260px;
	--aside-width-collapsed: 64px;
	--aside-padding-x: 16px;
	--aside-header-height: 60px;
	--aside-footer-height: 60px;

	--el-menu-active-color: var(--el-color-primary);
	--el-menu-text-color: #fff;
	--el-menu-hover-text-color: var(--el-color-primary);
	--el-menu-bg-color: #1f2d3d;
	--el-menu-hover-bg-color: #a7aaae4a;
	--el-menu-item-height: 56px;
	--el-menu-sub-item-height: calc(var(--el-menu-item-height) - 6px);
	--el-menu-horizontal-height: 60px;
	--el-menu-horizontal-sub-item-height: 36px;
	--el-menu-item-font-size: var(--el-font-size-base);
	--el-menu-item-hover-fill: var(--el-color-primary-light-9);
	--el-menu-border-color: #1f2d3d;
	--el-menu-base-level-padding: 20px;
	--el-menu-level-padding: 20px;
	--el-menu-icon-width: 24px;

	max-width: var(--aside-width);
	width: 100%;
	height: 100vh;
	background: var(--el-menu-bg-color);
	color: var(--el-menu-text-color);
	transition: all 0.2s ease;
	position: relative;
	&__scrollbar {
		height: calc(100% - var(--aside-header-height) - var(--aside-footer-height));
	}
	&--collapsed {
		max-width: var(--aside-width-collapsed);
	}
	&__wrapper {
		position: relative;
		height: 100%;
	}
	&-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		z-index: 1000;
	}
	&__header {
		height: var(--aside-header-height);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 var(--aside-padding-x);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}
	&__close {
		background: none;
		border: none;
		color: white;
		font-size: 18px;
		cursor: pointer;
	}
	&__foter {
		height: var(--aside-footer-height);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 var(--aside-padding-x);
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		position: absolute;
		overflow: hidden;
		bottom: 0;
		width: calc(var(--aside-width) - var(--aside-padding-x) * 2);
		&_me {
			display: flex;
			flex-direction: column;
			gap: 4px;
			font-size: 12px;
			font-weight: 400;
		}
	}
	@media (max-width: 992px) {
		position: fixed;
		left: calc(-1 * var(--aside-width));
		top: 0;
		z-index: 1001;
		&.aside--mobile-open {
			left: 0;
		}
	}
	.el-menu--collapse {
		width: var(--aside-width-collapsed);
	}
}

.fade-leave-active {
	transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
