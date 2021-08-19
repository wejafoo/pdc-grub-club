

import { environment		} from '../../../environments/environment';
import { Injectable			} from '@angular/core';
import { BehaviorSubject	} from 'rxjs';
import { Event				} from '../models/plan';
import { Plan				} from '../models/plan';
import { Plans				} from '../models/plan';
import { PLANS				} from '../models/mock-plans';

@Injectable({ providedIn: 'root' })

export class PlanService {
	env:	any;
	debug:	boolean;
	plans: Plans	= PLANS;
	nextPlanId		= 100;
	nextEventId		= 100;
	planNameSlug	= 'Presbies gotta brand new PLAN - owwwww!'
	eventNameSlug	= 'Presbies gotta brand new EVENT - owwwww!';
	planSubject		= new BehaviorSubject<Plans>( this.plans );
	
	constructor () {
		this.env	= environment;
		this.debug	= this.env.debug;
	}
	
	getPlan( newId: number ) {
		return this.plans.find( ( plan: Plan ) => {
			if ( plan.id === newId ) return plan;
			return undefined
		})
	}
	
	getEventIndex( plan: Plan, eventId: number ): number {
		return plan.events.findIndex( event => event.id === eventId )
	}
	
	addEvent( planID: number, name?: string ): number {
		if ( name ) {
			name = name.trim();
			const event: Event = { id: ++this.nextEventId, name };
			this.plans[planID].events!.push( event );
		} else {
			const event: Event = { id: this.nextPlanId++, name: this.eventNameSlug };
			this.plans[planID].events!.push( event );
		}
		if (this.debug) console.log( 'planService->addEvent():', this.nextEventId + ' - ' + this.eventNameSlug );
		this.planSubject.next( this.plans );
		
		return this.nextEventId
	}
	
	addPlan( name?: string ): number {
		const defaultEvents		= [{ id: 1, name: this.eventNameSlug }];
		
		if ( name ) {
			name = name.trim();
			const plan: Plan = { id: ++this.nextPlanId, name, events: defaultEvents };
			this.plans.push( plan );
		} else {
			const plan = { id: this.nextPlanId++, name: this.planNameSlug, events: defaultEvents };
			this.plans.push( plan )
		}
		if ( this.debug ) console.log( 'planService->addPlan():', this.nextPlanId + ' - ' + this.planNameSlug );
		this.planSubject.next( this.plans );
		
		return this.nextPlanId
	}
	
	removeEvent( planId: number, eventId: number ) {
		const planIndex		= this.plans.findIndex(( plan: any ) => plan.id === planId );
		const eventIndex	= this.plans[planIndex].events!.findIndex(( event: any ) => event.id === eventId );
		
		if (this.debug) console.log( 'Removing:', eventIndex, ' from:', planIndex );
		if ( eventIndex !== -1 ) this.plans[planIndex].events!.splice( eventIndex, 1 );
		if (this.debug) console.log( 'New array:', this.plans );
		
		this.planSubject.next(this.plans);
	}
	
	removePlan( id: number ) {
		const itemToRemoveIndex = this.plans.findIndex( plan => plan.id === id );
		
		if (this.debug) console.log( 'Removing:', itemToRemoveIndex );
		if ( itemToRemoveIndex !== -1 ) this.plans.splice( itemToRemoveIndex, 1 );
		if (this.debug) console.log( 'New array:', this.plans );
		
		this.planSubject.next( this.plans );
	}
	
	updatePlan( updatePlan: Plan ) {
		const itemToUpdateIndex = this.plans.findIndex(( plan: any ) => plan.id === updatePlan.id );
		if (this.debug) console.log( 'Updating:', typeof itemToUpdateIndex, itemToUpdateIndex );
		
		if ( itemToUpdateIndex !== -1 ) this.plans.splice( itemToUpdateIndex, 1, updatePlan );
		if (this.debug) console.log( 'New array:', this.plans );
		
		this.planSubject.next( this.plans );
	}
}
