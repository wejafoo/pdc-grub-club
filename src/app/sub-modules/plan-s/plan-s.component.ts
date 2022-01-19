

import { environment	} from '../../../environments/environment';
import { Component		} from '@angular/core';
import { Input			} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { PlanService	} from './services/plan.service';
import { PresbyService	} from '../presby/presby.service';
import { Plans			} from '../models/plan';
import { Presbies		} from '../models/roster';

@Component({templateUrl: './plan-s.component.html'})
export class PlansComponent implements OnInit {
	env:			any;
	debug:			boolean;
	presbies:		Presbies | undefined | null;
	@Input() plans:	Plans;
	allowAdd		= false;
	planId			= 0;
	
	constructor (
		public	plan:	PlanService,
		public	presby:	PresbyService,
		public	router:	Router
	) {
		this.env = environment;
		this.debug = this.env.debug;
		console.log('>>> PlansComponent');
	}
	
	ngOnInit() {
		this.presby.apollo.watchQuery({query: this.presby.QUERY}).valueChanges.subscribe( ret => {
			console.log('>>> PlansComponent > PresbyService says:  Incoming roster update...');
			this.presbies = ret.data['presbies'];
		});
		this.subscribeToChanges();
	}
	
	addPlan() {
		const addRoute = ['/plan', this.plans.length, 'version', 's', '0'];		// state param: {plan: this.plan.getPlan(this.planId)}
		console.log('>>> PlansComponent > Add a plan > navigate():', addRoute);
		this.router.navigate(addRoute).then(r => {
			console.log(
				'>>> PlansComponent > Add a plan > navigate() > success?',
				r
			)
		})
	}
	
	plansBy() { return this.plans.reverse()}									// this.plan.planSubject.subscribe(plans => { console.log(plans)})
	
	rmPlan(planId: number) {
		this.plan.rmPlan(planId);
		this.router.navigate(['/plan/s']).then();
	}
	
	subscribeToChanges() {
		this.plan.planSubject.subscribe(plans => {
			console.log('>>> PlansComponent > PlanService says:  Initializing plans...');
			this.allowAdd = true;
			this.plans = plans;
		})}
}
// toVersion(planId:number,versionId:number) {this.router.navigate(['/plan',planId,'version']).then(r => console.log(r))}
// updatePlan(planId: number) {
// 	const latestVer = this.plans[planId].versions.length-1;
// 	this.router.navigate(['/plan/',planId,'version/s']).then(r => console.log(r))
// }
