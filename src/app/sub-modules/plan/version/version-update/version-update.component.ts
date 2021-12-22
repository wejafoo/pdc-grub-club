

import { environment	} from '../../../../../environments/environment';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { ActivatedRoute	} from '@angular/router';
import { Router			} from '@angular/router';

import { moveItemInArray	} from '@angular/cdk/drag-drop';
import { CdkDrag			} from '@angular/cdk/drag-drop';
import { CdkDropList		} from '@angular/cdk/drag-drop';
import { transferArrayItem	} from '@angular/cdk/drag-drop';
import { CdkDragDrop		} from '@angular/cdk/drag-drop';

import { Apollo		} from 'apollo-angular';
import { gql		} from 'apollo-angular';
import { isObject	} from 'lodash';

import { PlanService 	} from '../../services/plan.service';
import { PresbyService 	} from '../../../presby/presby.service';

import { Plan		} from '../../../models/plan';
import { Schedule	} from '../../../models/plan';
import { Version	} from '../../../models/plan';
import { Presbies	} from '../../../models/roster';
import { Presby		} from '../../../models/roster';

// export type Query = { presbies: Presbies }

@Component({
	selector: 'app-version-update',
	templateUrl: './version-update.component.html',
	styleUrls: ['./version-update.component.sass']
})
export class VersionUpdateComponent implements OnInit {
	env:		any;
	debug:		boolean;
	actives:	Array<Presby> = [];
	error:		any;
	events:		string[];
	loadedVer:	Version;
	plan:		Plan;
	planId:		number;								// router param--"plan/X"
	sched:		Schedule
	ver:		Version;
	versionId:	number;								// router param--"version/X"
	
	presbies:	Presbies = [];
	aHs:		{[key: string]: any[]}	= {};		// assigned hosts
	unHs:		{[key: string]: any[]}	= {};		// unassigned hosts
	unGs:		{[key: string]: any[]}	= {};		// unassigned guests
	aGs:		{[key: string]: any}	= {};		// assigned guests
	summary:	{[key: string]: any}	= {};
	isOpen	= false;								// peeps/card toggle
	loaded	= false;
	step	= 1;									// accordion order-control
	
// QUERY =
// gql`{
// presbies {
// key id isActive last guests guestings hostings seats unknown1 unknown2 email home cell smail city st zip mmail
// }}`;
	
	constructor(
		private	route:	ActivatedRoute,
		private	router:	Router,
		private	apollo:	Apollo,
		private	planSvc: PlanService,
		private	presby:	PresbyService
	) {
		this.env = environment;
		this.debug = this.env.debug;
		console.log('>>> VersionUpdateComponent');
	}
	
	
	save() {
		this.sched.ver.id++;
		console.log(
			'!!! VersionUpdate -> ver:',
			typeof this.ver.labels, Array.isArray(this.ver.labels), this.ver
		);
		localStorage.setItem(
			this.planId + '-latest',
			JSON.stringify(this.sched)
		);
		localStorage.setItem(
			this.sched.id,
			JSON.stringify(this.sched)
		);
		this.planSvc.addVersion(this.ver);
		this.router.navigate([
			'/plan', this.planId, 'version', 's', ++this.sched.ver.id
		]).then()
	}

	deepEqual(object1: any, object2: any) {
		const keys1	= Object.keys(object1);
		const keys2	= Object.keys(object2);
		let rtnVal	= false
		if ( keys1.length !== keys2.length ) { return false } else {
			let val1: any;
			let val2: any;
			for ( const key1 of keys1 ) {
				for ( const key2 of keys2 ) {
					val1 = object1[key1];
					val2 = object2[key2];
					const areObjects =
						isObject(val1) && isObject(val2);
					if (areObjects) {
						rtnVal = true
					} else {
						return false
					}
				}
			}
			return rtnVal;
		}
	}

	toVersions() {
		this.router.navigate(['/plan', this.planId]).then()
	}
	
