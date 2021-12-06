

import { environment	} from '../../../../environments/environment';
import { ActivatedRoute	} from '@angular/router';
import { Component		} from '@angular/core';
import { Input			} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { Plans			} from '../../../../../.ARCHIVE/models/plan';
import { PlanService	} from '../services/plan.service';

@Component({
	selector: 'app-plan-list',
	templateUrl: './plan-list.component.html',
	styleUrls: ['./plan-list.component.sass']
})

export class PlanListComponent implements OnInit {
	env:			any;
	debug:			boolean;
	@Input() plans:	Plans;
	planId	= 0;
	
	constructor (
		public	planSvc:	PlanService,
		public	route:		ActivatedRoute,
		public	router:		Router
	) {
		this.env	= environment;
		this.debug	= this.env.debug
	}
	
	ngOnInit () { this.subscribeToChanges()}
	addPlan () {
		this.planId	= this.planSvc.addPlan();
		this.router.navigate(['/plan', this.planId, {plan: this.planSvc.getPlan(this.planId)}]).then(r => {console.log(r)})
	}
	removePlan ( planId: number ) {
		this.planSvc.removePlan( planId );
		this.router.navigate(['/plans']).then(r => console.log(r))
	}
	subscribeToChanges	() { this.planSvc.planSubject.subscribe(plans => this.plans = plans )}
	toVersion			() { this.router.navigate(['/plan', this.planId,	'version'	]).then(r => console.log(r))}
	updatePlan ( planId: number ) {
		const latestVer = this.plans[planId].versions.length - 1;
		console.log( 'LATEST VERSION:', latestVer );
		this.router.navigate(['/plan/', planId, 'update', 'version', latestVer ]).then(r => console.log(r))}
}
