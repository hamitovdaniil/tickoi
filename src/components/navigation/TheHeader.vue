<template>
	<el-header class="mainHeader">
		<div class="mainHeader__left">
			<el-button type="info" size="small" plain @click="onToggle">
				<el-icon><icon-menu /></el-icon>
			</el-button>
		</div>
		<div class="mainHeader__right">
			<slot></slot>
		</div>
	</el-header>
</template>
<script setup lang="ts">
import { ElHeader, ElButton } from "element-plus";
import { Menu } from "@element-plus/icons-vue";
import IconMenu from "../Icons/IconMenu.vue";
import { useNavigationStore } from "@/stores/navigation";
import { useBreakpoint } from "@/composables/useBreakpoint";
const navigationStore = useNavigationStore();
const { isMobile } = useBreakpoint();

const onToggle = () => {
	navigationStore.toggleAside(isMobile.value);
};
</script>
<style scoped lang="scss">
.mainHeader {
	display: flex;
	align-items: center;
	gap: 10px;
    &__right{
        flex: 1;
    }
}
</style>
