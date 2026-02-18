export interface IUser {
	id: number;
	name: string;
	email: string;
	email_verified_at: Nullable<Date>;
	role_id: number;
	merchant_id: Nullable<number>;
	created_at: Date;
	updated_at: Date;
}

interface Role {
	id: number;
	label: string;
	permissions: Permission[];
	created_at: Date;
	updated_at: Date;
}

interface Permission {
	id: number;
	label: string;
	created_at: Date;
	updated_at: Date;
	pivot: {
		role_id: number;
		permission_id: number;
	};
}

export interface IAuthResponse {
	token: string;
	user: {
		active: boolean;
		email: string;
		id: number;
		name: string;
		merchant_id: Nullable<number>;
		role: Role;
		created_at: Date;
		email_verified_at: Nullable<Date>;
		updated_at: Date;
	};
}

type Nullable<T> = T | null;
