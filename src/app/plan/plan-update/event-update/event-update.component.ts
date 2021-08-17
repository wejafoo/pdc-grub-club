

import { environment	} from '../../../../environments/environment';
import { ActivatedRoute	} from '@angular/router';
import {Component, Input} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { Observable		} from 'rxjs';
import { of				} from 'rxjs';
import { switchMap		} from 'rxjs/operators';
import { DialogService	} from '../../../services/dialog.service';
import { Event			} from '../../models/plan';
import { Plan			} from '../../models/plan';
import { PlanService	} from '../../services/plan.service';

@Component({
	selector: 'app-event-detail-update',
	templateUrl: './event-update.component.html',
	styleUrls: ['./event-update.component.sass']
})

export class EventUpdateComponent implements OnInit {
	env:		any;
	debug:		boolean;
	plan!:		Plan;
	eventId!:	number;
	planId!:	number;
	eventNameSlug = 'Mama gotta brand new event - owwwww!'

	@Input() updatePlan!: Plan;
	
	constructor (
		public	dialog:	DialogService,
		public	ps:		PlanService,
		public	route:	ActivatedRoute,
		public	router:	Router
	) {
		this.env	= environment;
		this.debug	= this.env.debug
	}
	
	ngOnInit() {
		this.route.paramMap.pipe( switchMap(params => of( params.get( 'eventId')))).subscribe(d => { this.planId = +d! });
		if (this.debug) console.log( 'init: updatePlan.id:', this.updatePlan.id, 'route -> planID:', this.planId );
		this.plan = JSON.parse( JSON.stringify( this.ps.getPlan( this.planId )));
	}
	
	addEvent() {
		const nextEventId		= this.updatePlan.events!.length + 1;
		if (this.debug) console.log( 'Next event #' + nextEventId );
		const nextEvent: Event	= { id: nextEventId, name: this.eventNameSlug };

		this.updatePlan.events.push( nextEvent )
	}
	
	
	editEvent( eventId: number ) {}
	
	removeEvent( eventId: number ) {
		const itemToRemoveIndex = this.updatePlan.events!.findIndex( event => event.id === eventId );
		if (this.debug) console.log( 'Removing event#', itemToRemoveIndex );
		if ( itemToRemoveIndex !== -1 ) this.updatePlan.events!.splice( itemToRemoveIndex, 1 );
		if (this.debug) console.log( 'New array:', this.updatePlan );
	}
	
	save() {
		this.plan = JSON.parse( JSON.stringify( this.updatePlan ));
		this.ps.updatePlan( this.plan );
		this.reviewPlan()
	}
	
	cancel() {
		this.updatePlan = this.plan;
		this.toPlans()
	}
	
	canDeactivate(): Observable<boolean> | boolean {
		if (this.debug) console.log( '!!!! canDeactivate:     plan =>', this.plan		);
		if (this.debug) console.log( '!!!! canDeactivate: editPlan =>', this.updatePlan	);
		if ( JSON.stringify(this.plan)  ===  JSON.stringify(this.updatePlan))  return true;

		return this.dialog.confirm( 'Abandon changes?' )
	}
	
	reviewPlan() { this.router.navigate(['/plan', this.planId]).then(r => {if (this.debug) console.log(r)})}
	
	toPlans() { this.router.navigate(['/plans']).then(r => {if (this.debug) console.log(r)})}
}
