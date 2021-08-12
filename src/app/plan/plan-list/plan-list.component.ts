

import { environment		} from '../../../environments/environment';
import { ActivatedRoute		} from '@angular/router';
import { Component			} from '@angular/core';
import { Input				} from '@angular/core';
import { OnInit				} from '@angular/core';
import { Router				} from '@angular/router';
import { PlanService		} from '../services/plan.service';
import { Plans				} from '../models/plan';

/*
import { Plan				} from '../models/plan';
	import { Observable			} from 'rxjs';
	import { OnDestroy			} from '@angular/core';
	import { ParamMap			} from '@angular/router';
	import { Subscription		} from 'rxjs';
	import { switchMap			} from 'rxjs/operators';
	import { BehaviorSubject	} from 'rxjs';
*/

@Component({
	selector: 'app-plan-list',
	templateUrl: './plan-list.component.html',
	styleUrls: ['./plan-list.component.sass']
})

export class PlanListComponent implements OnInit {
	env:	any;
	debug:	boolean;
	selectedId = 0;
	@Input() newPlansReturn!: Plans;
	
	constructor (
		public	ps:		PlanService,
		public	route:	ActivatedRoute,
		public	router:	Router
	) {
		this.env	= environment;
		this.debug	= this.env.debug
	}
	
	ngOnInit() { this.subscribeToChanges() }
	
	subscribeToChanges() {
		this.ps.planSubject.subscribe( plans => {
			if ( this.debug ) console.log( 'Incoming plan update:', plans );
			this.newPlansReturn = plans
		})
	}
	
	addPlan() { this.ps.addPlan() }
	
	removePlan( planId: number ) {
		this.ps.removePlan( planId );
		this.router.navigate(['/plans']).then( r =>  {
			if (this.debug) console.log( 'Navigating from subscription update -', r )
		})
	}
}

// plans$!: Observable<Plans>;
// addPlan()					{ this.newPlansReturn = this.ps.addPlan()	}
// this.plans$ = this.route.paramMap.pipe( switchMap( params: ParamMap => { this.selectedId = parseInt(params.get('id')!, 10);	return this.ps.getPlans()	}))
