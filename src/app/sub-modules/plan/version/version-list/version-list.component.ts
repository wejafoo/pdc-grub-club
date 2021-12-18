

import { environment	} from '../../../../../environments/environment';
import { ActivatedRoute	} from '@angular/router';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { of				} from 'rxjs';
import { switchMap		} from 'rxjs/operators';
import { Plan			} from '../../../../../../.ARCHIVE/models/plan';
import { Version		} from '../../../../../../.ARCHIVE/models/plan';
import { Versions		} from '../../../../../../.ARCHIVE/models/plan';
import { PlanService	} from '../../services/plan.service';

@Component({ templateUrl: './version-list.component.html' })
export class VersionListComponent implements OnInit {
	env:		any;
	debug:		boolean;
	loadedVer:	Version;
	plan:		Plan;
	planId:		number;
	ver:		Version;
	versionId:	number;
	versions:	Versions;
	
	constructor (
		public	planS:	PlanService,
		public	route:	ActivatedRoute,
		public	router:	Router
	) {
		this.env	= environment;
		this.debug	= this.env.debug;
		console.log('>>> VersionListComponent');
	}
	
	ngOnInit () {
		this.route.paramMap.pipe( switchMap(params => of( params.get( 'planId')))).subscribe(planId => {
			this.planId	= +planId!
			this.plan 	= JSON.parse( JSON.stringify( this.planS.setPlan(+planId!)));
		})
		
		this.route.paramMap.pipe( switchMap(params => of( params.get( 'versionId')))).subscribe(versionId => {
			this.planS.setVersion(+versionId!);
			this.loadedVer	= JSON.parse( JSON.stringify( this.planS.getVersion()))
			this.ver		= JSON.parse( JSON.stringify( this.planS.getVersion()))
		})
	}
	
	backToPlanList( planId: number) {
		this.router.navigate(['/plan/s', planId]).then(r => console.log(r));
	}
	
	loadVersion(versionId: number) {
		this.router.navigate(['/plan', this.planId, 'schedule', versionId, 'update']).then(r => console.log(r))
	}
	
	rmVer(versionId: number) {
		if ( this.planS.rmVer(versionId) ) { console.log('Remove version -> SUCCESS!')} else {console.log( 'Remove version -> Boooo!')}
		this.router.navigate(['/plan', this.planId, 'schedule']).then(r => console.log(r))
	}
	
	
}

// import { Observable } from 'rxjs';
// import { DialogService } from '../../../../services/dialog.service';
// import { PresbyService } from '../../../presby/services/presby.service';
// import { Input } from '@angular/core';
// 	eventId!: number;
// 	eventSlug = 'Presby gotta new version - owwwww!'
// public dialog: DialogService,
// reviewVersion() { this.router.navigate(['/plan', this.planId, 'schedule']).then(r => console.log(r))}
// toVersions() { this.router.navigate(['/plan', this.planId]).then(r => console.log(r))}
// setVersion () { console.log( 'Adding version to plan:', this.planId )}
// setVersion( versionId )
// canDeactivate(): Observable<boolean> | boolean { if (JSON.stringify(this.loadedVer) === JSON.stringify(this.ver)) {return true} else {return this.dialog.confirm('Abandon version  changes?')}}
// cancelVersion() { this.toPlanList() }
// saveNewVersion () {
// 	this.loadedVer = JSON.parse(JSON.stringify(this.ver));
// 	this.planSvc.addVersion(this.ver);
// 	this.reviewVersion()
// }
