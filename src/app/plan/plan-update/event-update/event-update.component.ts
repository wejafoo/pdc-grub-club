

import { environment	} from '../../../../environments/environment';
import { ActivatedRoute	} from '@angular/router';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { Observable		} from 'rxjs';
import { of				} from 'rxjs';
import { switchMap		} from 'rxjs/operators';
import { DialogService	} from '../../../services/dialog.service';
import { Plan			} from '../../models/plan';
import { PlanService	} from '../../services/plan.service';

@Component({
	selector: 'app-event-detail-update',
	templateUrl: './event-update.component.html',
	styleUrls: ['./event-update.component.sass']
})

export class EventUpdateComponent implements OnInit {

	env:			any;
	debug:			boolean;
	plan!:			Plan;
	updatePlan!:	Plan;
	eventId!:		number;
	planId!:		number;
	eventNameSlug = 'Mama gotta brand new event - owwwww!'
	JSON:			JSON;
	eventKey!:		number;
	planKey!:		number;

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
	
	cancel() { this.toPlan() }

	save() {
		this.plan = JSON.parse(JSON.stringify(this.updatePlan));
		this.ps.updatePlan( this.plan );
		this.toPlan()
	}
	
	canDeactivate(): Observable<boolean> | boolean {
		if ( JSON.stringify(this.plan) === JSON.stringify(this.updatePlan)) return true;
		return this.dialog.confirm( 'Abandon changes?' )
	}
	
	reviewEvent()	{ this.router.navigate(['/plan', this.planId]).then(r => {if (this.debug) console.log(r)})}
	toPlan()		{ this.router.navigate(['/plan', this.planId, 'update', 'event', this.eventId	]).then(r => {if (this.debug) console.log(r)})}
	toPlans()		{ this.router.navigate(['/plans']).then(r => {if (this.debug) console.log(r)})}
}
