

import { environment			} from '../../../environments/environment';
import { ActivatedRoute			} from '@angular/router';
import { Component				} from '@angular/core';
import { OnInit					} from '@angular/core';
import { Router					} from '@angular/router';
import { Observable				} from 'rxjs';
import { of						} from 'rxjs';
import { switchMap				} from 'rxjs/operators';
import { DialogService			} from '../../services/dialog.service';
import { Plan					} from '../models/plan';
import { Event					} from '../models/plan';
import { PlanService			} from '../services/plan.service';

// import { ActivatedRouteSnapshot	} from '@angular/router';
// import { RouterStateSnapshot		} from '@angular/router';

@Component({
	selector: 'app-plan-update',
	templateUrl: './plan-update.component.html',
	styleUrls: ['./plan-update.component.sass']
})

export class PlanUpdateComponent implements OnInit {
	env:			any;
	debug:			boolean;
	plan!:			Plan;
	updatePlan!:	Plan;
	eventId!:		number;
	planId!:		number;
	eventNameSlug = 'Mama gotta brand new event - owwwww!'
	JSON:			JSON;
	
	// public	ars:	ActivatedRouteSnapshot,
	// public	state:	RouterStateSnapshot,

	constructor (
		public	dialog:	DialogService,
		public	ps:		PlanService,
		public	route:	ActivatedRoute,
		public	router:	Router
	) {
		this.env	= environment;
		this.debug	= this.env.debug;
		this.JSON	= JSON
	}
	
	ngOnInit() {
		this.route.paramMap.pipe( switchMap(params => of( params.get( 'planId'	)))).subscribe(planId => {
			this.planId		= +planId!;
			this.updatePlan	= JSON.parse( JSON.stringify( this.ps.getPlan( this.planId )));
			this.plan		= JSON.parse( JSON.stringify( this.ps.getPlan( this.planId )));
			if (this.debug) console.log ( 'param-planId:', typeof this.planId, this.planId )
		});
		
		this.route.paramMap.pipe( switchMap(params => of( params.get( 'eventId'	)))).subscribe(eventId => {
			this.eventId = +eventId!;
			if (this.debug) console.log ( 'param-eventId:', typeof this.eventId, this.eventId )
		})
	}
	
	addEvent() {
		const nextEventId		= this.updatePlan.events!.length + 1;
		if (this.debug) console.log( 'Next up Event #', nextEventId );
		const nextEvent: Event	= { id: nextEventId, name: this.eventNameSlug };
		
		this.updatePlan.events!.push( nextEvent )																		// Todo: clean up array push with object.array or something
	}
	
	cancel() { this.toPlans() }
	
	canDeactivate(): Observable<boolean> | boolean {
		if ( JSON.stringify(this.plan) === JSON.stringify(this.updatePlan)) return true;
		return this.dialog.confirm( 'Abandon changes?' )
	}
	
	removeEvent( eventId: number ) {
		const itemToRemoveIndex = this.updatePlan.events!.findIndex( event => event.id === eventId );
		if (this.debug) console.log( 'Removing event#', itemToRemoveIndex );
		if ( itemToRemoveIndex !== -1 ) this.updatePlan.events!.splice( itemToRemoveIndex, 1 );
		if (this.debug) console.log( 'New array:', this.updatePlan );
	}

	reviewPlan() { this.router.navigate(['/plan', this.planId]).then(r => {if (this.debug) console.log(r)})}
	
	save() {
		this.plan = JSON.parse(JSON.stringify(this.updatePlan));
		this.ps.updatePlan( this.plan );
		this.reviewPlan()
	}

	toPlans() { this.router.navigate(['/plans']).then(r => {if (this.debug) console.log(r)})}
	
	updateEvent( eventId: number ) {}
}
