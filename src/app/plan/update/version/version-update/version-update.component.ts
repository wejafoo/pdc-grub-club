

import { environment		} from '../../../../../environments/environment';
import { Component			} from '@angular/core';
import { OnInit				} from '@angular/core';
import { ActivatedRoute		} from '@angular/router';
import { Router				} from '@angular/router';
import { moveItemInArray	} from '@angular/cdk/drag-drop';
import { CdkDrag			} from '@angular/cdk/drag-drop';
import { CdkDropList		} from '@angular/cdk/drag-drop';
import { transferArrayItem	} from '@angular/cdk/drag-drop';
import { CdkDragDrop		} from '@angular/cdk/drag-drop';
import { Apollo				} from 'apollo-angular';
import { gql				} from 'apollo-angular';
import { isObject			} from 'lodash';
import { PlanService		} from '../../../services/plan.service';
import { Presby				} from '../../../../../../.ARCHIVE/models/plan';
import { Schedule			} from '../../../../../../.ARCHIVE/models/plan';
import { Version			} from '../../../../../../.ARCHIVE/models/plan';
import { Presbies			} from '../../../../../../.ARCHIVE/models/plan';

export type Query = { presbies: Presbies }

@Component({
	selector: 'app-version-update',
	templateUrl: './version-update.component.html',
	styleUrls: ['./version-update.component.sass']
})

export class VersionUpdateComponent implements OnInit {
	env:		any;
	debug:		boolean;
	error:		any;
	events!:	string[];
	planId!:	number;									// provided by router param - "plan/X"
	versionId!:	number;									// provided by router param - "version/X"
	loadedVer!:	Version;
	ver!:		Version;
	sched!:		Schedule
	presbies:	Array<Presby> = [];
	actives:	Array<Presby> = [];
	aHs: 		{[key: string]: any[]	}	= {};		// assigned		hosts
	unHs:		{[key: string]: any[]	}	= {};		// unassigned	hosts
	aGs:		{[key: string]: any		}	= {};		// assigned		guests
	unGs: 		{[key: string]: any[]	}	= {};		// unassigned	guests
	summary:	{[key: string]:	any		}	= {};
	pairs: 		{[key: string]: any[]	}	= {};
	loaded		= false;
	step		= 1;									// accordion panel previous/next order control default
	isOpen		= false;								// toggle between peeps/card views
	QUERY		= gql`{ presbies { key id isActive last guests guestings { event seats } hostings { event seats } seats U S email home cell smail city st zip mmail }}`;
	objKeys 	= Object.keys;
	
	constructor (
		public route:	ActivatedRoute,
		public router:	Router,
		public apollo:	Apollo,
		public planSvc:	PlanService,
	) {
		this.env	= environment;
		this.debug	= this.env.debug;
	}
	
		///////////////////////////////
	////  COMPONENT LIFECYCLE STUFF  //////////////////////////////////////////////////////////////////////////////////////////////
	ngOnInit() {
		this.planId			= Number( this.route.snapshot.paramMap.get( 'planId'	));
		this.versionId		= Number( this.route.snapshot.paramMap.get( 'versionId'	));
		this.planSvc.setPlanVersion( this.planId, this.versionId );
		this.ver			= JSON.parse( JSON.stringify( this.planSvc.getVersion()));
		this.events			= this.ver.events.map( event => event.name );
		for ( const evt of this.events ) {
			this.aHs[evt]	= [];
			this.unHs[evt]	= [];
			this.aGs[evt]	= {};
			this.unGs[evt]	= [];
		}
		this.apollo.watchQuery<Query>({ query: this.QUERY }).valueChanges.subscribe(result => {
			this.error		= result.error;
			this.presbies	= result.data.presbies;
			this.actives	= this.presbies.filter( presby => presby.isActive );
			this.sched		= { aGs: this.aGs, aHs: this.aHs, unGs: this.unGs, unHs: this.unHs, actives: this.actives };
			const pairs: {[key: string]: string[]} = {};
			for ( const a1 of this.actives ) {
				pairs[a1.key] = [];
				for ( const a2 of this.actives ) { if ( a1 !== a2 ) { pairs[a1.key].push( a2.key )}}
			}
			this.summary.pairs			= JSON.parse( JSON.stringify( pairs ));
			this.summary.refreshPairs	= JSON.parse( JSON.stringify( pairs ));
			for ( const evt of this.events ) { this.loadActives(evt) }
			this.assignAllUniqHosts();
			this.autoAllocateHosts('all' );
			this.autoAssignGuests('all' );
			this.loaded	= true;
			if (this.debug) console.log( 'SCHEDULE:',	this.sched		);
			if (this.debug) console.log( 'SUMMARY:',	this.summary	);
		})
	}
	