	ngOnInit() {
		this.planId = Number(
			this.route.snapshot.paramMap.get('planId')
		);
		this.versionId = Number(
			this.route.snapshot.paramMap.get('versionId')
		);
		this.planSvc.setPlanVersion(this.planId, this.versionId);
		this.plan = this.planSvc.getPlan(this.planId);
		this.ver =
			JSON.parse( JSON.stringify( this.planSvc.getVersion()));
		this.loadedVer = JSON.parse( JSON.stringify(this.ver));
	
		this.events	=
			this.ver.events.map(event => event.name);
		for (const evt of this.events) {
			this.aHs[evt]	= [];
			this.unHs[evt]	= [];
			this.aGs[evt]	= {};
			this.unGs[evt]	= [];
		}
		this.presbies = this.presby.getData();
		if (this.presbies === undefined) {
			this.router.navigate(
				['/plan', 's', this.planId]
			).then();
		} else {
			this.actives = this.presbies.filter(
				presby => presby.isActive
			)
		}
		this.ver.id++;
		this.sched = {
			id:		String(this.plan.id) + '-' + String(this.ver.id),
			plan:	this.plan,
			ver:	this.ver,
			actives: this.actives,
			aGs:	this.aGs,
			aHs:	this.aHs,
			unGs:	this.unGs,
			unHs:	this.unHs,
		};
		this.sched.ver.labels.push(this.sched.id)
		const pairs: {[key: string]: string[]} = {};
		for (const a1 of this.actives) {
			pairs[a1.key] = [];
			for (const a2 of this.actives) {
				if (a1 !== a2) {
					pairs[a1.key].push(a2.key)
				}
			}
		}
		this.summary.pairs =
			JSON.parse( JSON.stringify(pairs));
		for (const evt of this.events) {
			this.loadEvent(evt)
		}
		this.allocateUniqs();
		this.autoAllocate('all');
		this.autoAssign('all');
		this.loaded = true;
	}
	
	loadEvent(evt: string) {

		//////////////////////////////////////////////  LOAD HOSTING OBJECTS  //
		for (const active of this.actives) {
			const hostings =
				JSON.parse('[' + active.hostings + ']');
			const activeObj	= Object.assign({}, active);
			let hCnt = 0;
			for (const hosting of hostings) {
				const hostingObj = Object.assign({}, hosting);
				if (hostingObj.event === evt) {
					hostingObj.id =
						JSON.parse( JSON.stringify(activeObj.id));
					hostingObj.hostName = activeObj.last;
					hostingObj.isDisabled = false;
					hostingObj.hostKey =
						activeObj.last	+ '-' +
						activeObj.id	+ '-' +
						activeObj.seats	+ '-' +
						activeObj.guests.length;
					if (
						!('seats' in hostingObj)	||
						hostingObj.seats === null
					) { hostingObj.seats = activeObj.seats }
					if (!('guests' in hostingObj)) {
						hostingObj.guests =
							JSON.parse( JSON.stringify(activeObj.guests))
					}
					this.unHs[evt].push(hostingObj);
				}
				hCnt++
			}
		}
		/////////////////////////////////////////////  LOAD GUESTING OBJECTS  //
		for (const active of this.actives) {
			let gCnt = 0;
			const guestings =
				JSON.parse('[' + active.guestings + ']');
			const activeObj =
				Object.assign({}, active);
			for (const guesting of guestings) {
				const guestingObj = Object.assign({}, guesting);
				if (guestingObj.event === evt) {
					if (
						!('cnt' in guestingObj)		||
						guestingObj.cnt === null
					) { guestingObj.cnt = activeObj.guests.length }
					if (!('guests' in guestingObj)) {
						guestingObj.guests = activeObj.guests
					}
					guestingObj.id =
						JSON.parse( JSON.stringify(activeObj.id));
					guestingObj.partyName =
						JSON.parse( JSON.stringify(activeObj.last));
					guestingObj.guestKey =
						activeObj.last	+ '-' +
						activeObj.id	+ '-' +
						activeObj.seats	+ '-' +
						activeObj.guests.length;
					this.unGs[evt].push(guestingObj);
				}
				gCnt++
			}
		}
		///////////////////////////////////////////  INITIALIZE EVENT SUMMARY //
		this.summary[evt] = {
			guests:				[],
			rsvps:				0,
			seats:				0,
			allocatedSeatCnt:	0,
			unAllocatedSeatCnt:	0,
			overAllocatedSeats:	0,
			assignedGuestCnt:	0,
			unAssignedGuestCnt:	0,
			overAssignedGuests:	0
		}
		///////////////////////////////////////////  INITIALIZE GUEST SUMMARY //
		for (const gst of this.unGs[evt]) {
			this.summary[evt].rsvps += gst.guests.length
		}
		////////////////////////////////////////////  INITIALIZE HOST SUMMARY //
		for ( const host of this.unHs[evt] ) {
			const hst = host.hostKey;
			this.summary[evt].seats += host.seats;
			this.summary[evt][hst] = {
				isAllocated:		false,
				guests:				[...host.guests],
				hosts:				[...host.guests],
				seats:				host.seats,
				assignedSeatCnt:	0
			}
		}
	}
	
