<template>
	<el-container class="layout" style="height: 100vh">
		<the-aside ref="asideRef" />
		<el-container direction="vertical">
			<router-view />
		</el-container>
	</el-container>
</template>
<script setup lang="ts">
import TheAside from "@/components/navigation/TheAside.vue";
</script>
