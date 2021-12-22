

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
