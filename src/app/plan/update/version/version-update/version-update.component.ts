

import { environment		} from '../../../../../environments/environment';

import { ActivatedRoute		} from '@angular/router';
import { CdkDragDrop		} from '@angular/cdk/drag-drop';
import { ChangeDetectorRef	} from '@angular/core';
import { Component			} from '@angular/core';
import { moveItemInArray	} from '@angular/cdk/drag-drop';
import { OnInit				} from '@angular/core';
import { Router				} from '@angular/router';
import { transferArrayItem	} from '@angular/cdk/drag-drop';

import { Observable			} from 'rxjs';
import { of					} from 'rxjs';
import { isObject			} from 'rxjs/internal-compatibility';
import { switchMap			} from 'rxjs/operators';

import { Plan				} from '../../../../../../.ARCHIVE/models/plan';
import { Version			} from '../../../../../../.ARCHIVE/models/plan';
import { Versions			} from '../../../../../../.ARCHIVE/models/plan';

import { DialogService		} from '../../../../services/dialog.service';
import { PlanService		} from '../../../services/plan.service';
import { PresbyService		} from '../../../../presby/services/presby.service';

import { Presby				} from '../../../../../../.ARCHIVE/models/plan';

// import deepEqual from 'deep-equal';

@Component({
	selector: 'app-version-update',
	templateUrl: './version-update.component.html',
	styleUrls: ['./version-update.component.sass']
})

export class VersionUpdateComponent implements OnInit {
	env:				any;
	debug:				boolean;
	eventId!:			number;
	eventName!:			string;
	planId!:			number;
	versionId!:			number;
	activePresbies!:	Presby[];
	versions!:			Versions;
	loadedVer!:			Version;
	plan!:				Plan | undefined;
	ver!:				Version;
	
	allGuests:			{[key: string]: {[key: string]: any; hosts?: any}; guests?:	any} = {};
	aGuestCnt:			{[key: string]: {[key: string]: any; hosts?: any}; all?:	any} = {};
	// allGuests:			{[key: string]: {[key: string]: any}; guests?: any; hosts?: any	} = {};
	// aGuestCnt:			{[key: string]: {[key: string]: any; hosts?: any}; all?: any					} = {};
	assignedHosts: 		{[key: string]: any} = [];
	assignedGuests:		{[key: string]: any} = [];
	unassignedHosts:	{[key: string]: any} = [];
	unassignedGuests:	{[key: string]: any} = [];
	aSeatCnt:			{[key: string]: any} = {};
	unGuestCnt:			{[key: string]: any} = {};
	unSeatCnt:			{[key: string]: any} = {};
	
	eventNameSlug	= 'Presby gotta new version - owwwww!'
	panelOpenState	= false;
	step			= 0;
	
	constructor (
		private	cdr:		ChangeDetectorRef,
		public	dialog:		DialogService,
		public	planSvc:	PlanService,
		public	presbySvc:	PresbyService,
		public	route:		ActivatedRoute,
		public	router:		Router,
	) {
		this.env	= environment;
		this.debug	= this.env.debug
	}
	
	
	calcTotals () {
		
		this.allGuests.guests	= [];
		this.aGuestCnt.all		= 0;
		
		for ( let e = 0, eLen = this.ver.events.length; e < eLen; e++ ) {
			const evt					= this.ver.events[e].name;
			this.allGuests[evt]			= {};
			this.aGuestCnt[evt]			= {};
			this.allGuests[evt].guests	= [];
			this.aGuestCnt[evt].all		= 0;
			
			Object.keys(this.assignedGuests[this.ver.events[e].name]).forEach( hst => {
				this.allGuests[evt][hst]		= {};
				this.allGuests[evt][hst].guests	= [];
				this.allGuests[evt][hst].hosts	= [];
				this.aGuestCnt[evt][hst]		= {};
				for ( let h = 0, hLen = this.assignedGuests[this.ver.events[e].name][hst].length; h < hLen; h++ ) {
					
					if ( this.assignedGuests[evt][hst][h].partyName  ===  hst )
						this.allGuests[evt][hst].hosts.push	( ...this.assignedGuests[evt][hst][h].guests);
					this.allGuests.guests.push				( ...this.assignedGuests[evt][hst][h].guests);
					this.allGuests[evt].guests.push			( ...this.assignedGuests[evt][hst][h].guests);
					this.allGuests[evt][hst].guests.push	( ...this.assignedGuests[evt][hst][h].guests);
					
					this.aGuestCnt[evt][hst].all		= this.allGuests[evt][hst].guests.length;
					this.aGuestCnt[evt][hst].hosts		= this.allGuests[evt][hst].hosts.length;
				}
				// if (this.debug)
				console.log('--', hst, '-- parties:', this.assignedGuests[evt][hst].length, '-- guests:', this.aGuestCnt[evt][hst]);
			})
			this.aGuestCnt[this.ver.events[e].name].all		= this.allGuests[this.ver.events[e].name].guests.length;
			this.aSeatCnt[this.ver.events[e].name]			= this.assignedHosts[this.ver.events[e].name].reduce(
				( previousValue: any, currentValue: any )	=> previousValue + currentValue.seats, 0)
			this.unGuestCnt	[this.ver.events[e].name]		= this.unassignedGuests[this.ver.events[e].name].reduce(
				(previousValue: any, currentValue: any)		=> previousValue + currentValue.guests.length, 0);
			this.unSeatCnt	[this.ver.events[e].name]		= this.unassignedHosts	[this.ver.events[e].name].reduce(
				(previousValue: any, currentValue: any)		=> previousValue + currentValue.seats, 0)
		}
		console.log( this.allGuests			);
		console.log( this.assignedGuests	);
		console.log( this.aGuestCnt			);
		this.cdr.detectChanges()
	}
	
