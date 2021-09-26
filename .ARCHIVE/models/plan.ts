
// sched: { assignedHosts?: {[key: string]: any}; assignedGuests?:{[key: string]: any}; unassignedHosts?: {[key: string]: any}; unassignedGuests?: {[key: string]: any}; actives?: Presbies; } = {};

export interface Schedule  {
	unGuests:	{[key: string]: Guests	};
	aGuests:	{[key: string]: Guests	};
	unHosts:	{[key: string]: Hosts	};
	aHosts:		{[key: string]: Hosts	};
	actives:	Presbies
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
	eventName:		string;
	seats?:			number;
	hostKey?:		string;
	id?:			number;
	guests?:		Guests;
	hostName?:		string;
	isAssignable?:	boolean;
	isAssigned?:	boolean;
	isDisabled?:	boolean;
}

export type Guests = Guest[];
export interface Guest {
	eventName:		string;
	guestKey?:		string;
	id?:			number;
	guests?:		string[];
	partyName?:		string;
	cnt?:			number;
	isAssignable?:	boolean;
	isAssigned?:	boolean;
	isDisabled?:	boolean;
}

export type Presbies = Presby[];
export interface Presby {
	active:		boolean;
	id:			number;
	// name:	string;
	last:		string;
	guests:		string[];
	hostSeats:	number;
	hosting:	Hosts;
	guesting:	Guests;
	U?:			boolean;
	S?:			boolean;
	email?:		string;
	home?:		string;
	cell?:		string;
	smail?:		string;
	city?:		string;
	st?:		string;
	zip?:		string;
	mmail?:		string;
}
