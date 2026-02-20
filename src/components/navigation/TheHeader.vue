<template>
	<el-header class="mainHeader">
		<div class="mainHeader__left">
			<el-button type="info" size="small" plain @click="onToggle">
				<el-icon><icon-menu /></el-icon>
			</el-button>
			<el-select size="small" popper-class="branchSelect"  filterable v-model="currentBranch">
				<el-option
					v-for="item in branchList"
					:key="item.id"
					:disabled="!item.active"
					:label="item.branch_name"
					:value="item.id"
				/>
			</el-select>
		</div>
		<div class="mainHeader__right">
			<slot></slot>
		</div>
	</el-header>
</template>
<script setup lang="ts">
import { ElHeader, ElButton, ElTag } from "element-plus";
import { Menu } from "@element-plus/icons-vue";
import IconMenu from "../Icons/IconMenu.vue";
import { useNavigationStore } from "@/stores/navigation";
import { useBreakpoint } from "@/composables/useBreakpoint";
import { useBranchStore } from "@/stores/branch";
import { computed, onMounted } from "vue";
const navigationStore = useNavigationStore();
const branchStore = useBranchStore();
const { isMobile } = useBreakpoint();

const onToggle = () => {
	navigationStore.toggleAside(isMobile.value);
};

const currentBranch = computed({
	get: () => branchStore.currentBranchId,
	set: (val: number) => branchStore.setCurrentBranch(val),
});

const branchList = computed(() => branchStore.branchList);

onMounted(() => {
	branchStore.getBranchList();
});
</script>
<style scoped lang="scss">
.mainHeader {
	display: flex;
	align-items: center;
	gap: 10px;
	&__right {
		flex: 1;
	}
	&__left {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 10px;
		.el-select {
			min-width: 100px;
			width: 100%;
		}
	}
}
</style>