	// assignGuest ( guest: CdkDragDrop<string[]>, eventName: string ) {
	assignGuest ( guest: CdkDragDrop<string[]> ) {
		if ( guest.previousContainer === guest.container ) {
			moveItemInArray( guest.container.data, guest.previousIndex, guest.currentIndex )
		} else {
			transferArrayItem( guest.previousContainer.data, guest.container.data, guest.previousIndex, guest.currentIndex )
		}
		this.calcTotals()
	}
	
	assignHost ( host: CdkDragDrop<string[]>, eventName: string ) {
		if ( host.previousContainer === host.container ) {																				// REORDER ASSIGNED VIEW
			moveItemInArray( host.container.data, host.previousIndex, host.currentIndex )
		} else {																														// ADD NEW HOST
			transferArrayItem( host.previousContainer.data, host.container.data, host.previousIndex, host.currentIndex );
			
			const newAssignedHostIndex	= host.currentIndex;
			const newAssignedHostName	= this.assignedHosts[eventName][newAssignedHostIndex].hostName;
			
			this.assignedHosts[eventName][newAssignedHostIndex].assigned	= true;
			this.assignedHosts[eventName][newAssignedHostIndex].guests		= [];
			// this.assignedHosts[eventName][newAssignedHostIndex].disabled	= false;
			
			for ( let gIdx = 0, gLen = this.unassignedGuests[eventName].length; gIdx < gLen; gIdx++	) {
				if ( newAssignedHostName ===  this.unassignedGuests[eventName][gIdx].partyName ){
					if (! Array.isArray(this.assignedGuests[eventName][newAssignedHostName]))  this.assignedGuests[eventName][newAssignedHostName] = [];
					// || !this.assignedGuests[eventName][newAssignedHostName].length
					this.assignedGuests[eventName][newAssignedHostName].push( ...this.unassignedGuests[eventName].splice( gIdx, 1 ));
					break
				}
			}
		}
		this.calcTotals()
	}
	
	
	
