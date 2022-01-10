

import { environment	} from '../../../../environments/environment';
import { Component		} from '@angular/core';
import { Input			} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { PlanService	} from '../services/plan.service';
import { PresbyService	} from '../../presby/presby.service';
import { Plans			} from '../../models/plan';
import { Presbies		} from '../../models/roster';

@Component({templateUrl: './plan-list.component.html'})
export class PlanListComponent implements OnInit {
	env: any;
	debug: boolean;
	presbies: Presbies | undefined | null;
	@Input() plans:	Plans;
	planId = 0;
	
	constructor (
		public	plan:	PlanService,
		public	presby:	PresbyService,
		public	router:	Router
	) {
		this.env = environment;
		this.debug = this.env.debug;
		console.log('>>> PlanListComponent');
	}
	ngOnInit() {
		
		this.presby.apollo.watchQuery({query: this.presby.QUERY}).valueChanges.subscribe( ret => {
			console.log('>>> PlanListComponent > PresbyService says:  Incoming roster update...');
			this.presbies = ret.data['presbies'];
		});
		this.subscribeToChanges();
	}
	addPlan() {
		this.planId	= this.plan.addPlan('New Plan');
		this.router.navigate(['/plan', this.planId, {plan: this.plan.getPlan(this.planId)}]).then(r => console.log(r));
	}
	rmPlan(planId: number) {
		this.plan.rmPlan(planId);
		this.router.navigate(['/plan/s']).then(r => console.log(r));
	}
	subscribeToChanges() {
		this.plan.planSubject.subscribe(plans => this.plans = plans);
	}
	
}
// toVersion(planId:number,versionId:number) {this.router.navigate(['/plan',planId,'version']).then(r => console.log(r))}
// updatePlan(planId: number) {
// 	const latestVer = this.plans[planId].versions.length-1;
// 	this.router.navigate(['/plan/',planId,'version/s']).then(r => console.log(r))
// }
