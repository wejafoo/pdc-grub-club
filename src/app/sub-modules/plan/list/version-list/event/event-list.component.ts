

import { environment	} from '../../../../../../environments/environment';
import { ActivatedRoute	} from '@angular/router';
import { Component		} from '@angular/core';
import { Input			} from '@angular/core';
import { Router			} from '@angular/router';
import { Events			} from '../../../../../../../.ARCHIVE/models/plan';
import { Plans			} from '../../../../../../../.ARCHIVE/models/plan';
import { PlanService	} from '../../../services/plan.service';

// import { OnChanges	} from '@angular/core';
// import { OnInit		} from '@angular/core';

@Component({
	selector: 'app-event-list',
	templateUrl: './event-list.component.html',
	styleUrls: ['./event-list.component.sass']
})

// export class EventListComponent implements OnInit, OnChanges {
export class EventListComponent {
	env:				any;
	debug:				boolean;
	events!:			Events;
	@Input() plans!:	Plans;

	selectedEventId	= 0;
	selectedPlanId	= 0;
	
	constructor (
		public	ps:		PlanService,
		public	route:	ActivatedRoute,
		public	router:	Router
	) {
		this.env	= environment;
		this.debug	= this.env.debug
	}
	
	// ngOnInit		(){}
	// ngOnChanges	(){}
	addEvent	(					) { this.ps.addEvent( this.selectedPlanId )}
	updateEvent	(					) { this.router.navigate(['/plan', this.selectedPlanId, 'event', this.selectedEventId, 'update']).then(r => {console.log(r)})}
	removeEvent	( eventId: number	) {
		this.ps.removeEvent( eventId );
		this.router.navigate(['/plan', this.selectedPlanId, 'event']).then(r => {console.log(r)})
	}
	
}