	ngOnInit () {
		this.activePresbies = this.presbySvc.getPresbyActive();
		this.route.paramMap.pipe(switchMap(params => of(params.get('planId')))).subscribe(planId => this.plan = this.planSvc.setPlan(+planId!));
		this.route.paramMap.pipe(switchMap(params => of(params.get('versionId')))).subscribe(versionId => {
			this.planSvc.setVersion( +versionId! );
			this.loadedVer 	= this.planSvc.getVersion();
			this.ver		= JSON.parse(JSON.stringify(this.loadedVer))
		});
		
		for ( let i = 0, iLen = this.ver.events.length; i < iLen; i++ ) {													// LOAD EVENTS INTO SEPARATE MAPS
			this.assignedHosts		[this.ver.events[i].name] = [];
			this.unassignedHosts	[this.ver.events[i].name] = [];
			this.assignedGuests		[this.ver.events[i].name] = [];
			this.unassignedGuests	[this.ver.events[i].name] = []
		}
		
		for ( let e = 0, eLen = this.ver.events.length; e < eLen; e++ ) {													// LOOP THRU EVENTS
			this.eventName = this.ver.events[e].name;
			
			for ( let a = 0, aLen = this.activePresbies.length; a < aLen; a++ ) {											// LOOP THRU ACTIVE PRESBIES
	
	// BUILD HOSTS
				for ( let h = 0, seats = 0, hLen = this.activePresbies[a].hosting.length; h < hLen; h++, seats++ ) {			// LOOP THRU ACTIVE HOSTS
					
					if ( this.activePresbies[a].hosting[h].eventName === this.eventName ) {									// SAVE ACTIVE EVENT HOST
						this.activePresbies[a].hosting[h].hostName = this.activePresbies[a].name;
						if ( this.activePresbies[a].hosting[h].assigned ){
							this.assignedHosts[this.activePresbies[a].hosting[h].eventName].push(this.activePresbies[a].hosting[h])
						} else {
							this.unassignedHosts[this.activePresbies[a].hosting[h].eventName].push(this.activePresbies[a].hosting[h])
						}
					}																										// else { if (this.debug) console.log( '\t\t\t\t\t\t\t', this.eventName, '--- NOT FOUND!' )}
				}
	// BUILD GUESTS
				if ( this.activePresbies[a].guesting.length > 0 ) {
					for ( let g = 0, gLen = this.activePresbies[a].guesting.length; g < gLen; g++ ) {															// LOOP THRU ACTIVE GUESTS
						if ( this.activePresbies[a].guesting[g].eventName === this.eventName ) {
							if ( ! ('guests' in this.activePresbies[a].guesting[g])) {
								if ( this.activePresbies[a].guests.length > 0 ) {
									this.activePresbies[a].guesting[g].guests = JSON.parse( JSON.stringify( this.activePresbies[a].guests))
								} else {
									this.activePresbies[a].guesting[g].guests = ['Ghosty Ghost']
								}
							}
							this.activePresbies[a].guesting[g].partyName = JSON.parse( JSON.stringify( this.activePresbies[a].name ));
							if ( this.activePresbies[a].guesting[g].assigned ){
								this.assignedGuests[this.activePresbies[a].guesting[g].eventName].push(this.activePresbies[a].guesting[g])
							} else {
								this.unassignedGuests[this.activePresbies[a].guesting[g].eventName].push(this.activePresbies[a].guesting[g])
							}
						}
					}
				} else { if (this.debug) console.log( '\t\t\tEMPTY GUEST -- SKIPPING:', this.activePresbies[a].name )}
			}
		}
		this.calcTotals()
	}
	
	// unassignGuest ( guest: CdkDragDrop<string[]>, eventName: string ) {
	unassignGuest ( guest: CdkDragDrop<string[]> ) {
		if ( guest.previousContainer === guest.container ) {
			moveItemInArray( guest.container.data, guest.previousIndex, guest.currentIndex )
		} else {
			transferArrayItem( guest.previousContainer.data, guest.container.data, guest.previousIndex, guest.currentIndex )
		}
		this.calcTotals()
	}
	
	// unassignHost ( host: CdkDragDrop<string[]>, eventName: string ) {
	unassignHost ( host: CdkDragDrop<string[]> ) {
		if ( host.previousContainer === host.container ) {
			moveItemInArray( host.container.data, host.previousIndex, host.currentIndex )
		} else {
			transferArrayItem( host.previousContainer.data, host.container.data, host.previousIndex, host.currentIndex )
		}
		this.calcTotals()
	}
	
	deepEqual ( object1: any, object2: any ) {
		const keys1 = Object.keys( object1 );
		const keys2 = Object.keys( object2 );
		if ( keys1.length !== keys2.length ) { return false }
		for ( const key of keys1 ) {
			const val1			= object1[key];
			const val2			= object2[key];
			const areObjects	= isObject( val1 ) && isObject( val2 );
			if ( areObjects  &&  ! this.deepEqual( val1, val2 )  ||  !areObjects  &&  val1 !== val2 ) { return false }
		}
		return true
	}
	
	autoAssignHosts		( scope:		string	) { console.log( 'auto assigning:', scope )}
	autoAssignGuests	( scope:		string	) { console.log( 'auto assigning:', scope )}
	loadVersion			( versionId:	number 	) { console.log( 'Loading version , version ID:', versionId, 'see version-update->loadVersion()' )}
	setStep				( index:		number 	) { this.step = index }
	
	cancelVersion	( ) { this.toPlanUpdate() }
	nextStep		( ) { this.step++ }
	prevStep		( ) { this.step-- }
	reviewVersion	( ) { this.router.navigate(['/plan', this.planId, 'schedule'	]).then(r => console.log(r))}
	toPlanUpdate	( ) { this.router.navigate(['/plan', this.planId, 'update'	]).then(r => console.log(r))}
	toVersions		( ) { this.router.navigate(['/plan', this.planId				]).then(r => console.log(r))}
	canDeactivate	( ): Observable<boolean> | boolean { if ( JSON.stringify(this.loadedVer) === JSON.stringify(this.ver)) {return true} else {return this.dialog.confirm('Abandon version changes?')}}
	
	save ( ) {
		this.loadedVer = JSON.parse(JSON.stringify(this.ver));
		this.planSvc.addVersion(this.ver);
		this.reviewVersion()
	}
}
