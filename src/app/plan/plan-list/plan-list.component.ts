

import { environment	} from '../../../environments/environment';
import { ActivatedRoute	} from '@angular/router';
import { Component		} from '@angular/core';
import { Input			} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { PlanService	} from '../services/plan.service';
import { Plans			} from '../models/plan';

@Component({
	selector: 'app-plan-list',
	templateUrl: './plan-list.component.html',
	styleUrls: ['./plan-list.component.sass']
})

export class PlanListComponent implements OnInit {
	env:	any;
	debug:	boolean;

	planId	= 0;
	
	@Input() plans!: Plans;
	
	constructor (
		public	ps:		PlanService,
		public	route:	ActivatedRoute,
		public	router:	Router
	) {
		this.env	= environment;
		this.debug	= this.env.debug
	}
	
	ngOnInit() {
		this.subscribeToChanges()
	}

	subscribeToChanges() {
		this.ps.planSubject.subscribe(plans => this.plans = plans )
	}
	
	addPlan() {
		this.planId	= this.ps.addPlan();
		this.router.navigate(['/plan', this.planId, { plan: this.ps.getPlan(this.planId)} ]).then(r => {if (this.debug) console.log(r)})
	}
	
	updatePlan( planId: number ) {
		this.router.navigate(['/plan/', planId, 'update']).then(r => {if (this.debug) console.log(r)})
	}
	
	removePlan( planId: number ) {
		this.ps.removePlan( planId );
		this.router.navigate(['/plans']).then(r => {if (this.debug) console.log(r)})
	}
}
