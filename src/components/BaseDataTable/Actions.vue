<template>
	<el-button size="small" v-if="edit" @click="handle('edit')">
		<el-icon><EditPen /></el-icon>
	</el-button>
	<el-popover v-if="remove" :visible="visible" placement="top" :width="180">
		<p>Вы действительно хотите удалить {{ row[remove] }} ?</p>
		<div style="text-align: right; margin: 0">
			<el-button size="small" text @click="visible = false">cancel</el-button>
			<el-button size="small" type="primary" @click="handleDelete"> confirm </el-button>
		</div>
		<template #reference>
			<el-button size="small" @click="visible = true" type="danger">
				<el-icon><Delete /></el-icon>
			</el-button>
		</template>
	</el-popover>

	<el-popover placement="right" ref="popover" trigger="click">
		<template #reference>
			<el-button size="small"
				><el-icon><MoreFilled /></el-icon
			></el-button>
		</template>
		<div class="col">
			<el-button size="small" v-for="action in moreActions" @click="handleAction(action)">
				{{ row[action.action] ? action.activeLabel : action.inactiveLabel }}
			</el-button>
		</div>
	</el-popover>
</template>
<script setup lang="ts">
import { EditPen, Delete, MoreFilled } from "@element-plus/icons-vue";
import { ref } from "vue";
const { row } = defineProps<{ row: any; moreActions?: any; edit: boolean; remove: any }>();
const emits = defineEmits(["handle"]);
const handle = (action: string) => {
	emits("handle", { action, row });
};
const visible = ref(false);
const handleDelete = () => {
	visible.value = false;
	handle("delete");
};
const popover = ref();
const handleAction = (action: any) => {
	handle(action.action);
	popover.value.hide();
};
</script>

<style lang="scss">
.col {
	display: flex;
	flex-direction: column;
	width: 100%;
	.el-button {
		width: 100%;
	}
}
</style>
