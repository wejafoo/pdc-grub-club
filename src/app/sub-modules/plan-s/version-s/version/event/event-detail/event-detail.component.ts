

import { environment	} from '../../../../../../../environments/environment';
import { Component		} from '@angular/core';
import { Input			} from '@angular/core';
import { OnChanges 		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { SimpleChanges	} from '@angular/core';

import { Plan		} from '../../../../../models/plan';
import { Version	} from '../../../../../models/plan';

@Component({
	selector: 'app-event-plan-list-host-detail',
	templateUrl: './event-detail.component.html',
	styleUrls: ['./event-detail.component.sass']
})
export class EventDetailComponent implements OnInit, OnChanges {
	env:				any;
	debug:				boolean;
	eventIndex:			number;
	@Input() eventId:	number;
	@Input() ver:		Version;
	@Input() planId:	number;
	@Input() plan!:		Plan;

	constructor () {
		this.env	= environment;
		this.debug	= this.env.debug;
		console.log('>>> EventDetailComponent');
	}
	
	ngOnInit() {
		this.eventIndex = this.ver.events.findIndex(event => event.id === this.eventId)
	}
	
	ngOnChanges( changes: SimpleChanges) {
		this.eventIndex = this.ver.events.findIndex(event => event.id === this.eventId)
	}
	
}

// import{ActivatedRoute} from '@angular/router';
// import{Router} from '@angular/router';
// private route: ActivatedRoute,
// private router: Router
// toPlans() { this.router.navigate(['/plan']).then(r => {console.log(r)})}
