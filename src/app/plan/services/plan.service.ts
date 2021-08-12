

import { environment		} from '../../../environments/environment';
import { Injectable			} from '@angular/core';
import { Plan				} from '../models/plan';
import { Plans				} from '../models/plan';
import { BehaviorSubject	} from 'rxjs';

/*
	import { PLANS			} from '../models/mock-plans';
	import { MessageService	} from '../../services/message.service';
	import { from			} from 'rxjs';
	import { Observable		} from 'rxjs';
	import { findIndex		} from 'rxjs/operators';
	import { find			} from 'rxjs/operators';
	import { map			} from 'rxjs/operators';
		private plans$: BehaviorSubject<Plan[]> = new BehaviorSubject<Plan[]>( PLANS );
		plans: Plan[] = PLANS;
		getPlans() { this.plans$.pipe( map(plans => this.plans = plans ))}
		addPlan( name?: string ): Plans {
		PLANS.push( plan );
		this.plans$.next( PLANS );
		return this.currentPlans
	constructor ( private messageService: MessageService ) {}
*/

@Injectable({ providedIn: 'root' })

export class PlanService {
	static	nextPlanId	= 100;
	env:	any;
	debug:	boolean;
	public	currentPlans:	Plans	= [
		{ id: 1, name: '2021' },
		{ id: 2, name: '2022' },
		{ id: 3, name: '2023' },
	];
	public planSubject = new BehaviorSubject<Plans>( this.currentPlans );

	constructor () {
		this.env	= environment;
		this.debug	= this.env.debug;
	}

	getPlan( newId: number ) {
		return this.currentPlans.find( ( plan: Plan ) => {
			if ( plan.id === newId ) return plan;
			return undefined
		})
	}

	removePlan( id: number ) {
		const itemToRemoveIndex = this.currentPlans.findIndex(( plan: any ) => plan.id === id );
		if ( this.debug ) console.log( 'Removing:', itemToRemoveIndex );
		if ( itemToRemoveIndex !== -1 ) this.currentPlans.splice( itemToRemoveIndex, 1 );					// proceed to remove an item only if it exists.
		console.log( 'New array:', this.currentPlans );
		this.planSubject.next( this.currentPlans );
	}
	
	addPlan( name?: string ) {
		const slug = 'Mama gotta brand new plan - owwwww!'
		if ( name ) {
			name = name.trim();
			const plan = { id: PlanService.nextPlanId++, name };
			this.currentPlans.push( plan );
		} else {
			const plan = { id: PlanService.nextPlanId++, name: slug };
			this.currentPlans.push( plan )
		}
		if ( this.debug ) console.log( 'planService->addPlan():', PlanService.nextPlanId - 1 + ' - ' + slug );
		this.planSubject.next( this.currentPlans );
	}
}
