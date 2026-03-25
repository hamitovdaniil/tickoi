import { defineStore } from "pinia";

type SelectedCell = {
	user_id: number;
	date: string;
};

export const useTimetableStore = defineStore("timetable", {
	state: () => ({
		userId: null as number | null,
		selectedDates: [] as string[],
	}),

	getters: {
		hasSelection: (state) => state.selectedDates.length > 0,
	},

	actions: {
		setUser(userId: number) {
			// если сменился юзер — сбрасываем selection
			if (this.userId !== userId) {
				this.clearSelection();
			}
			this.userId = userId;
		},

		toggleDate(date: string) {
			const index = this.selectedDates.indexOf(date);

			if (index !== -1) {
				this.selectedDates.splice(index, 1);
			} else {
				this.selectedDates.push(date);
			}
		},

		setSingleDate(date: string) {
			this.selectedDates = [date];
		},

		clearSelection() {
			this.selectedDates = [];
		},

		buildPayload(form: any, branchId: number) {
			if (!this.userId) {
				throw new Error("user_id is required");
			}

			const payload: any = {
				user_id: this.userId,
				branch_id: branchId,
				template: form.template,
				type: form.type,
			};

			// ===== DAY MODE =====
			if (form.template === 1) {
				payload.dates = this.selectedDates;
			}

			// ===== WEEK MODE =====
			if (form.template === 2) {
				payload.date = this.selectedDates[0]; // anchor
				payload.day_of_week = form.day_of_week;
				payload.interval = form.interval;
			}

			// ===== TIME =====
			if (form.type === 1) {
				payload.start_time = form.start_time;
				payload.end_time = form.end_time;

				if (form.break_time?.length) {
					payload.break_time = form.break_time;
				}
			} else {
				payload.start_time = "00:00";
				payload.end_time = "23:59";
			}

			return payload;
		},
	},
});