	calcTotals(logMessage: string) {
		if (this.debug) console.log(logMessage);
		for ( const evt of this.events ) {
			this.summary[evt].guests				= [];
			this.summary[evt].unAllocatedSeatCnt	= 0;
			this.summary[evt].unAssignedGuestCnt	= 0;
			this.summary[evt].allocatedSeatCnt		= 0;
			this.summary[evt].assignedGuestCnt		= 0;
			for (const gst of this.unGs[evt]) {
				this.summary[evt].unAssignedGuestCnt += gst.cnt
			}
			for (const hst of this.unHs[evt]) {
				this.summary[evt].unAllocatedSeatCnt += hst.seats
			}
			for (const hst of this.aHs[evt]) {
				this.summary[evt].allocatedSeatCnt += hst.seats
			}
			for (const hst in this.aGs	[evt]) {
				this.summary[evt][hst].guests = []
				this.summary[evt][hst].assignedSeatCnt = 0;
				for (const gst of this.aGs[evt][hst]) {
					this.summary[evt].guests.push(...gst.guests);
					this.summary[evt][hst].guests.push(...gst.guests);
				}
				for ( const gst of this.aGs[evt][hst] ) {
					this.summary[evt].assignedGuestCnt +=
						gst.guests.length
					this.summary[evt][hst].assignedSeatCnt +=
						gst.guests.length
				}
			}
			this.summary[evt].overAllocatedSeats =
				this.summary[evt].allocatedSeatCnt -
				this.summary[evt].rsvps;
			this.summary[evt].overAssignedGuests =
				this.summary[evt].assignedGuestCnt -
				this.summary[evt].allocatedSeatCnt;
			this.summary[evt].nextHostCnt = 0;
			this.summary[evt].nextHost = '<undefined>';
			for (const hst in this.aGs[evt]) {
				this.summary[evt][hst].overAllocatedSeats =
					this.summary[evt][hst].assignedSeatCnt -
					this.summary[evt][hst].seats;
				if (
					this.summary[evt][hst].overAllocatedSeats < 0
				) {
					this.summary[evt][hst].unAssignedSeatCnt =
						this.summary[evt][hst].overAllocatedSeats * -1
				} else {
					this.summary[evt][hst].unAssignedSeatCnt = 0
				}
				if (
					this.summary[evt][hst].unAssignedSeatCnt >
					this.summary[evt].nextHostCnt
				) {
					this.summary[evt].nextHostCnt =
						this.summary[evt][hst].unAssignedSeatCnt;
					this.summary[evt].nextHost = hst;
				}
			}
		}
	}
	