	loadActives( evt: string ) {
		if (this.debug) console.log( '>>> loadActives()\t', evt );
		// 																												//  LOAD HOSTING OBJECTS
		for ( const active of this.actives ) {
			if (this.debug) console.log( '\tloadActives()\t\thost:', active.key );
			const hostings	= active.hostings
			const activeObj	= Object.assign({}, active );
			let hCnt = 0;
			for ( const hosting of hostings ) {
				if (this.debug) console.log( '\tloadActives()\t\t\tevent:', hosting.event );
				const hostingObj = Object.assign({}, hosting );
				if ( hostingObj.event === evt ) {
					hostingObj.id		= JSON.parse( JSON.stringify( activeObj.id ));
					hostingObj.hostName	= activeObj.last;
					hostingObj.hostKey	= activeObj.last + '-' + activeObj.id + '-' + activeObj.seats + '-' + activeObj.guests.length;
					if ( ! ( 'guests'	in hostingObj )) { hostingObj.guests = JSON.parse( JSON.stringify( activeObj.guests ))}
					if ( ! ( 'seats'	in hostingObj )	||	hostingObj.seats === null ) { hostingObj.seats = activeObj.seats }
					this.unHs[evt].push( hostingObj );
				}
				hCnt++;
		}}
		// 																												//  LOAD GUESTING OBJECTS
		for ( const active of this.actives ) {
			if (this.debug) console.log( '\tloadActives()\t\tguest:', active.key );
			const activeObj	= Object.assign({}, active );
			let gCnt		= 0;

			for ( const guesting of activeObj.guestings ) {
				if (this.debug) console.log( '\tloadActives()\t\t\tevent:', guesting.event );
				const guestingObj = Object.assign({}, guesting);
				if ( guestingObj.event === evt ) {																		// ADD PRESBY FIELDS TO GUESTING OBJECT
					if ( ! ('cnt' in guestingObj) || guestingObj.cnt === null ) { guestingObj.cnt		= activeObj.guests.length	}
					if ( ! ( 'guests' in guestingObj ))							{ guestingObj.guests	= activeObj.guests			}
					guestingObj.id			= JSON.parse( JSON.stringify( activeObj.id		));
					guestingObj.partyName	= JSON.parse( JSON.stringify( activeObj.last	));
					guestingObj.guestKey	= activeObj.last + '-' + activeObj.id + '-' + activeObj.seats + '-' + activeObj.guests.length;
					this.unGs[evt].push( guestingObj );
				}
				gCnt++;
		}}
		// 																												//  EVENT SUMMARY
		let accumSeatCnt	= 0;
		this.summary[evt]	= {guests: [], rsvps: 0, seatCnt: accumSeatCnt, allocatedSeatCnt: accumSeatCnt, assignedSeatCnt: 0, overAllocatedSeatCnt: 0, overAssignedSeatCnt: 0, overAssignedGuestCnt: 0, unAllocatedSeatCnt: 0, unAllocatedHostCnt: 0}
		this.summary[evt].unAllocatedHostCnt = this.unHs[evt].length
		for ( const host of this.unHs[evt] ) { this.summary[evt].unAllocatedSeatCnt	+= host.seats }
		if (this.debug) console.log( '\tloadActives()\t\tinit event:', evt );
		// 																												//  HOST SUMMARY
		for ( const host of this.unHs[evt] ) {
			const hst = host.hostKey;
			accumSeatCnt = accumSeatCnt + host.seats
			this.summary[evt][hst]					= { isAllocated: false, guests: [...host.guests], hosts: [...host.guests], seats: host.seats, assignedGuestCnt: 0, assignedSeatCnt: 0, overAssignedSeatCnt: 0, overAssignedGuestCnt: 0, unAssignedSeatCnt: host.seats}
			this.summary[evt].seatCnt				=	accumSeatCnt;
			this.summary[evt].assignedSeatCnt		+=	this.summary[evt][hst].guests.length;
			this.summary[evt][hst].assignedSeatCnt	=	this.summary[evt][hst].guests.length;
			this.summary[evt][hst].assignedGuestCnt	=	this.summary[evt][hst].guests.length;
			if (this.debug) console.log( '\tloadActives()\t\t\thost:\t', hst, '\twith guests:\t', this.summary[evt][hst].guests );
		}
		// 																												//  GUEST SUMMARY
		for ( const gst of this.unGs[evt] ) {
			this.summary[evt].rsvps += gst.guests.length
			if (this.debug) console.log( '\tloadActives()\t\t\tguest:\t', gst.guestKey, '\tRSVP\'d for:\t', gst.guests.length );
		}
		if (this.debug) console.log( '<<< loadActives()', JSON.parse( JSON.stringify( this.summary )) );
	}

