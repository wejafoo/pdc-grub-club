

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
	seats:			number;
	hostName?:		string;
	assigned?:		boolean;
	assignable?:	boolean;
	disabled?:		boolean;
	guests?:		Guests;
	id?:			number;
}

export type Guests = Guest[];
export interface Guest {
	id:				number;
	partyName:		string
	eventName:		string;
	guests?:		string[];
	cnt?:			number;
	assigned:		boolean;
	disabled?:		boolean;
	assignable?:	boolean;
}

export interface Presby {
	active:		boolean;
	id:			number;
	name:		string;
	last:		string;
	guests:		string[];
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
