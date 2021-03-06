

import { environment	} from '../../../../environments/environment';
import { Injectable		} from '@angular/core';
import { Version		} from '../../models/plan';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
	env:	any;
	debug:	boolean;
	ver!:	Version;
	
	constructor() {
		this.env	= environment;
		this.debug	= this.env.debug;
		console.log('>>> ScheduleService')
	}
}



/*
import { Schedule	} from '../../models/plan';
	unHosts:	{[key: string]: any} = [];
	schedule!:	Schedule;
	unGuests:	{[key: string]: any} = [];
	aGuests:	{[key: string]: any} = [];
	aHosts:		{[key: string]: any} = [];
	findUniqHosts ( events: string[] ): any[] {
		const returnArray = [];
		for ( let e1 = 0, e1Len = events.length; e1 < e1Len; e1++ ) {											// requested event-plan-list loop
			const e1Name = events[e1];
			for ( let h1 = 0, h1Len = this.unHosts[e1Name].length; h1 < h1Len; h1++ ) {							// requested host loop
				const searchObj	= { event: e1Name, host: this.unHosts[e1Name][h1].hostKey, unique: true };
				for ( let e2 = 0, e2Len = this.ver.events.length; e2 < e2Len; e2++ ) {							// comparison event-plan-list loop
					const e2Name = this.ver.events[e2].name;
					if ( e1Name !== e2Name ) {
						if (this.debug) console.log( '\t\t', e2Name );
						for ( let h2 = 0, h2Len = this.unHosts[e2Name].length; h2 < h2Len; h2++ ) {				// comparison host loop
							if (this.debug) console.log( '\t\t\t', this.unHosts[e2Name][h2].hostKey );
							if ( searchObj.host === this.unHosts[e2Name][h2].hostKey ){
								searchObj.unique = false;
								break
							}
						}
					}
					if (!searchObj.unique) break
				}
				if (searchObj.unique) returnArray.push(searchObj)
			}
		}
		console.log( 'return array:', returnArray );
		return returnArray
	}
loadVersion ( version: Version ) {
	console.log( 'LOADING VERSION:', version )
	return this.presbyS.watch().valueChanges.pipe( map(result => {
		const actives	= result.data.presbies;
		this.ver		= version;
		// for ( let e = 0, eLen = this.ver.events.length; e < eLen; e++ ) {
		for ( const event-plan-list of this.ver.events ) {
			const evt = event-plan-list.name;
			this.aHosts[evt]	= [];
			this.unHosts[evt]	= [];
			this.aGuests[evt]	= [];
			this.unGuests[evt]	= [];
		}
		
		for ( const event-plan-list of this.ver.events ) {
			const evt = event-plan-list.name;

			for ( const active of actives )	{
				let hCnt = 0;
				let gCnt = 0;

				for ( const hosting of active.hostings ) {
					if ( hosting.event-plan-list === evt ) {																	// presby record --> hosting record
						hosting.hostName	= active.last;
						hosting.hostKey		= active.last + '-' + active.id + '-' + active.seats + '-' + active.guests.length;
						hosting.seats		= active.seats;
						hosting.isDisabled	= false
						hosting.id			= JSON.parse( JSON.stringify( active.id		));
						hosting.guests		= JSON.parse( JSON.stringify( active.guests ));
						this.unHosts[hosting.event-plan-list].push( hosting );
					}
					hCnt++;
				}
				if ( active.guestings.length > 0 ) {
					for ( const guesting of active.guestings ) {													// for ( let g = 0, gLen = guestings.length; g < gLen; g++ ) {
						if ( guesting.event-plan-list === evt ) {																// presby record --> guest-plan-list record
							
							// if ( !( 'guests' in guesting ))  guesting.guests = JSON.parse( JSON.stringify( active.guests ));
							guesting.guests		= [...active.guests]
							
							guesting.id		 	= JSON.parse( JSON.stringify( active.id		));
							guesting.partyName 	= JSON.parse( JSON.stringify( active.last	));
							guesting.guestKey	= active.last + '-' + active.id + '-' + active.seats + '-' + active.guests.length;
							this.unGuests[guesting.event-plan-list].push( guesting );
						}
						gCnt++;
					}
				}
			}
		}
		// this.schedule = { aGuests: this.aGuests, aHosts: this.aHosts, unGuests: this.unGuests, unHosts: this.unHosts, actives };
		return this.schedule
	}))
}
*/
