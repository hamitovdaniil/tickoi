<template>
	<el-drawer
		class="base-modal"
		:model-value="modelValue"
		:size="size || '100%'"
		@close="handleClose"
		:style="width ? { 'max-width': width } : {}"
		destroy-on-close
		:modal="!modalPenetrable || false"
		:modal-penetrable="modalPenetrable || false"
		:resizable="resizable || false"
		:direction="direction"
	>
		<template #header v-if="title">
			<h1 class="base-modal__title">{{ title }}</h1>
			<el-select size="small" style="width: 60px" v-model="direction">
				<el-option label="Справа" value="rtl" />
				<el-option label="Слева" value="ltr" />
				<el-option label="Сверху" value="ttb" />
				<el-option label="Снизу" value="btt" />
			</el-select>
		</template>
		<div class="base-modal__body">
			<slot />
		</div>

		<template #footer>
			<div class="base-modal__footer">
				<el-button @click="handleClose"> Отмена </el-button>

				<el-button type="primary" :loading="loading" @click="$emit('submit')">
					Сохранить
				</el-button>
			</div>
		</template>
	</el-drawer>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineProps<{
	modelValue: boolean;
	title: string;
	loading?: boolean;
	width?: string | number;
	size?: string | number;
	resizable?: boolean;
	modalPenetrable?: boolean;
}>();

const emit = defineEmits(["update:modelValue", "submit"]);
const direction = ref("rtl");
function handleClose() {
	emit("update:modelValue", false);
}
</script>

<style lang="scss">
.base-modal {
	.el-drawer {
		&__header {
			margin: 0;
		}
	}
}
.base-modal__body {
	padding: 10px 0;
}
.base-modal__footer {
	display: flex;
	justify-content: flex-end;
	gap: 10px;
}
</style>
