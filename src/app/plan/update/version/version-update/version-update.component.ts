

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
import { Observable			} from 'rxjs';
import { of					} from 'rxjs';
import { isObject			} from 'rxjs/internal-compatibility';
import { switchMap			} from 'rxjs/operators';
import { PlanService		} from '../../../services/plan.service';
import { ScheduleService	} from '../../../services/schedule.service';
import { DialogService		} from '../../../../services/dialog.service';
import { PresbyService		} from '../../../../presby/services/presby.service';
import { Schedule			} from '../../../../../../.ARCHIVE/models/plan';
import { Version			} from '../../../../../../.ARCHIVE/models/plan';

@Component({
	selector: 'app-version-update',
	templateUrl: './version-update.component.html',
	styleUrls: ['./version-update.component.sass']
})

export class VersionUpdateComponent implements OnInit {
	env:			any;
	debug:			boolean;
	planId!:		number;		// provided by router param - "plan/X"
	versionId!:		number;		// provided by router param - "version/X"
	loadedVer!:		Version;
	ver!:			Version;
	sched!:			Schedule
	aHs: 			{[key: string]: any		} = [];		// assigned		hosts
	unHs:			{[key: string]: any		} = [];		// unassigned	hosts
	aGs:			{[key: string]: any		} = [];		// assigned		guests
	unGs:			{[key: string]: any		} = [];		// unassigned	guests
	allGs:			{[key: string]: any		} = {};		// assigned		guests by all/event/host
	summary: 		{[key: string]:	any		} = {};
	pairs: 			{[key: string]: any[]	} = {};
	panelOpenState	= false;	// accordion panel open/close
	step			= 1;		// accordion panel previous/next order control default
	isOpen			= false;	// toggle between peeps/card views
	
	constructor (
		public	dialog:		DialogService,
		public	planSvc:	PlanService,
		public	presbySvc:	PresbyService,
		public	route:		ActivatedRoute,
		public	router:		Router,
		public	schedSvc:	ScheduleService
	) {
		this.env	= environment;
		this.debug	= this.env.debug
	}
	
	  ///////////////////////////////
	// 	COMPONENT LIFECYCLE STUFF  //////////////////////////////////////////////////////////////////////////////////////////////
	
	ngOnInit() {
		this.route.paramMap.pipe(switchMap(params => of(params.get( 'planId'		)))).subscribe(planId		=> this.planSvc.setPlan(+planId!));
		this.route.paramMap.pipe(switchMap(params => of(params.get( 'versionId'	)))).subscribe(versionId	=> {
			this.planSvc.setVersion( +versionId! );
			this.loadedVer								= this.planSvc.getVersion();
			this.ver									= JSON.parse( JSON.stringify( this.loadedVer ));					// version
			this.sched									= this.schedSvc.loadVersion( this.ver );							// schedule
			this.aHs									= this.sched.aHosts;												// allocated Hosts (usually empty)
			this.unHs									= this.sched.unHosts;												// unallocated Hosts
			this.aGs									= this.sched.aGuests;												// assigned Guests (usually empty)
			this.unGs									= this.sched.unGuests;												// unassigned Guests
			let unpairedGs:	any[]	 					= [];
			const pairs:	{[key: string]: string[]}	= {};
			for ( const unG in this.sched.unGuests ) { unpairedGs = unpairedGs.concat( this.sched.unGuests[unG]) } 			// Load uniq guestKeys from all events
			for ( let gst1 = 0, gst1Len = unpairedGs.length;	gst1 < gst1Len;		gst1++ ) {
				if ( pairs[unpairedGs[gst1].guestKey] === undefined ) {
					pairs[unpairedGs[gst1].guestKey] = [];
					for ( let gst2 = 0, gst2Len = unpairedGs.length;	gst2 < gst2Len;		gst2++ ) {
						if (( unpairedGs[gst1].guestKey !== unpairedGs[gst2].guestKey )  && ( !( pairs[unpairedGs[gst1].guestKey].includes(unpairedGs[gst2].guestKey)))){
							pairs[unpairedGs[gst1].guestKey].push( unpairedGs[gst2].guestKey )
						}
					}
				}
			}
			this.summary.pairs			= JSON.parse( JSON.stringify( pairs ));
			this.summary.refreshPairs	= JSON.parse( JSON.stringify( pairs ));		// set aside for audit/testing refresh support

			this.assignAllUniqHosts();
			this.autoAllocateHosts('all' );
			this.autoAssignGuests('all' );
		})
	}
																										   ///////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////// GUEST STUFF ////
	
