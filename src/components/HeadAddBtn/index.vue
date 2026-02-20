<template>
	<el-button class="addBtn" size="small" @click="$emit('handle-click')" type="primary">
		Добавить
	</el-button>
	<el-button class="addBtn--mobile" @click="$emit('handle-click')" size="small" type="primary">
		<el-icon><Plus /></el-icon>
	</el-button>
</template>
<script lang="ts" setup>
import { Plus } from "@element-plus/icons-vue";
defineEmits(["handle-click"]);
</script>
<style lang="scss">
.addBtn {
	&--mobile {
		display: none;
	}
	@media screen and (max-width: 768px) {
		&--mobile {
			display: block;
		}
		display: none;
	}
}
</style>
