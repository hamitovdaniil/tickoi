<template>
	<BaseModal
		v-model="visible"
		title="Настройка расписания"
		:loading="loading"
		:width="width"
		@submit="handleSubmit"
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
const props = defineProps<{
	modelValue: boolean;
	row?: any | null;
	width?: string | number;
	selected?: any;
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
	day_of_week: [],
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

/* ========================= SUBMIT ========================= */

async function handleSubmit() {
	if (!formRef.value) return;
	await formRef.value.validate();
	loading.value = true;
	const breakTime = form.value.break_time.filter((i) => i.start_time && i.end_time);
	const uniqueBreakTime = new Set(breakTime.map((i) => `${i.start_time}-${i.end_time}`));
	const breakTimeArray = Array.from(uniqueBreakTime).map((i) => {
		const [start_time, end_time] = i.split("-");
		return {
			start_time,
			end_time,
		};
	});
	try {
		const payload = {
			user_id: props.selected.row.id,
			branch_id: 4,

			template: form.value.template,

			date: props.selected.column.rawColumnKey,

			start_time: form.value.start_time,
			end_time: form.value.end_time,

			type: form.value.type,

			day_of_week: form.value.template === 2 ? form.value.day_of_week : null,

			interval: form.value.template === 2 ? form.value.interval : null,

			break_time: form.value.type === 1 && breakTime.length ? breakTimeArray : null,
		};
		Object.keys(payload).forEach((key: any) => payload[key] === null && delete payload[key]);
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
	justify-content: center;
	align-items: center;
	gap: 5px;
	width: 100%;
	max-width: 100%;
	.el-date-editor.el-input {
		width: 100%;
	}
}
.breaks {
	.el-form-item__content {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 5px;
	}
}
</style>
