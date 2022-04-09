export interface action {
	metadata: {
		name: string;
		method: 'GET' | 'POST' | 'PUT' | 'DELETE';

		active?: boolean; // If Action is active or not
		locked?: boolean; // If Action is locked or not
		timeout?: number; // How many seconds the action has to execute before timingout
		limit?: number; // How many times the action is allowed to be called a day
	};

	security: {
		ips?: Array<string>;
		secret: string;
	};

	fields?: {
		headers: Array<Array<string>>;
	};

	action: {
		commands: Array<string>;
	};
}