	autoAssign(ctx: string) {
		let events: string[];
		if (ctx === 'all') {
			events = Object.keys( this.unGs )
		} else {
			events = [ctx]
		}
		for (const evt of events) {
			let cnt				= 0;
			let skipCnt			= 0;
			const hosts			= Object.keys(this.aGs[evt]);
			const startUnGsCnt	= this.unGs[evt].length;

			// Todo: refactor how "random" auto-assignment works

			this.unGs[evt].sort(() => Math.random() - 0.5);
			// large groups first... for now
			// this.unGs[evt].sort((a: {
			// 		guests: string[]},b: {guests: string[]}) =>
			// 			b.guests.length - a.guests.length);
			
			while (
				this.summary[evt].assignedGuestCnt <
					this.summary[evt].allocatedSeatCnt	&&
				this.summary[evt].unAssignedGuestCnt > 0	&&
				cnt < startUnGsCnt
			) {
				cnt++;
				const nextHost	= this.summary[evt].nextHost;
				const nextGuest	= this.unGs[evt][skipCnt].guestKey;
				for (const hst of hosts) {
					if (hst === nextHost) {
						if (this.assignGuest(evt, hst, nextGuest)) {
							break
						} else {
							if (this.debug) {
								console.log(
									'\t*** Conflict assigning',
									nextGuest, '--->', evt + '-' + hst,
									'\t(assignment skipped)'
								);
							}
							skipCnt++
						}
					}
				}
			}
		}
	}

	////////////////////////////////////////////////////////////  DROP EVENTS //
	dropHost(hostDrop: CdkDragDrop<any[]>, evt: string) {
		if (hostDrop.previousContainer === hostDrop.container) {
			console.log(
				'PLAN:',		this.sched,
				'\nSUMMARY:',	this.summary
			);
			moveItemInArray(
				hostDrop.container.data,
				hostDrop.previousIndex,
				hostDrop.currentIndex
			);
		} else {
			const hostIdx = hostDrop.previousIndex;
			const hostKey =
				hostDrop.previousContainer.data[hostIdx].hostKey;
			this.allocateHost(evt, hostKey, hostIdx, hostDrop);
		}
	}
	