	calcTotals( logMessage: string, event?: string, host?: string, ) {
		if ( event ) { if (this.debug) console.log( '\ncalcTotals()\trequest:', logMessage, 'event:', event, 'host:', host  )} else { if (this.debug) console.log( '\ncalcTotals()\trequest:', logMessage, this.aGs )}
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// THE GOAL:	IDEALLY, ALL CALCULATIONS WOULD BE HERE AND, OF COURSE,
		// 					BE IDEMPOTENT AND PROCESSED USING A FUNCTIONAL PATTERN SIMILAR TO QUEUE PROCESSING
		//  All calculations below that require specific event or host to do the calculation should ultimately be
		//      replaced by an entry here that is capable of obtaining the same result without arguments being sent,
		//      	preferably processed holistically across all events, hosts, etc.
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////
		const events = Object.keys( this.aGs );
		for ( const evt of events ) {																					// calculate via event index
			if (this.debug) console.log( 'calcTotals()\t\tevent:', evt );
			if (this.debug) console.log( 'calcTotals()\t\t\tCalculating...');
			let accumUnAssignedGuests = 0;
			for ( const gst of this.unGs[evt] ) { accumUnAssignedGuests += gst.cnt }
			this.summary[evt].unAssignedGuestCnt	= accumUnAssignedGuests;
			let accumAllocatedSeats = 0;
			for ( const hst of this.aHs[evt] ) { accumAllocatedSeats += hst.seats }
			this.summary[evt].allocatedSeatCnt		= accumAllocatedSeats;
			this.summary[evt].assignedSeatCnt		= this.summary[evt].guests.length;
			this.summary[evt].assignedGuestCnt		= this.summary[evt].guests.length;
			this.summary[evt].overAllocatedSeatCnt	= this.summary[evt].allocatedSeatCnt	- this.summary[evt].rsvps;
			this.summary[evt].unAssignedSeatCnt		= this.summary[evt].allocatedSeatCnt	- this.summary[evt].assignedSeatCnt;
			this.summary[evt].overAssignedGuestCnt	= this.summary[evt].assignedGuestCnt	- this.summary[evt].rsvps;
			this.summary[evt].overAssignedSeatCnt	= this.summary[evt].assignedSeatCnt		- this.summary[evt].allocatedSeatCnt;
			if (this.debug) console.log( 'calcTotals()\t\t\t\tunassigned guests:\t\t\t',		this.summary[evt].unAssignedGuestCnt	);
			if (this.debug) console.log( 'calcTotals()\t\t\t\tallocated seats:\t\t\t',			this.summary[evt].allocatedSeatCnt		);
			if (this.debug) console.log( 'calcTotals()\t\t\t\tassigned seats:\t\t\t\t',			this.summary[evt].assignedSeatCnt		);
			if (this.debug) console.log( 'calcTotals()\t\t\t\tassigned guests:\t\t\t',			this.summary[evt].assignedGuestCnt		);
			if (this.debug) console.log( 'calcTotals()\t\t\t\tallocated over/under:\t\t',		this.summary[evt].overAllocatedSeatCnt	);
			if (this.debug) console.log( 'calcTotals()\t\t\t\tunassigned seats:\t\t\t',			this.summary[evt].unAssignedSeatCnt		);
			if (this.debug) console.log( 'calcTotals()\t\t\t\tassigned guests over/under:\t',	this.summary[evt].overAssignedGuestCnt	);
			if (this.debug) console.log( 'calcTotals()\t\t\t\tassigned seats over/under:\t',	this.summary[evt].overAssignedSeatCnt	);
			let nextHostToAssignCount				= 0;
			this.summary[evt].nextAutoAssignHost	= '<undefined>';
			for ( const hst in this.aGs[evt] ) {
				if (this.debug) console.log( 'calcTotals()\t\t\thost:', hst, 'allocated?', this.summary[evt][hst].isAllocated, this.summary[evt][hst].guests );
				this.summary[evt][hst].assignedGuestCnt			= this.summary[evt][hst].guests.length;
				this.summary[evt][hst].assignedSeatCnt			= this.summary[evt][hst].guests.length;
				this.summary[evt][hst].unAssignedSeatCnt		= this.summary[evt][hst].seats			- this.summary[evt][hst].guests.length;
				this.summary[evt][hst].overAssignedSeatCnt		= this.summary[evt][hst].guests.length	- this.summary[evt][hst].seats;
				this.summary[evt][hst].overAssignedGuestCnt		= this.summary[evt][hst].guests.length	- this.summary[evt][hst].seats;
				if (this.debug) console.log( 'calcTotals()\t\t\t\t\tBTW, is', hst + '\'s remaining seats:', this.summary[evt][hst].unAssignedSeatCnt, '\t > \t', nextHostToAssignCount, this.summary[evt].nextAutoAssignHost + '\'s remaining' );
				if ( this.summary[evt][hst].unAssignedSeatCnt > nextHostToAssignCount ) {
					if (this.debug) console.log( 'calcTotals()\t\t\t\t\t\tGood, using:', hst, 'for next auto-assignment, continuing...' );
					nextHostToAssignCount					= this.summary[evt][hst].unAssignedSeatCnt;
					this.summary[evt].nextAutoAssignHost	= hst;
				} else { if (this.debug) console.log( 'calcTotals()\t\t\t\t\t\tk, keeping:', this.summary[evt].nextAutoAssignHost, 'for the next assignment, moving along...' )}
				
				if (this.debug) console.log( 'calcTotals()\t\t\t\t\t\tCalculating guest counts for:', hst );
				
				let addUpGuests = 0;
				for ( const gst of this.aGs[evt][hst] ) {
					addUpGuests += gst.cnt;
					if (this.debug) console.log( 'calcTotals()\t\t\t\t\t\t\treviewing guest:', gst.guestKey );
				}
				if (this.debug) console.log( 'calcTotals()\t\t\t\t\t\t\t\t', addUpGuests + ' RSVP(s) currently assigned to:', hst, 'which should match:', this.summary[evt][hst].assignedGuestCnt );
				if (this.debug) console.log( 'WELL, DOES IT??? host summary:' );
				if (this.debug) console.log( hst, this.summary[evt] );
			}}
		if ( event && host ) { return this.summary[event][host][logMessage]	} else if ( event ) { return this.summary[event][logMessage] }
	}
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//
	// 																				////////////////////////////
	////////////////////////////////////////////////////////////////////////////////  ALL MAGIC HAPPENS HERE //////////
	allocateHost( evt: string, hst: string, prevHostIndex: number, hostDrop?: CdkDragDrop<any[]> ) {
		if (this.debug) console.log( '\t>>> allocateHosts()\tevent:', evt, '\thost:', hst, '\tidx:', prevHostIndex );
		let newHostIndex: number;
		if ( hostDrop ) { transferArrayItem( hostDrop.previousContainer.data, hostDrop.container.data, hostDrop.previousIndex, hostDrop.currentIndex )} else {
			newHostIndex = ( this.aHs[evt].push( ...this.unHs[evt].splice( prevHostIndex, 1 ))) - 1;
			if (this.debug) console.log( '\t>>> allocateHosts()\t\thost:', this.aHs[evt][newHostIndex].hostKey );
			this.summary[evt].guests.push( ...this.aHs[evt][newHostIndex].guests );
			if (this.debug) console.log( '\t>>> allocateHosts()\t\tsummary host:', this.summary[evt].guests );
			this.summary[evt][hst].isAllocated	= true;
			if (this.debug) console.log( '\t>>> allocateHosts()\t\t\tsummary host allocation flag:', this.summary[evt][hst].isAllocated );
		}
		this.disableOtherHostings( evt, hst, true );
		let unAssignedGuestIndex		= 0;
		const tmpUnAssignedGuestIndex	= this.unGs[evt].findIndex( guest => guest.guestKey === hst )
		for ( const unG of this.unGs[evt] ) {
			const gst = unG.guestKey
			if ( hst === gst ) {
				this.aGs[evt][hst] = [];
				if (this.debug) console.log( '\t\tallocateHost()\t\t\tDo numbers match?', tmpUnAssignedGuestIndex, '<--->', unAssignedGuestIndex );
				if (this.debug) console.log( '\t\tallocateHost()\t\t\t\tIf so, YAY !!! just remove this for-of in lieu of Array.findIndex' );
				this.assignGuest( evt, hst, gst, unAssignedGuestIndex );
				break;
			} else { unAssignedGuestIndex++ }
		}
		if (this.debug) console.log( '\t<<< allocateHosts()\t', this.aGs[evt][hst].length, 'host(s) allocated!' );
		this.calcTotals( 'allocateHost()' );
	}
	
