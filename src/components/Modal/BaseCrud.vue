<template>
	<el-drawer
		class="base-modal"
		:model-value="modelValue"
		:size="'100%'"
		:style="{ 'max-width': width }"
		@close="handleClose"
		destroy-on-close
	>
		<template #header v-if="title">
			<h1 class="base-modal__title">{{ title }}</h1>
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
defineProps<{
	modelValue: boolean;
	title: string;
	loading?: boolean;
	width?: string | number;
}>();

const emit = defineEmits(["update:modelValue", "submit"]);

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