	dropGuest(guestDrop: CdkDragDrop<any[]>, evt: string) {						// unassigned->host / host->host
		const fromHst	= guestDrop.previousContainer.id;
		const toHst		= guestDrop.container.id;
		const gst		= guestDrop.item.data.guestKey;
		const toHost	= guestDrop.container.data;
		const fromIdx	= guestDrop.previousIndex;
		const toIdx		= guestDrop.currentIndex;
		console.log( 'host or guest-plan-list data?', toHost );
		if (fromHst === toHst) {
			console.log(
				'PLAN:', this.sched, '\nSUMMARY:', this.summary
			);
			moveItemInArray(toHost, fromIdx, toIdx)
		} else { this.assignGuest(evt, toHst, gst, guestDrop) }
	}
	unDropHost(hostDrop: CdkDragDrop<any[]>, evt: string) {
		const fromHost	= hostDrop.previousContainer;
		const toHost	= hostDrop.container;
		if (fromHost === toHost) {
			moveItemInArray(
				hostDrop.container.data,
				hostDrop.previousIndex,
				hostDrop.currentIndex
			)
		} else { this.deAllocateHost(evt, hostDrop) }
	}
	unDropGuest(guestDrop: CdkDragDrop<any[]>, evt: string) {
		const fromHst	= guestDrop.previousContainer.id;
		const toHst		= guestDrop.container.id;
		const gst		= guestDrop.item.data.guestKey;
		const fromIdx	= guestDrop.previousIndex;
		if (fromHst !== toHst) {
			if (this.debug) {
				console.log(
					'guest-plan-list moved:', fromHst, '--->', toHst
				)
			}
			this.deAssignGuest( evt, fromHst, gst, fromIdx, guestDrop );
		} else {
			console.log(
				'PLAN:', this.sched, '\nSUMMARY:', this.summary[evt]
			)
		}
	}
	//////////////////////////////////////////////////////////  ALL THE MAGIC //
	deAllocateHost	(evt: string, hostDrop: CdkDragDrop<any[]>) {
		if (this.debug)  console.log(
			'\npreviousContainer.data:', hostDrop.previousContainer.data,
			'\n        container.data:', hostDrop.container.data,
			'\n         previousIndex:', hostDrop.previousIndex,
			'\n          currentIndex:', hostDrop.currentIndex,
			'\n  previousContainer.id:', hostDrop.previousContainer.id,
			'\n          container.id:', hostDrop.container.id,
			'\n             item.data:', hostDrop.item.data
		)
		const hst	= hostDrop.item.data.hostKey;
		const host	= hostDrop.item.data;
		const unGuests	= this.aGs[evt][hst];
		while ( unGuests.length > 0 ) {
			if (unGuests[0].guestKey === hst) {
				unGuests[0].isDisabled = false
			}
			this.deAssignGuest(
				evt, hst, unGuests[0].guestKey, 0
			)
		}
		host.isDisabled = false;
		this.summary[evt][hst].isDisabled = false;
		this.summary[evt][hst].isAllocated = false;
		this.summary[evt][hst].guests =
			JSON.parse( JSON.stringify(this.summary[evt][hst].hosts));
		delete this.summary[evt][hst].overAllocatedSeats;
		delete this.summary[evt][hst].unAssignedSeatCnt;
		delete this.aGs[evt][hst];
		
		transferArrayItem(
			hostDrop.previousContainer.data,
			hostDrop.container.data,
			hostDrop.previousIndex,
			hostDrop.currentIndex
		)
		if (this.debug) {
			console.log('\tChecking other events...:')
		}
		for ( const e of this.events ) {
			if (this.debug) {
				console.log(
					'\t\tevent:',	e,
					'host count:',	this.unHs[e].length,
					'...'
				)
			}
			for ( const h in this.unHs[e] ) {
				if ( this.unHs[e][h].hostKey === hst ) {
					if (this.debug) {
						console.log(
							'\t\t\thost#' + h, ':',
							this.unHs[e][h].hostKey,
							'\tdisable?\t', false
						)
					}
					this.unHs[e][h].isDisabled = false;
				}
			}
		}
		this.calcTotals('deAssignGuest()');
	}
	
	autoAllocate(ctx: string) {
		let events: string[];
		if (ctx === 'all') {
			events = Object.keys(this.unHs)
		} else {
			events = [ctx]
		}

		// TODO: revisit random-ish auto-assigned hosts

		events.every(
			event =>
				this.unHs[event].sort(
					() => Math.random() - 0.5
				)
		);
		for (const evt of events) {
			let hstIdx = 0;
			while (
				this.summary[evt].allocatedSeatCnt <
				this.summary[evt].rsvps  &&
				this.unHs[evt][hstIdx] !== undefined
			) {
				if (!this.unHs[evt][hstIdx].isDisabled) {
					const hst = this.unHs[evt][hstIdx].hostKey;
					this.allocateHost(evt, hst, hstIdx);
				} else { hstIdx++ }
			}
		}
	}
	
	allocateHost(
		evt:			string,
		hst:			string,
		prevHostIndex:	number,
		hostDrop?:		CdkDragDrop<any[]>
	) {
		if (this.debug) {
			console.log(
				'\tAllocating:', evt, hst, prevHostIndex, hostDrop
			)
		}
		if (hostDrop) {
			transferArrayItem(
				hostDrop.previousContainer.data,
				hostDrop.container.data,
				hostDrop.previousIndex,
				hostDrop.currentIndex
			)
		} else {
			this.aHs[evt].push(
				...this.unHs[evt].splice(prevHostIndex, 1)
			);
			this.summary[evt][hst].isAllocated = true;
		}
		this.aGs[evt][hst] = [];
		for (const e of this.events) {
			if (e !== evt) {
				for (const h in this.unHs[e]) {
					if (this.unHs[e][h].hostKey === hst) {
						this.unHs[e][h].isDisabled = true
					}
				}
			}
		}
		this.assignGuest(evt, hst, hst);
	}
	