	assignGuest( evt: string, hst: string, gst: string, prevGuestIndex: number, guestDrop?: CdkDragDrop<any[]> ): boolean {
		if (this.debug) console.log ( '\t\t>>> assignGuest() evt:', evt, 'hst:', hst, 'gst:', gst, 'idx:', prevGuestIndex );
		let success = false;
		if ( hst === gst ) {
			const newGstIdx = this.aGs[evt][hst].push( ...this.unGs[evt].splice( prevGuestIndex, 1 )) - 1;	// NOTE: push() returns length, "-1" returns the index
			this.aGs[evt][hst][newGstIdx].isDisabled = true;
			success	 = true;
		} else {
			if ( this.aGs[evt][hst].every(( prevAssignedGuest: { guestKey: string }) => {
				if (this.debug) console.log ( '\t\t\tassignGuest() paired?', this.summary.pairs[gst].includes( prevAssignedGuest.guestKey ));
				return this.summary.pairs[gst].includes( prevAssignedGuest.guestKey );
			})) {
				
				
				
				
				this.summary[evt].guests.push		( ...this.unGs[evt][prevGuestIndex].guests );
				this.summary[evt][hst].guests.push	( ...this.unGs[evt][prevGuestIndex].guests );
				
				
				
				
				
				if ( guestDrop ) {
					if (this.debug) console.log ( '\t\t\t\tassignGuest() GUEST DROP EVENT ALLOWED BY RULE TO FIRE!' );
					
					const leaveArray = [];
					transferArrayItem( guestDrop.previousContainer.data, guestDrop.container.data, guestDrop.previousIndex, guestDrop.currentIndex )	// CDK drag/drop magic
					if ( guestDrop.previousContainer.id !== 'unassigned') {
						const pushGuests	= guestDrop.previousContainer.data;																			// previous container guests
						const pushGuest		= guestDrop.item.data;																						// dropped guest
						leaveArray.push( ...pushGuests );
						for ( const guest of leaveArray ) {
							if (this.debug) console.log( '\t\tassignGuest()\t\tadding back...', pushGuest.guestKey, '\t\tto:\t', guest.guestKey );
							this.summary.pairs[guest.guestKey].push( pushGuest.guestKey );																// return un-assigned guests back to exiting guest pair list
							if (this.debug) console.log( '\t\tassignGuest()\t\tadding back...', guest.guestKey, '\t\tto:\t', pushGuest.guestKey );
							this.summary.pairs[pushGuest.guestKey].push( guest.guestKey );																// ...and vice-versa
						}
					}
				} else {
					if ( this.aGs[evt][hst].push( ...this.unGs[evt].splice( prevGuestIndex, 1 )) > 0 ) {				// ASSIGN!!!
						for ( let gst1 = 0, gst1Len = this.aGs[evt][hst].length;	gst1 > gst1Len;		gst1++ ) {		// Reconcile pairs object to assignment
							const prevAssignedGuest = this.aGs[evt][hst][gst1].guestKey;
							this.aGs[evt][hst].every(( guest: any ) => { if (this.debug) console.log('\t\t', guest )});
							this.aGs[evt][hst].every(( guest: any ) => this.summary.pairs[gst].splice( this.summary.pairs[prevAssignedGuest].indexOf( guest.guestKey ), 1 ));
						}
						success = true;
					} else { success = false }
				}
				this.pairsByMonth(evt);
				this.calcTotals('autoAssignGuests()');
			} else {
				if ( guestDrop ) window.alert( 'derp - collision!' + evt + hst + gst );
				success = false;
		}}
		if (this.debug) console.log ( '\t\t<<< assignGuest()' );
		this.calcTotals( 'assignGuest()' );
		return success;
	}
	// 																								//////////////////
		///////////////////  ///////////////////////////////////////////////////////////////////////  GUEST STUFF  /////
	////  ASSIGN GUESTS /////////////////////////////////////////////////////////////////////////////////////////////////
	autoAssignGuests( scope: string ) {
		if (this.debug) console.log( '\t>>> autoAssignGuests()\tscope:', scope );
		let events: string[];
		if ( scope === 'all' ) { events = Object.keys(this.unGs) } else { events = [scope] }
		for ( const evt of events ) {
			let cnt				= 0;
			let startMarker		= 0;
			const hosts			= Object.keys( this.aGs[evt] );
			const startUnGsCnt	= this.unGs[evt].length;
			this.unGs[evt].sort(() => Math.random() - 0.5 );																			// randomize auto-assignment order...
			this.unGs[evt].sort(( a: { guests: string[] }, b: { guests: string[] } ) => b.guests.length - a.guests.length );  		// ...then re-sort, so that large groups auto-assign first
			if (this.debug) console.log(
				'All of the following conditions must be met to assign guests for:\t\t', evt,
				'\nassigned seats:\t\t\t',	this.summary[evt].assignedSeatCnt,			'\t < \t',		this.summary[evt].rsvps,			'\t:guest count',
				'\nassigned seats:\t\t\t',	this.summary[evt].assignedSeatCnt,			'\t < \t',		this.summary[evt].allocatedSeatCnt, '\t:allocated seats',
				'\nunassigned guests:\t\t',	this.summary[evt].unAssignedGuestCnt,		'\t > \t0\t\t:no more guests left to assign',
				'\ncount:\t\t\t\t\t',	cnt,										  '\t\t < \t',	startUnGsCnt, 						'\t:stop gap to avoid endlessness',
			);
			while (	this.summary[evt].assignedSeatCnt		< this.summary[evt].rsvps				&&	// assigned seats inexplicably greater than initial total guests
					this.summary[evt].assignedSeatCnt		< this.summary[evt].allocatedSeatCnt	&&	// No more seats to assign
					this.summary[evt].unAssignedGuestCnt	> 0										&&	// No more guests to assign
					cnt										< startUnGsCnt								// Just failsafe for infinite loop (which, of course, shouldn't ever happen :))
			) {
				cnt++;
				const nextHost	= this.summary[evt].nextAutoAssignHost;
				const nextGuest = this.unGs[evt][startMarker].guestKey;
				if (this.debug) console.log( '\t\tautoAssignGuests()\t\tnext auto-assignment host:\t',	nextHost	);
				if (this.debug) console.log( '\t\tautoAssignGuests()\t\tnext auto-assignment guest:\t',	nextGuest	);
				for ( const hst of hosts ) {
					if ( hst === nextHost ) {
						const wasGoodAssignment = this.assignGuest( evt, hst, nextGuest, startMarker )
						if ( ! wasGoodAssignment ) {
							if (this.debug) console.log( '\tPAIR CONFLICT -- The following assignment was aborted:\t\t', nextGuest, '\t\tto event:\t\t', evt + '-' + hst );
							startMarker++;
						}
						break;
			}}}
			this.pairsByMonth(evt);
		}
		if (this.debug) console.log( '\t<<< autoAssignGuests()' );
	}

