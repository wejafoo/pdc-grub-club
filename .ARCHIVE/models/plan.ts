
// sched: { assignedHosts?: {[key: string]: any}; assignedGuests?:{[key: string]: any}; unassignedHosts?: {[key: string]: any}; unassignedGuests?: {[key: string]: any}; actives?: Presbies; } = {};

export interface Schedule  {
	unGs:	{[key: string]: Guests	};
	aGs:	{[key: string]: Guests	};
	unHs:	{[key: string]: Hosts	};
	aHs:	{[key: string]: Hosts	};
	actives: Presbies
};

export type Plans = Plan[];
export interface Plan {
	id:			number;
	name:		string;
	versions:	Versions;
}

export type Versions = Version[];
export interface Version {
	id:			number;
	labels:		string[];
	events:		Events;
}

export type Events = Event[];
export interface Event {
	id:			number;
	name:		string;
	hosts?:		Hosts;
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

export type Guests = Guest[];
export interface Guest {
	event:			string;
	guestKey?:		string;
	id?:			number;
	guests?:		string[];
	partyName?:		string;
	cnt?:			number;
	isAssignable?:	boolean;
	isAssigned?:	boolean;
	isDisabled?:	boolean;
}

export interface PresbyQuery { presbies: Presbies }
export type Presbies = Presby[];
export interface Presby {
	key:		string;
	id:			number;
	isActive:	boolean;
	last:		string;
	guests:		string[];
	guestings:	Guests;
	hostings:	Hosts;
	seats?:		number;
	unknown1?:	boolean;
	unknown2?:	boolean;
	email?:		string;
	home?:		string;
	cell?:		string;
	smail?:		string;
	city?:		string;
	st?:		string;
	zip?:		string;
	mmail?:		string;
}
