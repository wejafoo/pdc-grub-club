

import { environment	} from '../../../../environments/environment';
import { Injectable		} from '@angular/core';

import { BehaviorSubject	} from 'rxjs';

import { Event		} from '../../models/plan';
import { Plan		} from '../../models/plan';
import { Plans		} from '../../models/plan';
import { Version	} from '../../models/plan';
import { PLANS		} from '../../models/mock-plans';

@Injectable({ providedIn: 'root' })
export class PlanService {
	env:		any;
	debug:		boolean;
	plan:		Plan | undefined;
	plans:		Plans = PLANS;
	version:	Version;
	
	nextPlanId	= 100;
	nextEventId	= 100;
	planSubject	= new BehaviorSubject<Plans>(this.plans);
	
	constructor () {
		this.env	= environment;
		this.debug	= this.env.debug;
		console.log('>>> PlanService');
	}
	
	addEvent(planID: number, name: string): number	{
		name				= name.trim();
		const event: Event	= {id: ++this.nextEventId, name};
		this.version.events.push(event);
		this.planSubject.next(this.plans);
		return this.nextEventId;
	}
	
	addPlan(name: string): number {
		if (name) {
			name = name.trim();
			const newPlan: Plan = {id: ++this.nextPlanId, name, versions: []};
			this.plans.push(newPlan);
		} else {
			const firstPlan: Plan = {id: ++this.nextPlanId, name: 'new plan name', versions: []};
			this.plans.push(firstPlan);
		}
		this.planSubject.next(this.plans);
		return this.nextPlanId;
	}
	
	addVersion(version: Version) {
		this.plan.versions.push(version);
		this.setVersion(version.id);
	}
	
	getPlan(planId: number) {
		return this.plans.find(( plan: Plan ) => {
			if ( plan.id === planId ) {
				this.plan = plan;
				return plan;
			}
			return undefined;
		})
	}

	getVersion(): Version {
		return this.version;
	}
	
	rmEvent(eventId: number) {
		const eventIndex = this.version.events.findIndex(event => event.id === eventId);
		if ( eventIndex !== -1 ) this.version.events.splice(eventId, 1);
		this.planSubject.next(this.plans);
	}
	
	rmPlan(id: number) {
		const itemToRemoveIndex = this.plans.findIndex(plan => plan.id === id);
		if ( itemToRemoveIndex !== -1 ) this.plans.splice(itemToRemoveIndex, 1);
		this.planSubject.next(this.plans);
	}
	
	rmVer(versionId: number): boolean {
		const planIdx = this.plans.findIndex(plan => plan.id === this.plan.id);
		this.plans[planIdx].versions.splice(versionId, 1);
		this.plan.versions.splice(versionId, 1);
		this.planSubject.next(this.plans);
		return this.plan.versions.findIndex(version => version.id === versionId) === -1;
	}
	
	setPlan(planId: number) {
		return this.plans.find(( plan: Plan ) => {
			if ( plan.id === planId ) {
				this.plan = plan;
				return plan;
			}
			return undefined;
		})
	}
	
	setPlanVersion(planId: number, versionId: number): Version {
		this.plan		= this.plans.find((plan: Plan) => plan.id === planId);
		this.version	= this.plan.versions[versionId];
		return this.version;
	}
	
	setVersion(versionId: number): void { this.version = this.plan.versions[versionId]}
	
	updatePlan(update: Plan) {
		const itemToUpdateIndex = this.plans.findIndex(plan => plan.id === update.id);
		if ( itemToUpdateIndex !== -1 ) this.plans.splice(itemToUpdateIndex, 1, update);
		this.planSubject.next(this.plans)
	}
}
