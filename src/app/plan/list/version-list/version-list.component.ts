

import { environment	} from '../../../../environments/environment';
import { ActivatedRoute	} from '@angular/router';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { Observable		} from 'rxjs';
import { of				} from 'rxjs';
import { switchMap		} from 'rxjs/operators';
import { Plan			} from '../../../../../.ARCHIVE/models/plan';
import { Version		} from '../../../../../.ARCHIVE/models/plan';
import { Versions		} from '../../../../../.ARCHIVE/models/plan';
import { DialogService	} from '../../../services/dialog.service';
import { PlanService	} from '../../services/plan.service';

// import { PresbyService	} from '../../../presby/services/presby.service';
// import { Input } from '@angular/core';

@Component({
	selector: 'app-version-list',
	templateUrl: './version-list.component.html',
	styleUrls: ['./version-list.component.sass']
})

export class VersionListComponent implements OnInit {
	env:		any;
	debug:		boolean;
	planId!:	number;
	versionId!:	number;
	plan!:		Plan;
	versions!:	Versions;
	loadedVer!:	Version;
	ver!:		Version;
	
// 	eventId!:	number;
// 	eventSlug	= 'Presby gotta new version - owwwww!'
	
	constructor (
		public	dialog:		DialogService,
		public	planSvc:	PlanService,
		public	route:		ActivatedRoute,
		public	router:		Router
	) {
		this.env	= environment;
		this.debug	= this.env.debug
	}
	
	ngOnInit () {
		this.route.paramMap.pipe( switchMap(params => of( params.get( 'planId')))).subscribe(planId => {
			this.planId		= +planId!
			this.plan 		= JSON.parse(JSON.stringify(this.planSvc.setPlan(+planId!)));
		})
		
		this.route.paramMap.pipe(switchMap(params => of(params.get('versionId')))).subscribe(versionId => {
			this.planSvc.setVersion(+versionId!);
			this.loadedVer = JSON.parse(JSON.stringify(this.planSvc.getVersion()))
			this.ver = JSON.parse(JSON.stringify(this.planSvc.getVersion()))
		})
	}
	
	canDeactivate	(					): Observable<boolean> | boolean { if (JSON.stringify(this.loadedVer) === JSON.stringify(this.ver)) {return true} else {return this.dialog.confirm('Abandon version  changes?')}}
	cancelVersion	(					) { this.toPlanList() }
	reviewVersion	(					) { this.router.navigate(['/plan', this.planId, 'schedule']).then(r => console.log(r))}
	toVersions		(					) { this.router.navigate(['/plan', this.planId	]).then(r => console.log(r))}
	toPlanList		(					) { this.router.navigate(['/plan', this.planId	]).then(r => console.log(r))}
	setVersion		(					) { console.log( 'Adding version to plan:', this.planId )}
	loadVersion		( versionId: number ) {
		console.log( 'Loading version - version ID:', versionId );
		console.log( '(see version-list->loadVersion() to update)' );
		// setVersion( versionId )
		this.router.navigate(['/plan', this.planId, 'schedule', versionId, 'update']).then(r => {console.log(r)})
	}
	
	rmVersion ( versionId: number ) {
		if ( this.planSvc.rmVersion(versionId)) { console.log('Remove version -> SUCCESS!')} else {console.log( 'Remove version -> Boooo!')}
		this.router.navigate(['/plan', this.planId, 'schedule' ]).then(r => {if (this.debug) console.log(r)})
	}
	
	saveNewVersion () {
		this.loadedVer = JSON.parse(JSON.stringify(this.ver));
		this.planSvc.addVersion(this.ver);
		this.reviewVersion()
	}
	
}
