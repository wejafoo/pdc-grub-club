

import { environment	} from '../../../../../../environments/environment';
import { Component		} from '@angular/core';
import { Input			} from '@angular/core';
import { OnChanges 		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { SimpleChanges	} from '@angular/core';
import { Plan			} from '../../../../../../../.ARCHIVE/models/plan';
import { Version		} from '../../../../../../../.ARCHIVE/models/plan';

// import{ActivatedRoute} from '@angular/router';
// import{Router} from '@angular/router';

@Component({
	selector: 'app-event-plan-list-host-detail',
	templateUrl: './event-detail.component.html',
	styleUrls: ['./event-detail.component.sass']
})
export class EventDetailComponent implements OnInit, OnChanges {
	env:			any;
	debug:			boolean;
	eventIndex!:	number;
	
	@Input() eventId!:	number;
	@Input() ver!:		Version;
	@Input() planId!:	number;
	@Input() plan!:		Plan;
	
	// private route: ActivatedRoute,
	// private router: Router
	constructor () {
		this.env	= environment;
		this.debug	= this.env.debug;
		console.log('>>> EventDetailComponent');
	}
	
	ngOnInit() { this.eventIndex = this.ver.events.findIndex(event => event.id === this.eventId)}
	
	ngOnChanges( changes: SimpleChanges) {
		this.eventIndex = this.ver.events.findIndex(event => event.id === this.eventId)
	}
	
}

// toPlans() { this.router.navigate(['/plan']).then(r => {console.log(r)})}
