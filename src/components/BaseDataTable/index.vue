<template>
	<div class="base-table">
		<!-- FILTER SLOT -->
		<div v-if="$slots.filters" class="base-table__filters">
			<slot name="filters" :setFilter="setFilter" />
		</div>

		<!-- TABLE -->
		<div ref="baseTableWrapper" class="base-table--wrapper">
			<el-table
				:data="data"
				v-loading="loading"
				border
				stripe
				ref="baseTable"
				fit
				size="small"
				:width="width"
				@sort-change="handleSortChange"
				:row-class-name="tableRowClassName"
			>
				<el-table-column
					v-for="col in columns"
					:key="col.prop"
					:prop="col.prop"
					:label="col.label"
					:sortable="col.sortable ? 'custom' : false"
					:width="col.width"
					:min-width="col.minWidth"
					:show-overflow-tooltip="col.showOverflowTooltip"
					:formatter="col.formatter"
				/>

				<el-table-column
					fixed="right"
					align="right"
					width="160"
					v-if="$slots.actions"
					label="Действия"
				>
					<template #default="scope">
						<div class="actions">
							<slot name="actions" :row="scope.row" />
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>

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
import { reactive, ref, onMounted, nextTick } from "vue";
import { debounce } from "@/utils/input";
import type { TableColumn } from "@/types/table";

interface Props {
	columns: TableColumn[];
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
	limit: 10,
	sortField: null as string | null,
	sortAs: null as "ASC" | "DESC" | null,
	filters: {} as Record<string, any>,
});

const baseTableWrapper = ref<HTMLElement | null>(null);
const calculateLimit = () => {
	if (!baseTableWrapper.value) return;
	const baseTableWrapperHeight = baseTableWrapper.value.clientHeight;
	const baseTableHeader = 32;

	params.limit = Math.floor((baseTableWrapperHeight - baseTableHeader) / 33) - 1;
};
calculateLimit();
/* ========================= LOAD ========================= */

async function load() {
	calculateLimit();
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

function tableRowClassName({ row, rowIndex }: any) {
	if (row?.active === false) {
		return "inactive";
	}
	return "";
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

const reload = (force = false) => {
	if (force) {
		load();
	} else {
		debouncedLoad();
	}
};

defineExpose({ reload });
</script>

<style lang="scss">
.base-table {
	height: 100%;
	display: flex;
	flex-direction: column;
	&--wrapper {
		flex: 1;
		display: flex;
	}
	.el-table {
		flex: 1;
	}
	.actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	.inactive {
		--el-table-tr-bg-color: var(--el-color-warning-light-9);
	}
	&__filters {
		margin-bottom: 20px;
	}
	&__pagination {
		margin-top: 20px;
		display: flex;
		justify-content: flex-end;
	}
}
</style>