	dropGuest ( guestDrop: CdkDragDrop<any[]>, evt: string  ) {		// should work for unassigned -> host ...or... host -> host
		if ( guestDrop.previousContainer === guestDrop.container ) {
			if (this.debug) console.log( 'dropGuest()\tevent summary:', this.summary, this.aGs, guestDrop );
			moveItemInArray( guestDrop.container.data, guestDrop.previousIndex, guestDrop.currentIndex )
		} else {
			let prevGuestIdx:		number;
			let dropContainerId:	string;
			let guestKey:			string;
			if ( guestDrop.previousContainer.id === 'unassigned' ) {  // TODO: Address origin container shenanigans
				prevGuestIdx	= guestDrop.previousIndex;
				dropContainerId	= guestDrop.container.id
				guestKey		= this.unGs[evt][prevGuestIdx].guestKey!;
			} else {
				prevGuestIdx	= guestDrop.previousIndex;
				dropContainerId	= guestDrop.container.id
				guestKey		= guestDrop.item.data.guestKey;
			}
			this.assignGuest( evt, dropContainerId, guestKey, prevGuestIdx, guestDrop );
	}}
	/////////////////////
	//  DE-ASSIGN GUEST  ///////////////////////////////////////////////////////////////////////////////////////////////////
	unDropGuest ( guestDrop: CdkDragDrop<any[]>, evt: string  ) {														// host -> unassigned ...or... unassigned -> unassigned
		if ( guestDrop.previousContainer === guestDrop.container ) {
			if (this.debug) console.log( 'unDropGuest()\tevent summary:', this.summary, this.aGs, guestDrop );
			moveItemInArray( guestDrop.container.data, guestDrop.previousIndex, guestDrop.currentIndex );
		} else {
			const guestIdx	= guestDrop.previousIndex;
			const hostKey	= guestDrop.previousContainer.id;
			const guestKey	= guestDrop.item.data.guestKey;
			this.deAssignGuest( evt, hostKey, guestKey, guestIdx, guestDrop  );
	}}
	deAssignGuest( evt: string, hst: string, gst: string, prevGuestIndex: number, guestDrop?: CdkDragDrop<any[]> ) {
		if ( guestDrop ) {
			this.dePairGuest( evt, hst, gst, guestDrop )
			transferArrayItem( guestDrop.previousContainer.data, guestDrop.container.data, guestDrop.previousIndex, guestDrop.currentIndex )
		} else {
			if (this.debug) console.log( 'deAssignGuest()\t\t\t\tNO DROP OBJECT FOUND -- manual push/enable -- re-assignment ready -- guest:', gst, 'event:', evt + '("unassigned")', 'idx:', prevGuestIndex );
			this.dePairGuest( evt, hst, gst )
			this.unGs[evt][this.unGs[evt].push( ...this.aGs[evt][hst].splice( prevGuestIndex, 1)) - 1].isDisabled	= false;
	}}
	dePairGuest(  evt: string, hst: string , gst: string, guestDrop?: CdkDragDrop<any[]> ) {
		const leaveGuests = [];
		if ( guestDrop ) { leaveGuests.push( ... JSON.parse( JSON.stringify( guestDrop.previousContainer.data )))} else { leaveGuests.push( ... JSON.parse( JSON.stringify( this.aGs[evt][hst] )))}
		for ( const guest of leaveGuests ) {
			if ( gst !== guest.guestKey ) {
				if (this.debug) console.log( 'dePairGuest()\t\t\t\tde-pairing guest:\t', gst, '\tfrom guest:\t', guest.guestKey );
				this.summary.pairs[guest.guestKey].push( gst );																				// return un-assigned guests back to exiting guest pair list
				if (this.debug) console.log( 'dePairGuest()\t\t... and vice-versa guest:\t', guest.guestKey, '\tfrom guest:\t', gst );
				this.summary.pairs[gst].push( guest.guestKey );																				// ...and vice-versa
	}}}
	// 																										/////////////////
	// 		////////////////////////////////////////////////////////////////////////////////////////////////  HOST STUFF  /////////
	////////  AUTO HOST ASSIGNMENTS  //////////////////////////////////////////////////////////////////////////////////////////////
	autoAllocateHosts( scope: string ) {
		if (this.debug) console.log( 'autoAllocateHosts() >>>' );
		let events: string[];
		if ( scope === 'all' ) { events = Object.keys( this.unHs )} else { events = [scope]}
		events.every( event => this.unHs[event].sort(() => Math.random() - 0.5 ))											// randomize-ish auto-assign order
		for ( const evt of events ) {
			let hstIdx = 0;
			while  ( this.summary[evt].allocatedSeatCnt < this.summary[evt].rsvps  &&  this.unHs[evt][hstIdx] !== undefined  ) {
				if ( ! this.unHs[evt][hstIdx].isDisabled ) {
					const hst =  this.unHs[evt][hstIdx].hostKey
					this.allocateHost( evt, hst, hstIdx );
				} else {
					if (this.debug) console.log( 'autoAllocateHosts() \t\t\t\t !!!! Cannot assign host:\t', this.unHs[evt][hstIdx].hostKey, '\tto', evt, '...skipping' );
					hstIdx++
		}}}
		if (this.debug) console.log( '<<< autoAllocateHosts()' )
	}
	dropHost ( hostDrop: CdkDragDrop<any[]>, evt: string ) {
		if ( hostDrop.previousContainer === hostDrop.container ) {
			if (this.debug) console.log( 'dropHost()\tevent summary:', this.summary, this.aGs, hostDrop );
			moveItemInArray( hostDrop.container.data, hostDrop.previousIndex, hostDrop.currentIndex )
		} else {
			const hostIdx	= hostDrop.previousIndex;
			const hostKey	= hostDrop.previousContainer.data[hostIdx].hostKey;
			this.allocateHost( evt, hostKey, hostIdx, hostDrop );
	}}
	// 						///////////////////////
	////////////////////////  DE-ALLOCATE HOST  ////////////////////////////////////////////////////////////////////////////////
	unDropHost ( hostDrop: CdkDragDrop<any[]>, evt: string ) {
		if ( hostDrop.previousContainer === hostDrop.container ) {
			if (this.debug) console.log( 'dropHost()\tevent summary:', this.summary, this.aGs, hostDrop );
			moveItemInArray( hostDrop.container.data, hostDrop.previousIndex, hostDrop.currentIndex )
		} else {
			const hostKey	= hostDrop.item.data.hostKey;
			const hostIdx	= hostDrop.previousIndex;
			this.deAllocateHost( evt, hostKey, hostIdx, hostDrop )
	}}
	deAllocateHost( evt: string, hst: string, prevHostIndex: number, hostDrop?: CdkDragDrop<any[]> ) {
		if (this.debug) console.log( 'de-allocate -- event', evt, 'host:', hst, 'idx:', prevHostIndex, hostDrop );
		const unGuests = this.aGs[evt][hst]
		// EVENT-specific		// this.summary[evt].allocatedSeatCnt	-= this.unHs[evt][prevHostIndex].seats;
								// this.summary[evt].unAllocatedSeatCnt	+= this.unHs[evt][prevHostIndex].seats;
		// HOST-specific		// this.summary[evt][hst].isAllocated	= false;
		while ( unGuests.length > 0 ) {
			if (this.debug) console.log( 'de-assigning guest:', unGuests[0].guestKey )
			this.deAssignGuest( evt, hst, unGuests[0].guestKey, 0 )
		}
		delete this.aGs[evt][hst];
		if ( hostDrop ) {
			transferArrayItem( hostDrop.previousContainer.data, hostDrop.container.data, hostDrop.previousIndex, hostDrop.currentIndex );
		} else { this.unHs[evt].push( ...this.unHs[evt].splice( prevHostIndex, 1))}
		this.disableOtherHostings( evt, hst, false );
	}
	////////////////////
	//  MISC HELPERS  //////////////////////////////////////////////////////////////////////////////////////////////////////
	// loadVersion	( versionId: number ) {  if (this.debug) console.log( 'Loading version , version ID:', versionId, 'see version-update->loadVersion()' )}
	cancelVersion	() { this.toPlanUpdate()}
	nextStep		() { this.step++ }
	prevStep		() { this.step-- }
	reviewVersion	() { this.router.navigate(['/plan', this.planId, 'schedule']).then(r => { if (this.debug) console.log(r)})}
	toPlanUpdate	() { this.router.navigate(['/plan', this.planId, 'update']).then(r => { if (this.debug) console.log(r)})}
	toVersions		() { this.router.navigate(['/plan', this.planId]).then(r => { if (this.debug) console.log(r)})}
	save			() { this.loadedVer = JSON.parse( JSON.stringify(this.ver)); this.planSvc.addVersion(this.ver); this.reviewVersion()}
	setStep			( index: number ) { this.step = index }
	// canDeactivate(): Observable<boolean> | boolean { if ( JSON.stringify( this.loadedVer ) === JSON.stringify( this.ver )) { return true } else { return this.dialog.confirm( 'Abandon version changes?' )}}
	deepEqual( object1: any, object2: any ) {
		const keys1 = Object.keys( object1 );
		const keys2 = Object.keys( object2 );
		let rtnVal	= false
		if ( keys1.length !== keys2.length ) { return false } else {
			let val1: any;
			let val2: any;
			for ( const key1 of keys1 ) {
				for ( const key2 of keys2 ) {
					val1 = object1[key1];
					val2 = object2[key2];
					const areObjects = isObject( val1 )  &&  isObject( val2 );
					if ( areObjects ) { rtnVal = true } else { return false }
					// if (( areObjects  &&  ! this.deepEqual( val1, val2 ))  ||  ( ! areObjects  &&  val1 !== val2 )) { return false }
			}}
			return rtnVal;
	}}
	////////////////////
	//  HOST HELPERS  //////////////////////////////////////////////////////////////////////////////////////////////////////
	disableOtherHostings( evt: string, hst: string, disable: boolean ) {
		if (this.debug) console.log( '\t\t>>> disableOtherHostings() event:', evt, 'host:', hst, 'disable?', disable );
		const events = Object.keys( this.unHs );
		for ( const evt1 of events ) {
			for ( const unH of this.unHs[evt1] ) {
				if ( unH.hostKey ===  hst ) {
					if ( ! disable ) {
						if (this.debug) console.log( '\n\nWARNING: Re-enabling this host will force guest de-assignments in other events!!!\n\n' );
						const aEs = this.aGs[evt1];
						for ( const aH of aEs ) {
							let idxCnt = 0;
							for ( const aG of aH) { if ( unH.hostKey === aG.guestKey ) { this.deAssignGuest( evt1, aH.hostKey, aG.guestKey, idxCnt )} else { idxCnt++ }}
						}
					}
					unH.isDisabled = disable;
					break;
		}}}
		if (this.debug) console.log( '\t\t<<< disableOtherHostings()' );
	}
	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//  GUEST HELPERS
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	private pairsByMonth( evt: string ) {
		const hosts: any[] = Object.keys( this.aGs[evt] );
		for ( const hst of hosts ) {
			for ( const gst of hst ) {
				for ( const pair of hst ) {
					if ( pair.guestKey !== gst.guestKey ) {
						if ( this.summary.pairs[gst.guestKey].includes( pair.guestKey )) {
							if (this.debug) console.log( 'pairsByMonth()\t\t\tremoving...', pair.guestKey, 'from: ', gst.guestKey );
							this.summary.pairs[gst.guestKey].splice( this.summary.pairs[gst.guestKey].indexOf( pair.guestKey ), 1);
	}}}}}}
	pairsPredicate() {
		return ( gstDrag: CdkDrag, hstDrop: CdkDropList ) => {
			const guests: any	= [];
			const gst			= gstDrag.data.guestKey
			guests.push( ...hstDrop.data );
			return guests.every((guest: { guestKey: string }) => this.summary.pairs[gst].includes(guest.guestKey)) || hstDrop.id === 'unassigned';
		}
	}
	assignAllUniqHosts() {
		if (this.debug) console.log( '>>> assignAllUniqHosts()' );
		const events	= Object.keys( this.unHs );
		const uniqs		= [];
		for ( const evt1 of events ) {
			for ( const hst1 of this.unHs[evt1] ) {
				const searchObj	= { event: hst1.event, host: hst1.hostKey, unique: true };
				for ( const evt2 of events ) {
					if ( evt1 !== evt2 ) {
						for ( const hst2 of this.unHs[evt2] ) {
							if ( searchObj.host === hst2.hostKey ) {
								searchObj.unique = false;
								break
					}}}
					if ( ! searchObj.unique ) break
				}
				if ( searchObj.unique ) { uniqs.push( searchObj )}
		}}
		if (this.debug) console.log( '\tassignAllUniqHosts()\tunique hosts:', uniqs );
		for ( const uniq of uniqs ) {
			const uniqEvt	= uniq.event;
			const uniqHst	= uniq.host;
			for ( const evt of this.events ) {
				if ( evt === uniqEvt ) {
					let hCnt = 0;
					for ( const hst of  this.unHs[evt] ) {
						if ( hst.hostKey === uniqHst ) {
							this.allocateHost( evt, uniqHst, hCnt );
							break;
						}
						hCnt++;
		}}}}
		if (this.debug) console.log( '<<< assignAllUniqHosts()' );
}}
// private auditPairsByMonth( evt: string ) {	const hsts = Object.keys( this.aGs[evt] );	for ( const hst of hsts ) { const gsts	= this.aGs[evt][hst]; const pairs	= this.aGs[evt][hst];
// 		for ( const gst of gsts ) { for ( const pair of pairs ) { if ( pair.guestKey !== gst.guestKey ) { if ( this.summary.auditPairs[gst.guestKey].includes( pair.guestKey )) {this.summary.auditPairs[gst.guestKey].splice( this.summary.auditPairs[gst.guestKey].indexOf( pair.guestKey ), 1 )}}}}}}
