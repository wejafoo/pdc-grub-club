

import { environment	} from '../../../environments/environment';
import { Injectable		} from '@angular/core';

import { PresbyService	} from '../../presby/services/presby.service';
import { Schedule		} from '../../../../.ARCHIVE/models/plan';
import { Version		} from '../../../../.ARCHIVE/models/plan';

@Injectable({ providedIn: 'root' })

export class ScheduleService {
	env:		any;
	debug:		boolean;
	ver!:		Version;
	schedule!:	Schedule;
	
	unGuests:	{[key: string]: any} = [];
	aGuests:	{[key: string]: any} = [];
	unHosts:	{[key: string]: any} = [];
	aHosts:		{[key: string]: any} = [];
	
	constructor (
		private presbySvc: PresbyService
	) {
		this.env	= environment;
		this.debug	= this.env.debug
	}
	
	loadVersion ( version: Version ) {
		const actives	= this.presbySvc.getPresbyActive();
		this.ver		= version;
		for ( let e = 0, eLen = this.ver.events.length; e < eLen; e++ ) {												// event init
			const evt = this.ver.events[e].name;
			this.aHosts[evt]	= [];
			this.unHosts[evt]	= [];
			this.aGuests[evt]	= [];
			this.unGuests[evt]	= []
		}
		
		for ( let e = 0, eLen = this.ver.events.length; e < eLen; e++ ) {										// event loop
			const evt = this.ver.events[e].name;
			for ( let a = 0, aLen = actives.length; a < aLen; a++ ) {													// actives loop
				for ( let h = 0, seats = 0, hLen = actives[a].hosting.length; h < hLen; h++, seats++ ) {				// host loop
					if ( actives[a].hosting[h].eventName === evt ) {													// Push relevant fields from presby record to host record
						actives[a].hosting[h].hostName	= actives[a].last;
						actives[a].hosting[h].hostKey	= actives[a].last + '-' + actives[a].id + '-' + actives[a].hostSeats + '-' + actives[a].guests.length;
						actives[a].hosting[h].seats		= actives[a].hostSeats;
						actives[a].hosting[h].id		= JSON.parse( JSON.stringify( actives[a].id ));
						actives[a].hosting[h].guests	= JSON.parse( JSON.stringify( actives[a].guests ));
						this.unHosts[actives[a].hosting[h].eventName].push( actives[a].hosting[h])
					}
				}
				if ( actives[a].guesting.length > 0 ) {
					for ( let g = 0, gLen = actives[a].guesting.length; g < gLen; g++ ) {								// guest loop
						if ( actives[a].guesting[g].eventName === evt ) {												// Add fields from presby record to unassigned guest record
							if ( ! ( 'guests' in actives[a].guesting[g] )) {
								actives[a].guesting[g].guests = JSON.parse( JSON.stringify( actives[a].guests ))
							}
							actives[a].guesting[g].id		 = JSON.parse( JSON.stringify( actives[a].id	));
							actives[a].guesting[g].partyName = JSON.parse( JSON.stringify( actives[a].last	));
							actives[a].guesting[g].guestKey	 = actives[a].last + '-' + actives[a].id + '-' + actives[a].hostSeats + '-' + actives[a].guests.length;
							this.unGuests[actives[a].guesting[g].eventName].push( actives[a].guesting[g] )
						}
					}
				}
			}
		}
		this.schedule = { aGuests: this.aGuests, aHosts: this.aHosts, unGuests: this.unGuests, unHosts: this.unHosts, actives };
		return this.schedule
	}
	
	findUniqHosts ( events: string[] ): any[] {
		const returnArray = [];
		for ( let e1 = 0, e1Len = events.length; e1 < e1Len; e1++ ) {											// requested event loop
			const e1Name = events[e1];
			for ( let h1 = 0, h1Len = this.unHosts[e1Name].length; h1 < h1Len; h1++ ) {							// requested host loop
				const searchObj	= { event: e1Name, host: this.unHosts[e1Name][h1].hostKey, unique: true };
				for ( let e2 = 0, e2Len = this.ver.events.length; e2 < e2Len; e2++ ) {							// comparison event loop
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
					if ( ! searchObj.unique ) break
				}
				if ( searchObj.unique ) returnArray.push( searchObj )
			}
		}
		if (this.debug) console.log( 'return array:', returnArray );
		return returnArray
	}
}
