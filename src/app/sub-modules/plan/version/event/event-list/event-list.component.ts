

import { environment	} from '../../../../../../environments/environment';
import { Component		} from '@angular/core';
import { Input			} from '@angular/core';
import { Router			} from '@angular/router';
import { PlanService	} from '../../../services/plan.service';
import { Events			} from '../../../../models/plan';
import { Plans			} from '../../../../models/plan';

@Component({templateUrl: './event-list.component.html'})
export class EventListComponent {
	env:			any;
	debug:			boolean;
	events:			Events;
	@Input() plans:	Plans;

	selectedEventId	= 0;
	selectedPlanId	= 0;
	
	constructor (
		public	ps:		PlanService,
		public	router:	Router
	) {
		this.env	= environment;
		this.debug	= this.env.debug;
		console.log('>>> EventListComponent');
	}
	
	addEvent() {
		this.ps.addEvent(this.selectedPlanId, 'New Event')
	}

	rmEvent(eventId: number) {
		this.ps.rmEvent(eventId);
		this.router.navigate(['/plan', 's']).then();
	}

	updateEvent() {
		this.router.navigate(
			['/plan', this.selectedPlanId, 'event', this.selectedEventId, 'update']
		).then()
	}
}

// this.router.navigate(['/plan',this.selectedPlanId,'event']).then(r=>{console.log(r)})
// import {OnChanges} from '@angular/core';
// import {OnInit} from '@angular/core';
// import {ActivatedRoute} from '@angular/router';
// public route: ActivatedRoute,
// export class EventListComponent implements OnInit, OnChanges {
// ngOnInit(){}
// ngOnChanges(){}
