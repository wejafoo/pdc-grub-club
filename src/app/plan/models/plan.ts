

export type Plans	= Plan[];
export type Events	= Event[];
export type Guests	= Guest[];
export type Hosts	= Host[];

export interface Plan {
	id:			number;
	name:		string;
	events:		Events;
}

export interface Event {
	id:			number;
	name:		string;
	hosts?:		Hosts;
}

export interface Host {
	id:			number;
	name:		string;
	seats:		number;
	guests?:	Guests;
}

export interface Guest {
	id:			number;
	rsvps:		number;
}