	  /////////////////
	//  ASSIGN GUEST ///////////////////////////////////////////////////////////////////////////////////////////////////////
	
	autoAssignGuests ( scope: string ) {
		this.debug = false;
		let scopeArray: string[] = [];
		if ( scope === 'all' ) { this.ver.events.forEach( evt => scopeArray.push(evt.name))} else { scopeArray = [scope]}
		for ( let e1 = 0, e1Len = scopeArray.length;   e1 < e1Len;   e1++   ) {
			const evt = scopeArray[e1];
			let cnt = 0;
			let startMarker = 0;
			const hostKeys = Object.keys( this.aGs[evt] );
			const startUnGsCnt = this.unGs[evt].length;
			this.unGs[evt].sort(() => Math.random() - 0.5 );																// randomize auto-assignment order...
			this.unGs[evt].sort(( a: {guests: string[]}, b: {guests: string[]} ) => b.guests.length - a.guests.length );  	// ...then re-sort, so that large groups auto-assign first
			while (	this.summary[evt].assignedSeats		< this.summary[evt].totalGuests		&&								// assigned seats inexplicably greater than initial total guests
					this.summary[evt].assignedSeats		< this.summary[evt].allocatedSeats	&&								// No more seats to assign
					this.summary[evt].unassignedGuests	> 0									&&								// No more guests to assign
					cnt									< startUnGsCnt														// Just failsafe for infinite loop (which, of course, shouldn't ever happen :))
			) {
				cnt++;
				const nextHost = this.summary[evt].nextAutoAssignHost;
				const nextGuest = this.unGs[evt][startMarker].guestKey;
				for ( let hst = 0, hstLen = hostKeys.length;	hst < hstLen;	hst++ ) {
					const hostKey = hostKeys[hst];
					if ( hostKey === nextHost ) {
						if ( ! this.assignGuest( evt, hostKey, nextGuest, startMarker )) {
							if (this.debug) console.log( '\tPAIR CONFLICT -- The following assignment was aborted:\t\t', nextGuest, '\t\tto event:\t\t', evt + '-' + hostKey );
							startMarker++;
						}
						break;
					}
				}
			}
			this.pairsByMonth( evt );
		}
		this.debug = false;
	}

	dropGuest ( guestDrop: CdkDragDrop<any[]>, evt: string  ) {										// unassigned -> host ...or... host -> host
		if ( guestDrop.previousContainer === guestDrop.container ) {
			console.log( 'dropGuest()\tevent summary:', this.summary, this.aGs, guestDrop );
			moveItemInArray( guestDrop.container.data, guestDrop.previousIndex, guestDrop.currentIndex )
		} else {
			let prevGuestIdx:		number;
			let dropContainerId:	string;
			let guestKey:			string;
			if ( guestDrop.previousContainer.id === 'unassigned' ) {
				prevGuestIdx	= guestDrop.previousIndex;
				dropContainerId	= guestDrop.container.id
				guestKey		= this.unGs[evt][prevGuestIdx].guestKey;
			} else {
				prevGuestIdx	= guestDrop.previousIndex;
				dropContainerId	= guestDrop.container.id
				guestKey		= guestDrop.item.data.guestKey;
			}
			this.assignGuest( evt, dropContainerId, guestKey, prevGuestIdx, guestDrop );
		}
	}
	
