<template>
	<BaseModal
		v-model="visible"
		title="Настройка расписания"
		:loading="loading"
		@submit="handleSubmit"
		size="width"
		resizable
		modal-penetrable
	>
		<el-form
			label-position="top"
			:model="form"
			:rules="rules"
			ref="formRef"
			@submit.prevent="handleSubmit"
		>
			<el-form-item label="Шаблон" prop="template">
				<el-select v-model="form.template" placeholder="Select">
					<el-option
						v-for="item in templateOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="Рабочие дни" v-if="form.template === 2" prop="day_of_week">
				<el-checkbox-group size="small" v-model="form.day_of_week">
					<el-checkbox-button
						:label="item.label"
						:value="item.value"
						v-for="item in weekDays"
					/>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item label="Интервал действия" v-if="form.template === 2" prop="interval">
				<el-input-number :min="1" :max="52" v-model="form.interval" />
			</el-form-item>
			<el-form-item label="Тип" prop="type">
				<el-select
					v-model="form.type"
					@change="handleTypeChange"
					popper-class="type-select"
					placeholder="Select"
				>
					<el-option
						v-for="item in dayTypeOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
						:class="[getClass(item.value)]"
					>
						<span class="option">
							<el-icon class="icon"> <component :is="getIcon(item.value)" /> </el-icon
							>{{ item.label }}
						</span>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="Рабочее время" v-if="form.type === 1" prop="start_time">
				<div class="time-row">
					<el-time-picker
						v-model="form.start_time"
						format="HH:mm"
						value-format="HH:mm"
						default
						clearable
					/>

					<span>—</span>

					<el-time-picker
						v-model="form.end_time"
						format="HH:mm"
						value-format="HH:mm"
						clearable
					/>
				</div>
			</el-form-item>
			<el-form-item label="Перерывы" v-if="form.type === 1" class="breaks">
				<div class="time-row" v-for="(item, index) in form.break_time" :key="index">
					<el-time-picker
						v-model="item.start_time"
						format="HH:mm"
						value-format="HH:mm"
						clearable
					/>

					<span>—</span>

					<el-time-picker
						v-model="item.end_time"
						format="HH:mm"
						value-format="HH:mm"
						clearable
					/>

					<el-button text type="danger" size="small" @click="removeBreak(index)">
						<el-icon><Delete /></el-icon>
					</el-button>
				</div>

				<el-button text @click="addBreak"> + Добавить перерыв </el-button>
			</el-form-item>
		</el-form>
	</BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, markRaw } from "vue";
import { Delete } from "@element-plus/icons-vue";
import BaseModal from "@/components/Modal/BaseCrud.vue";
import { usersApi } from "@/api/users.api";
import { merchantsApi } from "@/api/merchants.api";
import { ElNotification, type FormInstance, type FormItemContext } from "element-plus";
import { servicesApi } from "@/api/services.api";
import IconSick from "@/components/TimeTable/Add/Icons/Sick.vue";
import IconHoliday from "@/components/TimeTable/Add/Icons/Holiday.vue";
import IconDayOff from "@/components/TimeTable/Add/Icons/DayOff.vue";
import IconAbsence from "@/components/TimeTable/Add/Icons/Absence.vue";
import { branchUsersApi } from "@/api/branchUsers.api";
import { useTimetableStore } from "@/stores/timetable";

const timetableStore = useTimetableStore();
const props = defineProps<{
	modelValue: boolean;
	row?: any | null;
	width?: string | number;
}>();

const templateOptions = [
	{
		value: 1,
		label: "Без шаблона",
	},
	{
		value: 2,
		label: "По дням недели",
	},
];
const weekDays = [
	{
		value: 1,
		label: "ПН",
	},
	{
		value: 2,
		label: "ВТ",
	},
	{
		value: 3,
		label: "СР",
	},
	{
		value: 4,
		label: "ЧТ",
	},
	{
		value: 5,
		label: "ПТ",
	},
	{
		value: 6,
		label: "СБ",
	},
	{
		value: 7,
		label: "ВС",
	},
];

const dayTypeOptions = [
	{
		value: 1,
		label: "Рабочий день",
	},
	{
		value: 2,
		label: "Больничный",
	},
	{
		value: 3,
		label: "Отпуск",
	},
	{
		value: 4,
		label: "Неоплачтваемый выходной",
	},
	{
		value: 5,
		label: "Прогул",
	},
	{
		value: 6,
		label: "Оплачтваемый выходной",
	},
];
const emit = defineEmits(["update:modelValue", "success"]);

const visible = computed({
	get: () => props.modelValue,
	set: (v) => emit("update:modelValue", v),
});