	deAssignGuest(
		evt:			string,
		hst:			string,
		gst:			string,
		prevGuestIndex:	number,
		guestDrop?:		CdkDragDrop<any[]>
	) {
		if (guestDrop) {
			const fromHost	= guestDrop.previousContainer.data;
			const toHost	= guestDrop.container.data;
			const fromIdx	= guestDrop.previousIndex;
			const toIdx		= guestDrop.currentIndex;
			transferArrayItem(fromHost, toHost, fromIdx, toIdx);
			const fromHst	= guestDrop.previousContainer.id;
			const toHst		= guestDrop.container.id;
			this.rePair(evt, fromHst, toHst, gst);
		} else {
			this.unGs[evt].push(
				...this.aGs[evt][hst].splice(prevGuestIndex, 1)
			);
			this.rePair(evt, hst, 'unassigned', gst);
		}
		this.calcTotals('deAssignGuest()');
	}
	
	assignGuest(
		evt: string,
		hst: string,
		gst: string,
		guestDrop?:	CdkDragDrop<any[]>
	): boolean {
		let success = false;
		if (hst === gst) {
			const fromIdx = this.unGs[evt].findIndex(
				guest => guest.guestKey === gst
			);
			const newGuestIdx = this.aGs[evt][hst].push(
				...this.unGs[evt].splice(fromIdx, 1)) - 1;
			this.aGs[evt][hst][newGuestIdx].isDisabled = true;
			success = true;
		} else {
			if (guestDrop) {
				const fromHost	= guestDrop.previousContainer.data;
				const toHost	= guestDrop.container.data;
				const fromIdx	= guestDrop.previousIndex;
				const toIdx		= guestDrop.currentIndex;
				transferArrayItem(fromHost, toHost, fromIdx, toIdx);
				const fromHst	= guestDrop.previousContainer.id;
				const toHst		= guestDrop.container.id;
				this.rePair(evt, fromHst, toHst, gst);
			} else {
				///////////////////////////////////  MANUAL GUEST ASSIGNMENTS //
				if (
					this.aGs[evt][hst].every(
						(aG: {guestKey: string}) =>
							this.summary.pairs[gst].includes(aG.guestKey)
					)
				) {
					let fromHst:	string;
					let toIdx:		number;
					let fromIdx =
						this.unGs[evt].findIndex(
							guest => guest.guestKey === gst
						);
					if (fromIdx < 0) {
						///////////////////////////////////////  host -> host //
						for (const host of this.aGs[evt]) {
							fromHst	= host.hostKey;
							fromIdx	=
								this.aGs[evt][host.hostKey].findIndex(
									(guest: any) =>
										guest.guestKey === gst
								);
							if (this.debug) {
								console.log(
									'\tChecking' + host.hostKey,
									'for:', gst
								)
							}
							if (fromIdx > 0) {
								if (this.debug) {
									console.log(
										'\t\tFOUND IT:', host.hostKey,
										'--->', fromIdx
									)
								}
								toIdx = this.aGs[evt][hst].push(
									...this.aGs[evt][fromHst].splice(
										fromIdx, 1
									)
								)
								this.rePair(evt, fromHst, hst, gst);
								success = true;
								break
							}
						}
					} else {
						/////////////////////////////////  unassigned -> host //
						this.aGs[evt][hst].push(
							...this.unGs[evt].splice(
								fromIdx, 1
							)
						)
						this.rePair(
							evt, 'unassigned', hst, gst
						);
						success = true;
					}
				} else { success = false }
			}
		}
		this.calcTotals('assignGuest()');
		return success
	}
	rePair(
		evt:		string,
		fromHost:	string,
		toHost:		string,
		gst:		string
	) {
		if (this.debug) {
			console.log(
				'rePair()\tevent:', evt,
				'guest-plan-list:', gst,
				'from:',			fromHost,
				'to:',				toHost
			)
		}
		const fromGuests	= this.aGs[evt][fromHost];
		const toGuests		= this.aGs[evt][toHost];
		if ( fromHost !== 'unassigned' ) {
			if (this.debug) {
				console.log(
					'\tassignGuest()\tUn-pairing guests of:',
					fromHost + '...'
				)
			}
			for ( const fromGuest of fromGuests ) {
				const fGst = fromGuest.guestKey;
				if (this.debug) {
					console.log('\t\t', gst, '--->', fGst);
					console.log('\t\t', gst, '<---', fGst);
				}
				this.summary.pairs[fGst].push(gst);
				this.summary.pairs[gst].push(fGst);
			}
		}
		if ( toHost !== 'unassigned' ) {
			if (this.debug) {
				console.log(
					'\tassignGuest()\tRe-pairing guests of:',
					toHost + '...'
				)
			}
			for (const toGuest of toGuests) {
				const tGst = toGuest.guestKey;
				if (gst !== tGst) {
					if (this.debug) {
						console.log(
							'\t\t', gst,
							'--->', tGst, 'idx:',
							this.summary.pairs[gst].indexOf(tGst)
						);
						console.log(
							'\t\t', gst,
							'<---', tGst, 'idx:',
							this.summary.pairs[gst].indexOf(gst)
						);
					}
					this.summary.pairs[gst].splice(
						this.summary.pairs[gst].indexOf(tGst), 1
					);
					this.summary.pairs[tGst].splice(
						this.summary.pairs[tGst].indexOf(gst), 1
					)
				}
			}
		}
	}