	assignGuest( evt: string, hst: string, gst: string, gstIdx: number, guestDrop?: CdkDragDrop<any[]> ): boolean {
		let rtn = false;
		if ( hst === gst ) {																				// host -> guest fast track i.e. no conflict checking
			const newGstIdx = this.aGs[evt][hst].push( ...this.unGs[evt].splice( gstIdx, 1 )) - 1;			// .push() returns length, "- 1" returns the index
			this.aGs[evt][hst][newGstIdx].isDisabled = true;
			rtn	 = true;
		} else {
			if (
				this.aGs[evt][hst].every(( prevAssignedGuest: { guestKey: string }) => {
					if (this.debug) console.log( prevAssignedGuest, this.summary.pairs[gst].includes( prevAssignedGuest.guestKey ));
					return this.summary.pairs[gst].includes( prevAssignedGuest.guestKey );
				})
			) {
				if ( guestDrop ) {
					const leaveArray = [];
					transferArrayItem( guestDrop.previousContainer.data, guestDrop.container.data, guestDrop.previousIndex, guestDrop.currentIndex )	// CDK drag/drop magic
					if ( guestDrop.previousContainer.id !== 'unassigned') {
						const pushGuests	= guestDrop.previousContainer.data;																			// previous container guests
						const pushGuest		= guestDrop.item.data;																						// dropped guest
						leaveArray.push( ...pushGuests );
						for ( const guest of leaveArray ) {
							if (this.debug) console.log( 'assignGuest()\t\t\tadding back...', pushGuest.guestKey, '\t\tto:\t', guest.guestKey );
							this.summary.pairs[guest.guestKey].push(pushGuest.guestKey);																// return un-assigned guests back to exiting guest pair list
							if (this.debug) console.log( 'assignGuest()\t\t\tadding back...', guest.guestKey, '\t\tto:\t', pushGuest.guestKey );
							this.summary.pairs[pushGuest.guestKey].push(guest.guestKey);																// ...and vice-versa
						}
					}
				} else {
					if ( this.aGs[evt][hst].push( ...this.unGs[evt].splice( gstIdx, 1 )) > 0 ) {
						for ( let gst1 = 0, gst1Len = this.aGs[evt][hst].length;	gst1 > gst1Len;		gst1++ ) {
							const prevAssignedGuest = this.aGs[evt][hst][gst1].guestKey;
							this.aGs[evt][hst].every(( guest: any ) => { if (this.debug) console.log('\t\t', guest )});
							this.aGs[evt][hst].every(( guest: any ) => this.summary.pairs[gst].splice(this.summary.pairs[prevAssignedGuest].indexOf(guest.guestKey), 1));
						}
						rtn = true;
					} else { rtn = false }
				}
				this.pairsByMonth( evt );
			} else {
				if ( guestDrop ) { window.alert( 'derp!' + evt + hst + gst )}
				rtn = false;
			}
		}
		this.calcTotals();
		return rtn;
	}
	
	  /////////////////////
	//  DE-ASSIGN GUEST  ///////////////////////////////////////////////////////////////////////////////////////////////////
	
	unDropGuest ( guestDrop: CdkDragDrop<any[]>, evt: string  ) {														// host -> unassigned ...or... unassigned -> unassigned
		if ( guestDrop.previousContainer === guestDrop.container ) {
			console.log( 'unDropGuest()\tevent summary:', this.summary, this.aGs, guestDrop );
			moveItemInArray( guestDrop.container.data, guestDrop.previousIndex, guestDrop.currentIndex );
		} else {
			const guestIdx	= guestDrop.previousIndex;
			const hostKey	= guestDrop.previousContainer.id;
			const guestKey	= guestDrop.item.data.guestKey;
			this.deAssignGuest( evt, hostKey, guestKey, guestIdx, guestDrop  );
		}
	}
	
