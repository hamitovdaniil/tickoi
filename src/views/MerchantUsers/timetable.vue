<template>
	<the-header>
		<div class="head">
			<div class="head__left">
				<h1>{{ user?.name ?? "" }} | График</h1>
			</div>
			<!-- <div class="head__right">
				<HeadAddBtn @handle-click="handleCreate" />
			</div> -->
		</div>
	</the-header>
	<el-main class="timetable">
		<div class="timetable__head">
			<el-date-picker
				:shortcuts="shortcuts"
				v-model="currentMonth"
				@change="getData"
				format="MMMM, YYYY"
				type="month"
			>
			</el-date-picker>
		</div>
		<timetable-add
			:employees="timeTable"
			:period="getMonthRange(currentMonth)"
			:isSelected="modalVisible"
			@cellClick="cellClick"
		/>
	</el-main>
	<TimetableFormModal
		:selected="data"
		@success="reload"
		width="500px"
		v-model="modalVisible"
		:row="selectedRow"
	/>
</template>
<script setup lang="ts">
import { merchantUsersApi } from "@/api/merchantUsers.api";
// import timetableAdd from "@/components/TimeTable/Index/index.vue";
import TimetableFormModal from "@/components/Modal/TimtableFormModal/index.vue";
import timetableAdd from "@/components/TimeTable/Add/index.vue";
import { usersApi } from "@/api/users.api";
import TheHeader from "@/components/navigation/TheHeader.vue";
import { ElNotification } from "element-plus";
import { reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { branchUsersApi } from "@/api/branchUsers.api";
import { formatYMD } from "@/utils/date";
const route = useRoute();

const intervals = ref([]);
const userId = Number(route.params.id);
const user = ref(null);
const currentMonth = ref(new Date());

async function fetchUser() {
	try {
		const response = await usersApi.get(userId);
		user.value = response.data;
	} catch {
		ElNotification({
			title: "Ошибка",
			message: "Произошла ошибка",
			type: "error",
		});
	}
}
const shortcuts = [
	{
		text: "Сегодня",
		value: new Date(),
	},
];
fetchUser();
const timeTable = ref();
const getData = async () => {
	try {
		const { from, to } = getMonthRange(currentMonth.value);
		const res = await branchUsersApi.list({
			branch_id: 4,
			from: from,
			to: to,
		});
		timeTable.value = res.data.users.map((item: any) => transformWorker(item));

		console.log(timeTable.value);
	} catch (e) {
		console.log(e);
	}
};
const getMonthRange = (date: Date) => {
	const year = date.getFullYear();
	const month = date.getMonth();

	const from = new Date(year, month, 1);

	const to = new Date(year, month + 1, 0);

	return {
		from: formatYMD(from),
		to: formatYMD(to),
	};
};
function transformWorker(worker: any) {
	return {
		id: worker.id,
		name: worker.name,
		schedule: worker.schedules.reduce((acc: any, item: any) => {
			acc[item.date] = {
				name: `${item.start_time.slice(0, 5)} ${item.end_time.slice(0, 5)}`,
				type: item.type,
			};
			return acc;
		}, {}),
	};
}
getData();

const tableRef = ref<InstanceType<typeof timetableAdd> | null>(null);
function reload(forceReload = false) {
	getData();
}

const modalVisible = ref(false);
const selectedRow = ref([]);

function handleEdit(row: any) {
	modalVisible.value = true;
}

function handleCreate() {
	modalVisible.value = true;
}

const data = ref();
const cellClick = (item: { row: any; column: any; cell: any }) => {
	modalVisible.value = true;
	console.log(item);

	data.value = item;
};
</script>
<style lang="scss">
@use "@/assets/css/timetable.scss" as *;
</style>
