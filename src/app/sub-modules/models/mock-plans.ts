

import { Plan		} from './plan';
import { Versions	} from './plan';

export const PLANS: Plan[] = [
	{id: 0, name: 'Spring 2022',	versions: [
		{id: 0, labels: ['first'						], events: [{id: 1, name: 'January'}, {id: 2, name: 'February'}								]},
		{id: 1, labels: ['latest','test','added-march'	], events: [{id: 1, name: 'January'}, {id: 2, name: 'February'}, {id: 3, name: 'March'}		]}
	]},
	{id: 1, name: 'Fall-2021',		versions: [{id: 0, labels: ['first', 'latest'	], events: [{id: 1, name: 'October'}, {id: 2, name: 'November'}] }] },
	{id: 2, name: 'Spring-2023',	versions: [{id:	0, labels: ['first', 'latest'	], events: [{id: 1, name: 'January'}] }] },
	{id: 3, name: '2020-test',		versions: [{id:	0, labels: ['first', 'latest'	], events: [{id: 1, name: 'January'}] }] }
];
