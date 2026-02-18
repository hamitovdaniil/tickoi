<template>
	<div class="base-table">
		<!-- FILTER SLOT -->
		<div v-if="$slots.filters" class="base-table__filters">
			<slot name="filters" :setFilter="setFilter" />
		</div>

		<!-- TABLE -->
		<el-table
			:data="data"
			v-loading="loading"
			border
			stripe
			fit
			:width="width"
			@sort-change="handleSortChange"
		>
			<el-table-column
				v-for="col in columns"
				:key="col.prop"
				:prop="col.prop"
				:label="col.label"
				:sortable="col.sortable ? 'custom' : false"
				:formatter="col.formatter"
			/>

			<el-table-column
				fixed="right"
				align="right"
				width="160"
				v-if="$slots.actions"
				label="Actions"
			>
				<template #default="scope">
					<div class="actions">
						<slot name="actions" :row="scope.row" />
					</div>
				</template>
			</el-table-column>
		</el-table>

		<!-- PAGINATION -->
		<div class="base-table__pagination" v-if="last_page > 1">
			<el-pagination
				background
				size="small"
				layout="prev, pager, next, "
				:page-size="params.limit"
				:current-page="params.page"
				:total="total"
				@current-change="handlePageChange"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { debounce } from "@/utils/input";

interface Column {
	prop: string;
	label: string;
	sortable?: boolean;
	formatter?: (row: any, col: any, value: any) => any;
}

interface Props {
	columns: Column[];
	fetcher: (params: any) => Promise<any>;
	width?: string;
}

const props = defineProps<Props>();

const data = ref<any[]>([]);
const total = ref(0);
const last_page = ref(0);
const loading = ref(false);

const params = reactive({
	page: 1,
	limit: 1,
	sortField: null as string | null,
	sortAs: null as "ASC" | "DESC" | null,
	filters: {} as Record<string, any>,
});

/* ========================= LOAD ========================= */

async function load() {
	loading.value = true;
	try {
		const response = await props.fetcher(params);

		data.value = response.data;
		total.value = response.total ?? 0;
		last_page.value = response.last_page ?? 0;
	} finally {
		loading.value = false;
	}
}

/* ========================= SORT ========================= */

function handleSortChange(val: any) {
	if (!val.order) {
		params.sortField = null;
		params.sortAs = null;
	} else {
		params.sortField = val.prop;
		params.sortAs = val.order === "ascending" ? "ASC" : "DESC";
	}

	load();
}

/* ========================= PAGINATION ========================= */

function handlePageChange(page: number) {
	params.page = page;
	load();
}

/* ========================= FILTER ========================= */

function setFilter(field: string, op: string, value: any) {
	if (!value || (Array.isArray(value) && !value.length)) {
		delete params.filters[field];
	} else {
		params.filters[field] = {
			op,
			value,
		};
	}

	params.page = 1;
	debouncedLoad();
}

const debouncedLoad = debounce(load, 400);

onMounted(load);

const reload = () => {
	debouncedLoad();
};

defineExpose({ reload });
</script>

<style lang="scss" scoped>
.base-table {
	.actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
}
.base-table__filters {
	margin-bottom: 20px;
}
.base-table__pagination {
	margin-top: 20px;
	display: flex;
	justify-content: flex-end;
}
</style>
