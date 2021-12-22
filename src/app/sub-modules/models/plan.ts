

import { Guests		} from './roster'
import { Presbies	} from './roster'

export interface Schedule  {
	id:			string;
	plan:		Plan;
	ver:		Version;
	actives:	Presbies;
	unGs:		{[key: string]: Guests};
	aGs:		{[key: string]: Guests};
	unHs:		{[key: string]: Hosts};
	aHs:		{[key: string]: Hosts};
};

export type Plans = Plan[];
export interface Plan {
	id:			number;
	name:		string;
	versions:	Versions;
}

export type Versions = Version[];
export interface Version {
	id:		number;
	labels:	string[];
	events:	Events;
}

export type Events = Event[];
export interface Event {
	id:		number;
	name:	string;
	hosts?:	Hosts;
}

export type Hosts = Host[];
export interface Host {
	event:			string;
	seats?:			number;
	hostKey?:		string;
	id?:			number;
	guests?:		string[];
	hostName?:		string;
	isAssignable?:	boolean;
	isAssigned?:	boolean;
	isDisabled?:	boolean;
}

// sched: {
// assignedHosts?: {
// [key: string]: any};
// assignedGuests?:{
// [key: string]: any
// };
// unassignedHosts?: {
// [key: string]: any
// };
// unassignedGuests?: {[key: string]: any
// }; actives?: Presbies;
// } = {};
