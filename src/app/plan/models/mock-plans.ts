

import { Plan } from './plan';

export const PLANS: Plan[] = [
	{ id: 1, name: 'Fall - 2021', events: [
		{ id: 1, name: 'October'	},
		{ id: 2, name: 'November'	}
	]},
	{ id: 2, name: 'Spring - 2022', events: [
		{ id: 1, name: 'January'	},
		{ id: 2, name: 'February'	},
		{ id: 3, name: 'March'		}
	]},
	{ id: 3, name: 'Spring - 2023',	events: [{id: 1, name: 'January'}]},
	{ id: 4, name: '2020-test',		events: [{id: 1, name: 'January'}]}
];