const isEdit = computed(() => !!props.row?.id);
const getIcon = (type: number) => {
	switch (type) {
		case 1:
			return markRaw(IconSick);
		case 2:
			return markRaw(IconSick);
		case 3:
			return markRaw(IconHoliday);
		case 4:
			return markRaw(IconDayOff);
		case 5:
			return markRaw(IconAbsence);
		case 6:
			return markRaw(IconDayOff);
	}
};
const getClass = (type: number) => {
	switch (type) {
		case 1:
			return "el-select-dropdown__item--work";
		case 2:
			return "el-select-dropdown__item--sick";
		case 3:
			return "el-select-dropdown__item--holiday";
		case 4:
			return "el-select-dropdown__item--unpaid-dayOff";
		case 5:
			return "el-select-dropdown__item--absence";
		case 6:
			return "el-select-dropdown__item--paid-dayOff";
	}
};
const formRef = ref<FormInstance>();
const loading = ref(false);

const form = ref({
	template: 1,
	type: 1,
	interval: 1,
	day_of_week: [] as any[],
	start_time: "09:00",
	end_time: "18:00",
	break_time: [] as any[],
});
function addBreak() {
	form.value.break_time.push({
		start_time: "13:00",
		end_time: "14:00",
	});
}

function removeBreak(index: number) {
	form.value.break_time.splice(index, 1);
}

const handleTypeChange = () => {
	if (form.value.type !== 1) {
		form.value.break_time = [];
		form.value.start_time = "09:00";
		form.value.end_time = "18:00";
	}
};

const rules = {
	template: [{ required: true, message: "Обязательное поле", trigger: "blur" }],
	type: [{ required: true, message: "Обязательное поле", trigger: "blur" }],
	day_of_week: [{ required: true, message: "Обязательное поле", trigger: "blur" }],
	interval: [{ required: true, message: "Обязательное поле", trigger: "blur" }],
};

/* ========================= INIT DATA ========================= */
function resetForm() {
	form.value = {
		template: 1,
		type: 1,
		interval: 1,
		day_of_week: [],
		start_time: "09:00",
		end_time: "18:00",
		break_time: [],
	};
}
// watch(
// 	() => props.row,
// 	(val) => {
// 		if (val) {
// 			form.value = {
// 				template: val.template,
// 				base_price: val.base_price,
// 				base_duration_minutes: val.base_duration_minutes,
// 			};
// 		} else {
// 			resetForm();
// 		}
// 	},
// 	{ immediate: true, deep: true },
// );

watch(
	() => visible.value,
	(val) => {
		if (!val) {
			resetForm();
		}
	},
);
watch(
	() => form.value.template,
	(template) => {
		if (template === 2) {
			// WEEK режим

			const days = timetableStore.selectedDates.map(getDayOfWeek);
			console.log(days);

			// убираем дубли
			form.value.day_of_week = [...new Set(days)].sort((a, b) => a - b);

			// якорная дата (первая)
			// timetableStore.selectedDates = [timetableStore.selectedDates[0]];
		}
	},
);
function getDayOfWeek(date: string): number {
	const day = new Date(date).getDay();

	return day === 0 ? 7 : day;
}
/* ========================= SUBMIT ========================= */

async function handleSubmit() {
	if (!formRef.value) return;
	await formRef.value.validate();
	loading.value = true;
	try {
		const payload = timetableStore.buildPayload(form.value, 4);

		await branchUsersApi.create(payload);

		emit("success");
		visible.value = false;
	} catch (error) {
		console.log(error);

		ElNotification({
			title: "Ошибка",
			message: "Произошла ошибка",
			type: "error",
		});
	} finally {
		loading.value = false;
		resetForm();
		timetableStore.clearSelection();
	}
}
</script>
<style lang="scss">
.type-select {
	.el-select-dropdown__item {
		&--work {
			--color: var(--tile--work-color);
		}

		&--sick {
			--color: var(--tile--sick-color);
		}
		&--holiday {
			--color: var(--tile--holiday-color);
		}
		&--unpaid-dayOff {
			--color: var(--tile--unpaid-dayOff-color);
		}
		&--absence {
			--color: var(--tile--absence-color);
		}
		&--paid-dayOff {
			--color: var(--tile--paid-dayOff-color);
		}
		&--new {
			--color: var(--tile--new-color);
		}
		&--added-new {
			--color: var(--tile--new-color);
		}
		&.is-selected {
			color: var(--color);
		}
		.option {
			display: flex;
			align-items: center;
			gap: 5px;
			.el-icon {
				width: 1.5em;
				height: 1.5em;
				svg {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
}
.time-row {
	display: flex;
	align-items: center;
	gap: 5px;
	width: 100%;
	max-width: 100%;
	.el-date-editor.el-input {
		width: 120px;
	}
}
.breaks {
	.el-form-item__content {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 5px;
	}
	.el-date-editor.el-input {
		width: 100px;
	}
}
</style>
