

import { environment	} from '../../../../environments/environment';
import { ActivatedRoute	} from '@angular/router';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { of				} from 'rxjs';
import { switchMap		} from 'rxjs/operators';
import { PlanService	} from '../services/plan.service';
import { Plan			} from '../../models/plan';
import { Version		} from '../../models/plan';
// import { Presbies		} from '../../models/roster';
// import { PresbyService	} from '../../presby/presby.service';

@Component({ templateUrl: './plan-update.component.html' })
export class PlanUpdateComponent implements OnInit {
	env:		any;
	debug:		boolean;
	plan:		Plan;
	loadedPlan:	Plan;
	versionId:	number;
	
	JSON:		JSON = JSON;
	
	// presbies: Presbies;

	constructor (
		public	ps:		PlanService,
		// private presby:	PresbyService,
		public	route:	ActivatedRoute,
		public	router:	Router
	) {
		this.env		= environment;
		this.debug		= this.env.debug;
		this.JSON		= JSON;
		console.log('>>> PlanUpdateComponent');
	}

	save() {
		this.ps.updatePlan(this.plan);
		this.router.navigate(['/plan/s', this.plan.id]).then(r => console.log(r));
	}
	
	ngOnInit () {
		// this.presby.apollo.watchQuery({query: this.presby.QUERY}).valueChanges.subscribe( ret => {
		// 	console.log('>>> PlanUpdateComponent > PresbyService says:  Incoming roster update...');
		// 	this.presbies = ret.data['presbies'];
		// });
		this.route.paramMap.pipe(
			switchMap(params => of( params.get('planId')))
		).subscribe(planId => {
			this.loadedPlan	= JSON.parse( JSON.stringify( this.ps.getPlan(+planId)));
			this.plan		= JSON.parse( JSON.stringify( this.ps.getPlan(+planId)));
		});
		this.route.paramMap.pipe(
			switchMap(params => of( params.get('versionId')))
		).subscribe(versionId => this.versionId = +versionId);
	}
	
	addVersion() {
		const verId:	number	= this.plan.versions.length;
		const ver:		Version	= { id: verId, labels: ['new'], events: []};
		this.plan.versions.push(ver);
	}
	
	rmVer(rmVerId: number) {
		const rmIndex = this.plan.versions.findIndex(version => version.id === rmVerId);
		if ( rmIndex !== -1 ) this.plan.versions[this.versionId].events.splice(rmIndex, 1);
		this.save();
	}
}
