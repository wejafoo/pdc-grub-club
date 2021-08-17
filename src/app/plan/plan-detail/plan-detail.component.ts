

import { environment	} from '../../../environments/environment';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of				} from 'rxjs';
import { switchMap		} from 'rxjs/operators';
import { PlanService	} from '../services/plan.service';

@Component({
	selector: 'app-plan-detail',
	templateUrl: './plan-detail.component.html',
	styleUrls: ['./plan-detail.component.sass']
})

export class PlanDetailComponent implements OnInit {
	env:		any;
	debug:		boolean;
	planId!:	number;
	
	constructor (
		private	route:	ActivatedRoute,
		public ps:		PlanService
	) {
		this.env	= environment;
		this.debug	= this.env.debug
	}

	ngOnInit() {
		this.route.paramMap.pipe(switchMap(params => of( params.get('planId')))).subscribe(planId => this.planId = +planId!)
	}
}
