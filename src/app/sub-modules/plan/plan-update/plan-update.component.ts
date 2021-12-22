

import { environment	} from '../../../../environments/environment';
import { ActivatedRoute	} from '@angular/router';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { of				} from 'rxjs';
import { switchMap		} from 'rxjs/operators';
import { PlanService	} from '../services/plan.service';
import { PresbyService	} from '../../presby/presby.service';
import { Plan			} from '../../models/plan';
import { Version		} from '../../models/plan';
import { Presbies		} from '../../models/roster';

@Component({ templateUrl: './plan-update.component.html' })
export class PlanUpdateComponent implements OnInit {
	env:		any;
	debug:		boolean;
	plan:		Plan;
	presbies:	Presbies;
	loadedPlan:	Plan;
	versionId:	number;
	
	JSON:		JSON = JSON;

	constructor (
		public	ps:		PlanService,
		private presby:	PresbyService,
		public	route:	ActivatedRoute,
		public	router:	Router
	) {
		this.env		= environment;
		this.debug		= this.env.debug;
		this.presbies	= this.presby.getData();
		this.JSON		= JSON;
		console.log('>>> PlanUpdateComponent');
	}

	save() {
		this.ps.updatePlan(this.plan);
		this.router.navigate(['/plan/s', this.plan.id]).then(r => console.log(r));
	}
	
	ngOnInit () {
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
		this.plan.versions.push(ver);										// Todo: clean up array push with object.array or something
	}
	
	rmVer(rmVerId: number) {
		const rmIndex = this.plan.versions.findIndex(version => version.id === rmVerId);
		if ( rmIndex !== -1 ) this.plan.versions[this.versionId].events.splice(rmIndex, 1);
		this.save();
	}
}

// import {Observable} from 'rxjs';
// import {DialogService} from '../../../services/dialog.service';
// versionNameSlug = 'Mama gotta brand new version - owwwww!'
// public dialog: DialogService,
// this.reviewPlan();
// canDeactivate(): Observable<boolean> | boolean { if ( JSON.stringify( this.plan ) === JSON.stringify( this.plan )) { return true } else { return this.dialog.confirm( 'Abandon changes?' )}}
// cancel() {this.toPlans() }
// reviewPlan() {this.router.navigate(['/plan',this.plan.id]).then(r => console.log(r))}
// toPlan() {this.router.navigate(['/plan',this.plan.id]).then(r => console.log(r))}
// toPlans() {this.router.navigate(['/plan/s']).then(r => console.log(r))}
// updateVersion(versionId: number) { this.router.navigate(['/plan', this.plan.id, 'version', versionId]).then(r => console.log(r))}
