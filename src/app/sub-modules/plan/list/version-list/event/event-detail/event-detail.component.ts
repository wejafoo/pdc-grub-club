

import { environment	} from '../../../../../../../environments/environment';
import { Component		} from '@angular/core';
import { Input			} from '@angular/core';
import { OnChanges 		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { SimpleChanges	} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router			} from '@angular/router';
import { Plan			} from '../../../../../../../../.ARCHIVE/models/plan';
import { Version		} from '../../../../../../../../.ARCHIVE/models/plan';

@Component({
	selector: 'app-event-detail',
	templateUrl: './event-detail.component.html',
	styleUrls: ['./event-detail.component.sass']
})

export class EventDetailComponent implements OnInit, OnChanges {
	env:				any;
	debug:				boolean;
	eventIndex!:		number;
	@Input() eventId!:	number;
	@Input() ver!:		Version;
	@Input() planId!:	number;
	@Input() plan!:		Plan;
	
	constructor (
		private	route:	ActivatedRoute,
		private	router:	Router
	) {
		this.env	= environment;
		this.debug	= this.env.debug
	}
	
	toPlans		(							) { this.router.navigate(['/plan']).then(r => {console.log(r)})			}
	ngOnInit	(							) { this.eventIndex = this.ver.events.findIndex(event => event.id === this.eventId)	}
	ngOnChanges ( changes: SimpleChanges	) { this.eventIndex = this.ver.events.findIndex(event => event.id === this.eventId)	}
}
