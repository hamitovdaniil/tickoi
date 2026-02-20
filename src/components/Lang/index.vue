<template>
	<el-dropdown placement="bottom" @command="changeLocale">
		<el-button size="small" plain class="locale">{{ locale }}</el-button>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item v-for="item in availableLocales" :command="item" :key="item">{{
					item
				}}</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ElButton, ElDropdown, ElDropdownItem } from "element-plus";
const { t, locale, availableLocales } = useI18n({ useScope: "global" });

const changeLocale = (loc: string) => {
	locale.value = loc;
};
</script>

<style lang="scss">
.el-dropdown {
	&:focus-visible {
		outline: none;
	}
}
.locale {
	background: transparent;
	--el-button-text-color: #fff;
	&:focus-visible {
		outline: none;
	}
}
</style>
