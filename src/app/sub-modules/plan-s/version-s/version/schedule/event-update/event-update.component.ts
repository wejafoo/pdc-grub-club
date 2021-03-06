

import { environment	} from '../../../../../../../environments/environment';
import { ActivatedRoute	} from '@angular/router';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { of				} from 'rxjs';
import { switchMap		} from 'rxjs/operators';
import { PlanService	} from '../../../../services/plan.service';
import { Version		} from '../../../../../models/plan';

// import {Observable} from 'rxjs';
// import {DialogService} from '../../../../../services/dialog.service';

@Component({
	selector: 'app-event-plan-list-version-s',
	templateUrl: './event-update.component.html',
	styleUrls: ['./event-update.component.sass']
})

export class EventUpdateComponent implements OnInit {
	env:		any;
	debug:		boolean;
	eventId:	number;
	loadedVer:	Version;
	planId:		number;
	ver:		Version;
	versionId:	number;
	
	JSON: JSON = JSON;

	constructor (
		public	ps:		PlanService,
		public	route:	ActivatedRoute,
		public	router:	Router
	) {
		this.env	= environment;
		this.debug	= this.env.debug;
		this.JSON	= JSON
	}
	
	ngOnInit () {
		this.route.paramMap.pipe(
			switchMap(params => of(params.get('planId')))
		).subscribe(planId => this.planId = +planId)
		
		this.route.paramMap.pipe(
			switchMap(params => of( params.get('versionId')))
		).subscribe(versionId => {
			this.loadedVer =	JSON.parse( JSON.stringify( this.ps.getPlan(+versionId)));
			this.ver =			JSON.parse( JSON.stringify( this.ps.getPlan(+versionId)));
		});

		this.route.paramMap.pipe(
			switchMap(params => of( params.get('eventId')))
		).subscribe(eventId => this.eventId = +eventId);
	}
	
	cancel() {}
	
	save() {
		this.loadedVer = JSON.parse( JSON.stringify(this.ver));
		this.ps.addVersion(this.ver);
	}
	toPlan() { this.router.navigate(['/plan', this.planId, 'update', 'event', this.eventId]).then()}
}

// eventSlug =
// 'Mama gotta brand new event-plan-list - owwwww!'
// public	dialog:	DialogService,

// this.toPlan()
// this.ps.updateVersion( this.ver );
// this.toPlan()

// canDeactivate(): Observable<boolean> | boolean {
// if ( JSON.stringify(this.ver) === JSON.stringify(this.loadedVer)) {
// return true
// } else {
// return this.dialog.confirm('Abandon changes?')
// }}
// reviewEvent() {
// this.router.navigate(
// ['/plan', this.planId, 'version', this.ver.id, 'event', this.eventId ]
// ).then()
// }
// toPlans() {
// this.router.navigate(
// ['/plan/s']).then()
// }