	////////////////////////////////////////////////////////////////  HELPERS //
	pairsPredicate() {
		return (gstDrag: CdkDrag, hstDrop: CdkDropList) => {
		const guests: any	= [];
		const gst			= gstDrag.data.guestKey
		guests.push(...hstDrop.data);
		return guests.every(
			(guest: {guestKey: string}) =>
				this.summary.pairs[gst].includes(guest.guestKey ) ||
					hstDrop.id === 'unassigned')
		}
	}
	
	allocateUniqs() {
		const events = Object.keys(this.unHs);
		const uniqs = [];
		for (const evt1 of events) {
			for (const hst1 of this.unHs[evt1]) {
				const searchObj = {
					event:	hst1.event,
					host:	hst1.hostKey,
					unique:	true
				};
				for (const evt2 of events) {
					if (evt1 !== evt2) {
						for (const hst2 of this.unHs[evt2]) {
							if (searchObj.host === hst2.hostKey) {
								searchObj.unique = false;
								break
							}
						}
					}
					if (!searchObj.unique) { break }
				}
				if (searchObj.unique) {
					uniqs.push(searchObj)
				}
			}
		}
		for (const uniq of uniqs) {
			const uniqEvt = uniq.event;
			const uniqHst = uniq.host;
			for (const evt of this.events) {
				if (evt === uniqEvt) {
					let hCnt = 0;
					for (const hst of this.unHs[evt]) {
						if (hst.hostKey === uniqHst) {
							this.allocateHost(evt, uniqHst, hCnt);
							break
						}
						hCnt++
					}
				}
			}
		}
	}
	
	nextStep() {
		this.step++
	}
	
	prevStep() {
		this.step--
	}

	setStep(index: number) {
		this.step = index
	}
}

// presbies:Array<Presby>=[];
// toPlanUpdate(){this.router.navigate(['/plan', this.planId, 'update']).then()}
// cancelVersion(){this.toPlanUpdate()}
// selector:'app-version-plan-update',
// styleUrls:['./version-update.component.sass']
