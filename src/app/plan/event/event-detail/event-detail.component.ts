

import { environment	} from '../../../../environments/environment';
import { Component		} from '@angular/core';
import { Input			} from '@angular/core';
import { OnChanges 		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { SimpleChanges	} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router			} from '@angular/router';
import { Plan			} from '../../models/plan';

@Component({
	selector: 'app-event-detail',
	templateUrl: './event-detail.component.html',
	styleUrls: ['./event-detail.component.sass']
})

export class EventDetailComponent implements OnInit, OnChanges {
	env:			any;
	debug:			boolean;
	eventIndex!:	number;
	
	@Input() eventId!:		number;
	@Input() planId!:		number;
	@Input() updatePlan!:	Plan;
	
	constructor (
		private	route:	ActivatedRoute,
		private	router:	Router
	) {
		this.env	= environment;
		this.debug	= this.env.debug;
	}
	
	ngOnInit() {
		this.eventIndex = this.updatePlan.events.findIndex( event => event.id === this.eventId );
		if (this.debug) console.log ( 'Using event key:', this.eventIndex , 'with:', this.updatePlan.events  )
	}
	
	ngOnChanges( changes: SimpleChanges ) {
		if (this.debug) {
			console.log( 'Incoming plan:',			this.updatePlan	);
			console.log( 'Incoming route planId:',	this.planId		);
			console.log( 'Incoming route eventId:',	this.eventId	);
		}
		this.eventIndex = this.updatePlan.events.findIndex( event => event.id === this.eventId );
		if (this.debug) console.log ( 'Using NEW event key:', this.eventIndex , 'with:', this.updatePlan.events  )
	}

	toPlans() { this.router.navigate(['/plan']).then(r => { if (this.debug) console.log(r)})}
}
