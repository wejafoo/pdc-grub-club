

import { environment	} from '../../../../environments/environment';
import { ActivatedRoute	} from '@angular/router';
import { Component		} from '@angular/core';
import { Input			} from '@angular/core';
import { OnChanges		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { PlanService	} from '../../services/plan.service';
import { Events			} from '../../models/plan';
import { Plans			} from '../../models/plan';

@Component({
	selector: 'app-event-list',
	templateUrl: './event-list.component.html',
	styleUrls: ['./event-list.component.sass']
})

export class EventListComponent implements OnInit, OnChanges {
	env:		any;
	debug:		boolean;
	events!:	Events;
	selectedEventId	= 0;
	selectedPlanId	= 0;
	@Input() plans!: Plans;
	
	constructor (
		public	ps:		PlanService,
		public	route:	ActivatedRoute,
		public	router:	Router
	) {
		this.env	= environment;
		this.debug	= this.env.debug
	}
	
	ngOnInit()		{}
	ngOnChanges()	{}
	addEvent()		{ this.ps.addEvent( this.selectedPlanId )}
	
	updateEvent( eventId: number )	{
		this.router.navigate(['/plan', this.selectedPlanId, 'event', this.selectedEventId, 'update']).then(r => { if (this.debug) console.log(r)})
	}
	
	removeEvent( eventId: number )	{
		this.ps.removeEvent( this.selectedPlanId, eventId );
		this.router.navigate(['/plan', this.selectedPlanId, 'event']).then(r => { if (this.debug) console.log(r)})
	}
}