	deAssignGuest( evt: string, hst: string, gst: string, gstIdx: number, guestDrop?: CdkDragDrop<any[]> ) {
		if ( guestDrop ) {
			this.dePairGuest( evt, hst, gst, guestDrop )
			transferArrayItem( guestDrop.previousContainer.data, guestDrop.container.data, guestDrop.previousIndex, guestDrop.currentIndex )		// CDK drag/drop magic
		} else {
			if (this.debug) console.log( 'deAssignGuest()\t\t\t\tNO DROP OBJECT FOUND -- manual push/enable -- re-assignment ready -- guest:', gst, 'event:', evt + '("unassigned")', 'idx:', gstIdx );
			this.dePairGuest( evt, hst, gst )
			this.unGs[evt][this.unGs[evt].push( ...this.aGs[evt][hst].splice( gstIdx, 1)) - 1].isDisabled	= false;
		}
		this.calcTotals();
	}
	
	dePairGuest(  evt: string, hst: string , gst: string, guestDrop?: CdkDragDrop<any[]> ) {
		const leaveGuests = [];
		if ( guestDrop ) {
			leaveGuests.push( ... JSON.parse( JSON.stringify( guestDrop.previousContainer.data )));
		} else {
			leaveGuests.push( ... JSON.parse( JSON.stringify( this.aGs[evt][hst] )));
		}
		for ( const guest of leaveGuests ) {
			if ( gst !== guest.guestKey ) {
				if (this.debug) console.log( 'dePairGuest()\t\t\t\tde-pairing guest:\t', gst, '\tfrom guest:\t', guest.guestKey );
				this.summary.pairs[guest.guestKey].push( gst );																				// return un-assigned guests back to exiting guest pair list
				if (this.debug) console.log( 'dePairGuest()\t\t... and vice-versa guest:\t', guest.guestKey, '\tfrom guest:\t', gst );
				this.summary.pairs[gst].push(guest.guestKey);																				// ...and vice-versa
			}
		}
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//  GUEST HELPERS
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	private pairsByMonth( evt: string ) {
		this.debug = false;
		const hsts = Object.keys( this.aGs[evt] );
		for ( const hst of hsts ) {
			const gsts		= this.aGs[evt][hst];
			const pairs		= this.aGs[evt][hst];
			for ( const gst of gsts ) {
				for ( const pair of pairs ) {
					if ( pair.guestKey !== gst.guestKey ) {
						if ( this.summary.pairs[gst.guestKey].includes( pair.guestKey )) {
							if (this.debug) console.log( 'pairsByMonth()\t\t\tremoving...', pair.guestKey, 'from: ', gst.guestKey );
							this.summary.pairs[gst.guestKey].splice( this.summary.pairs[gst.guestKey].indexOf(pair.guestKey), 1);
						}
					}
				}
			}
		}
		this.debug = false;
	}
	
	private auditPairsByMonth( evt: string ) {
		this.debug = false;
		const hsts = Object.keys( this.aGs[evt] );
		for ( const hst of hsts ) {
			const gsts = this.aGs[evt][hst];
			const pairs = this.aGs[evt][hst];
			for ( const gst of gsts ) {
				for ( const pair of pairs ) {
					if ( pair.guestKey !== gst.guestKey ) {
						if ( this.summary.auditPairs[gst.guestKey].includes( pair.guestKey )) {
							this.summary.auditPairs[gst.guestKey].splice( this.summary.auditPairs[gst.guestKey].indexOf( pair.guestKey ), 1);
						}
					}
				}
			}
		}
		this.debug = false;
	}

	pairsPredicate() {
		return ( gstDrag: CdkDrag, hstDrop: CdkDropList ) => {
			const guests: any	= [];
			const gst			= gstDrag.data.guestKey
			guests.push( ...hstDrop.data );
			return guests.every((guest: { guestKey: string }) => this.summary.pairs[gst].includes(guest.guestKey)) || hstDrop.id === 'unassigned';
		}
	}
																											  //////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////// HOST STUFF ///
	  		///////////////////
	////////  ALLOCATE HOST  //////////////////////////////////////////////////////////////////////////////////////////////
	autoAllocateHosts( scope: string ) {
		let events: string[];
		if ( scope === 'all' ) { events = Object.keys( this.unHs )} else { events = [scope]}
		events.every( event => this.unHs[event].sort(() => Math.random() - 0.5 ))											// randomize-ish auto-assign order
		for ( const evt of events ) {
			let hstIdx = 0;
			while  ( this.summary[evt].allocatedSeats < this.summary[evt].totalGuests  &&  this.unHs[evt][hstIdx] !== undefined  ) {
				if ( ! this.unHs[evt][hstIdx].isDisabled ) {
					const hst =  this.unHs[evt][hstIdx].hostKey
					this.allocateHost( evt, hst, hstIdx );
				} else {
					if (this.debug) console.log( 'autoAllocateHosts()\t!!!! Cannot assign host:\t', this.unHs[evt][hstIdx].hostKey, '\tto', evt, '...skipping' );
					hstIdx++
				}
			}
		}
	}
	
	dropHost ( hostDrop: CdkDragDrop<any[]>, evt: string ) {
		if ( hostDrop.previousContainer === hostDrop.container ) {
			console.log( 'dropHost()\tevent summary:', this.summary, this.aGs, hostDrop );
			moveItemInArray( hostDrop.container.data, hostDrop.previousIndex, hostDrop.currentIndex )
		} else {
			const hostIdx	= hostDrop.previousIndex;
			const hostKey	= hostDrop.previousContainer.data[hostIdx].hostKey;
			this.allocateHost( evt, hostKey, hostIdx, hostDrop );
		}
	}
	
	allocateHost( evt: string, hst: string, hstIdx: number, hostDrop?: CdkDragDrop<any[]> ) {
		this.debug = true;
		if ( hostDrop ) {
			transferArrayItem( hostDrop.previousContainer.data, hostDrop.container.data, hostDrop.previousIndex, hostDrop.currentIndex );
		} else { this.aHs[evt].push( ...this.unHs[evt].splice( hstIdx, 1))}
		this.otherHostEvents( evt, hst, true );
		this.hostAsGuest( evt, hst );
		this.calcTotals();
		this.debug = false;
	}
	
						////////////////////
	//////////////////// DE-ALLOCATE HOST ////////////////////////////////////////////////////////////////////////////////
	
	unDropHost ( hostDrop: CdkDragDrop<any[]>, evt: string ) {
		if ( hostDrop.previousContainer === hostDrop.container ) {
			console.log( 'dropHost()\tevent summary:', this.summary, this.aGs, hostDrop );
			moveItemInArray( hostDrop.container.data, hostDrop.previousIndex, hostDrop.currentIndex )
		} else {
			const hostKey	= hostDrop.item.data.hostKey;
			const hostIdx	= hostDrop.previousIndex;
			this.deAllocateHost( evt, hostKey, hostIdx, hostDrop )
		}
	}
	
	deAllocateHost( evt: string, hst: string, hstIdx: number, hostDrop?: CdkDragDrop<any[]> ) {
		console.log( 'de-allocate -- event', evt, 'host:', hst, 'idx:', hstIdx, hostDrop );
		const unGuests = this.aGs[evt][hst]
		while ( unGuests.length > 0 ) {
			console.log( 'de-assigning guest:', unGuests[0].guestKey )
			this.deAssignGuest( evt, hst, unGuests[0].guestKey, 0 )
		}
		delete this.aGs[evt][hst];
		if ( hostDrop ) {
			transferArrayItem( hostDrop.previousContainer.data, hostDrop.container.data, hostDrop.previousIndex, hostDrop.currentIndex );
		} else { this.unHs[evt].push( ...this.unHs[evt].splice( hstIdx, 1))}
		this.otherHostEvents( evt, hst, false );
		this.calcTotals();
	}
	
	////////////////////
	//  HOST HELPERS  //////////////////////////////////////////////////////////////////////////////////////////////////////
	
	hostAsGuest( evt: string, hst: string ) {
		this.debug = false;
		let idxCnt = 0;
		const unGuests = this.unGs[evt];
		for ( const unGuest of unGuests ) {
			const guestKey = unGuest.guestKey
			if ( hst === guestKey ) {
				this.aGs[evt][hst] = [];
				if (this.debug) console.log( 'hostAsGuest()\t\t\t\tcalling assignGuest(), using:(event:', evt, 'host:', hst, 'guest:', guestKey, 'idx:', idxCnt + ')' );
				this.assignGuest( evt, hst, guestKey, idxCnt );
				break;
			} else { idxCnt++ }
		}
		this.debug = false;
	}
	
	otherHostEvents ( evt: string, hst: string, disable: boolean ) {
		const events = JSON.parse( JSON.stringify( this.ver.events ));
		const unEvents = events.map(( event: any ) => event.name );
		for ( const unEvent of unEvents ) {
			for ( const unH of this.unHs[unEvent] ) {
				if ( unH.hostKey ===  hst ) {
					if ( ! disable ) {
						console.log( '\n\nWARNING: Re-enabling this host will force guest de-assignments in other events!!!\n\n' );
						const aEs = this.aGs[unEvent];
						for ( const aH of aEs ) {
							let idxCnt = 0;
							for ( const aG of aH) {
								if (this.debug) console.log( 'otherHostEvents()\t\t\t\t\tguest:', aG.guestKey )
								if ( unH.hostKey === aG.guestKey ) {
									if (this.debug) console.log( 'otherHostEvents()\t\t\t\t\t\tcalling deAssignGuest(), using -- event:', unEvent, 'host:', aH.hostKey, 'guest:', aG.guestKey, 'index:', idxCnt + ')' );
									this.deAssignGuest( unEvent, aH.hostKey, aG.guestKey, idxCnt )
								} else { idxCnt++ }
							}
						}
					}
					unH.isDisabled = disable;
					break;
				}
			}
		}
	}

	assignAllUniqHosts () {
		const assignmentArray	= Object.keys( this.unHs )
		const uniqs				= this.schedSvc.findUniqHosts( assignmentArray );
		uniqs.forEach( uniq => {
			const event	= uniq.event;
			const host	= uniq.host;
			for ( let e = 0, eLen = this.ver.events.length; e < eLen; e++  ) {
				const evt = this.ver.events[e].name;
				if ( evt === event ) {
					for ( let h = 0, hLen = this.unHs[evt].length; h < hLen; h++  ) {
						if ( this.unHs[evt][h].hostKey === host ) {
							this.allocateHost( evt, host, h );
							break;
						}
					}
				}
			}
		})
	}
	
	////////////////////
	//  MISC HELPERS  //////////////////////////////////////////////////////////////////////////////////////////////////////
	
	loadVersion		( versionId: number ) { if (this.debug) console.log( 'Loading version , version ID:', versionId, 'see version-update->loadVersion()' )}
	setStep			( index: number ) { this.step = index }
	cancelVersion	( ) { this.toPlanUpdate()	}
	nextStep		( ) { this.step++ 			}
	prevStep		( ) { this.step-- 			}
	reviewVersion	( ) { this.router.navigate(['/plan', this.planId, 'schedule'	]).then(r => { if (this.debug) console.log(r)})}
	toPlanUpdate	( ) { this.router.navigate(['/plan', this.planId, 'update'	]).then(r => { if (this.debug) console.log(r)})}
	toVersions		( ) { this.router.navigate(['/plan', this.planId				]).then(r => { if (this.debug) console.log(r)})}
	canDeactivate	( ): Observable<boolean> | boolean { if ( JSON.stringify(this.loadedVer) === JSON.stringify(this.ver)) {return true} else {return this.dialog.confirm('Abandon version changes?')}}
	save() {
		this.loadedVer = JSON.parse( JSON.stringify( this.ver ));
		this.planSvc.addVersion( this.ver );
		this.reviewVersion()
	}
	deepEqual ( object1: any, object2: any ) {
		const keys1 = Object.keys( object1 );
		const keys2 = Object.keys( object2 );
		if ( keys1.length !== keys2.length ) { return false }
		for ( const key of keys1 ) {
			const val1			= object1[key];
			const val2			= object2[key];
			const areObjects	= isObject( val1 ) && isObject( val2 );
			if (( areObjects && !this.deepEqual( val1, val2 ))  ||  ( ! areObjects && val1 !== val2 )) { return false }
		}
		return true;
	}
	calcTotals () {
		this.debug			= false;
		this.allGs.guests	= [];
		for ( let e = 0, eLen = this.ver.events.length; e < eLen; e++ ) {
			const evt					= this.ver.events[e].name;
			let nextHostToAssignCount	= 0;
			this.allGs[evt]				= {};
			this.allGs[evt].guests		= [];
			this.summary[evt]			= {};
			this.summary[evt].nextAutoAssignHost = '';
			for ( let h1 = 0, h1Len = Object.keys( this.aGs[evt] ).length;   h1 < h1Len;   h1++ ) {
				const hst					= Object.keys( this.aGs[evt] )[h1];
				this.allGs[evt][hst]		= {};
				this.allGs[evt][hst].guests	= [];
				this.allGs[evt][hst].hosts	= [];
				this.summary[evt][hst]		= [];
				for ( let gst = 0, gstLen = this.aGs[evt][hst].length;   gst < gstLen;   gst++   ) {
					if ( this.aGs[evt][hst][gst].guestKey  ===  hst ) { this.allGs[evt][hst].hosts.push( ...this.aGs[evt][hst][gst].guests )}
					this.allGs.guests.push( ...this.aGs[evt][hst][gst].guests );
					this.allGs[evt].guests.push( ...this.aGs[evt][hst][gst].guests );
					this.allGs[evt][hst].guests.push( ...this.aGs[evt][hst][gst].guests );
					this.summary[evt][hst].assignedSeats	= this.allGs[evt][hst].guests.length;
					this.summary[evt][hst].hosts			= this.allGs[evt][hst].hosts.length;
				}
				for ( let hst2 = 0, hst2Len = this.aHs[evt].length;		hst2 < hst2Len;		hst2++ ) {
					if ( this.aHs[evt][hst2].hostKey === hst ) { this.summary[evt][hst].totalSeats = this.aHs[evt][hst2].seats }
				}
				this.summary[evt][hst].unassignedSeats	= this.summary[evt][hst].totalSeats - this.summary[evt][hst].assignedSeats;
				if ( this.summary[evt][hst].unassignedSeats > nextHostToAssignCount ) {
					nextHostToAssignCount					= this.summary[evt][hst].unassignedSeats;
					this.summary[evt].nextAutoAssignHost	= hst;
				}
			}
			let accum = 0;
			for ( let gst = 0, gstLen = this.unGs[evt].length;	gst < gstLen;	gst++ ) { accum = accum + this.unGs[evt][gst].guests.length }
			this.summary[evt].unassignedGuests = accum;
			accum = 0;
			for ( let hst = 0, hstLen = this.aHs[evt].length;	hst < hstLen;	hst++ ) { accum = accum + this.aHs[evt][hst].seats }
			this.summary[evt].allocatedSeats = accum;
			accum = 0;
			for ( let hst = 0, hstLen = this.unHs[evt].length;	hst < hstLen;	hst++ ) { accum = accum + this.unHs[evt][hst].seats }
			this.summary[evt].unallocatedSeats		= accum;
			this.summary[evt].assignedSeats			= this.allGs[evt].guests.length;
			this.summary[evt].assignedGuests		= this.allGs[evt].guests.length;
			this.summary[evt].totalSeats			= this.summary[evt].unallocatedSeats	+ this.summary[evt].allocatedSeats;
			this.summary[evt].totalGuests			= this.summary[evt].unassignedGuests	+ this.summary[evt].assignedSeats;
			this.summary[evt].overAllocatedSeats	= this.summary[evt].allocatedSeats		- this.summary[evt].totalGuests;
			this.summary[evt].unassignedSeats		= this.summary[evt].allocatedSeats		- this.summary[evt].assignedSeats;
		}
		this.summary.auditPairs = JSON.parse( JSON.stringify( this.summary.refreshPairs ));
		this.ver.events.forEach( event => this.auditPairsByMonth( event.name ))
		this.debug = false;
	}
}
