

import { environment		} from '../../../environments/environment';
import { Injectable			} from '@angular/core';
import { BehaviorSubject	} from 'rxjs';
import { Event				} from '../../../../.ARCHIVE/models/plan';
import { Plan				} from '../../../../.ARCHIVE/models/plan';
import { Plans				} from '../../../../.ARCHIVE/models/plan';
import { Version			} from '../../../../.ARCHIVE/models/plan';
import { Versions			} from '../../../../.ARCHIVE/models/plan';
import { PLANS				} from '../../../../.ARCHIVE/models/mock-plans';

// import { VERSIONS } from '../../../../.ARCHIVE/models/mock-plans';
// import { Events } from '../../../../.ARCHIVE/models/plan';

@Injectable({ providedIn: 'root' })

export class PlanService {
	env:		any;
	debug:		boolean;
	plan!:		Plan;
	version!:	Version;
	plans:		Plans	= PLANS;
	nextPlanId			= 100;
	nextEventId			= 100;
	planNameSlug		= 'Presbies gotta brand new PLAN - owwwww!'
	eventNameSlug		= 'Presbies gotta brand new EVENT - owwwww!';
	planSubject			= new BehaviorSubject<Plans>(this.plans);
	
	
	constructor () {
		this.env	= environment;
		this.debug	= this.env.debug
	}

	getPlan ( planId: number ) {
		return this.plans.find(( plan: Plan ) => {
			if ( plan.id === planId ) {
				this.plan = plan;
				return plan
			} else { return undefined }
		})
	}
	
	// addPlan ( name?: string, versions?: Versions ): number {
	addPlan ( name?: string ): number {
		// const defaultEvents = [{ id: 1, name: this.eventNameSlug }];
		
		if ( name ) {
			name = name.trim();
			const newPlan: Plan = { id: ++this.nextPlanId, name, versions: [] };
			this.plans.push( newPlan );
		} else {
			const firstPlan: Plan = { id: ++this.nextPlanId, name: 'new plan name', versions: []};
			this.plans.push( firstPlan )
		}
		this.planSubject.next( this.plans );
		return this.nextPlanId
	}
	
	
	setPlan ( planId: number ) {
		return this.plans.find(( plan: Plan ) => {
			if ( plan.id === planId ) {
				this.plan = plan;
				return plan
			} else { return undefined }
		})
	}
	
	addVersion ( version: Version ) {
		this.plan.versions.push(version);
		this.setVersion(version.id)
	}
	getVersion		(								): Version	{ return this.version													}
	getVersions		(								): Versions	{ return this.plan.versions												}
	getEventIndex	( plan: Plan, eventId: number	): number	{ return this.version.events.findIndex( event => event.id === eventId )	}
	setVersion		( versionId: number				): void		{ this.version = this.plan.versions[versionId]}
	addEvent		( planID: number, name?: string ): number	{
		if ( name ) {
			name = name.trim();
			const event: Event = { id: ++this.nextEventId, name };
			this.version.events.push( event );
		} else {
			const event: Event = { id: this.nextPlanId++, name: this.eventNameSlug };
			this.version.events.push( event );
		}
		this.planSubject.next( this.plans );
		return this.nextEventId
	}
	
	removeEvent ( eventId: number ) {
		const eventIndex = this.version.events.findIndex( event => event.id === eventId );
		if ( eventIndex !== -1 ) this.version.events.splice( eventId, 1 );
		if (this.debug) console.log( 'New array:', this.plans );
		
		this.planSubject.next(this.plans);
	}
	
	removePlan ( id: number ) {
		const itemToRemoveIndex = this.plans.findIndex( plan => plan.id === id );
		if ( itemToRemoveIndex !== -1 ) this.plans.splice( itemToRemoveIndex, 1 );
		this.planSubject.next( this.plans );
	}
	
	updatePlan ( update: Plan ) {
		const itemToUpdateIndex = this.plans.findIndex(plan => plan.id === update.id);
		console.log ( '!!!!!!! UPDATING PLAN:', update.id );
		if ( itemToUpdateIndex !== -1 ) this.plans.splice(itemToUpdateIndex, 1, update);
		this.planSubject.next(this.plans)
	}

	rmVersion ( versionId: number ): boolean {
		const planIdx		= this.plans.findIndex( plan => plan.id === this.plan.id );
		const versionIndex	= this.plan.versions.findIndex( version => version.id === versionId );
		console.log( 'PlanService -> rmVersion(planId, versionId):', this.plan.id, versionId );
		console.log( 'PlanService -> rmVersion() -> (planIndex, versionIndex):', planIdx, versionIndex );
		this.plans[planIdx].versions.splice( versionId, 1 );
		this.plan.versions.splice(versionId, 1);
		this.planSubject.next( this.plans );
	
		return this.plan.versions.findIndex(version => version.id === versionId) === -1;
	}
}




