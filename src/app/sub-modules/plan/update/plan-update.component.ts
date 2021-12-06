

import { environment	} from '../../../../environments/environment';
import { ActivatedRoute	} from '@angular/router';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { Observable		} from 'rxjs';
import { of				} from 'rxjs';
import { switchMap		} from 'rxjs/operators';
import { DialogService	} from '../../../services/dialog.service';
import { PlanService	} from '../services/plan.service';
import { PresbyService	} from '../../presby/services/presby.service';
import { Plan			} from '../../../../../.ARCHIVE/models/plan';
import { Presbies		} from '../../../../../.ARCHIVE/models/plan';
import { Version		} from '../../../../../.ARCHIVE/models/plan';

@Component({
	selector: 'app-plan-update',
	templateUrl: './plan-update.component.html',
	styleUrls: ['./plan-update.component.sass']
})

export class PlanUpdateComponent implements OnInit {
	env:			any;
	debug:			boolean;
	plan!:			Plan;
	presbies:		Presbies;
	loadedPlan!:	Plan;
	versionId!:		number;
	JSON:			JSON = JSON;
	// versionNameSlug = 'Mama gotta brand new version - owwwww!'

	constructor (
		public	dialog:	DialogService,
		public	ps:		PlanService,
		public	route:	ActivatedRoute,
		public	router:	Router,
		private presby:	PresbyService
	) {
		this.env		= environment;
		this.debug		= this.env.debug;
		this.presbies	= this.presby.getData();
		this.JSON		= JSON;
	}
	
	ngOnInit () {
		this.route.paramMap.pipe( switchMap(params => of( params.get( 'planId' )))).subscribe(planId => {
			this.loadedPlan	= JSON.parse( JSON.stringify( this.ps.getPlan( +planId! )));
			this.plan		= JSON.parse( JSON.stringify( this.ps.getPlan( +planId! )))
		});
		this.route.paramMap.pipe( switchMap(params => of( params.get( 'versionId' )))).subscribe(versionId => this.versionId = +versionId! )
	}
	
	canDeactivate	( ): Observable<boolean> | boolean { if ( JSON.stringify( this.plan ) === JSON.stringify( this.plan )) { return true } else { return this.dialog.confirm( 'Abandon changes?' )}}
	cancel			( ) { this.toPlans() }
	reviewPlan		( ) { this.router.navigate([ '/plan', this.plan.id	]).then( r => console.log(r))}
	toPlan			( ) { this.router.navigate([ '/plan', this.plan.id	]).then( r => console.log(r))}
	toPlans			( ) { this.router.navigate([ '/plans'					]).then( r => console.log(r))}
	updateVersion 	( versionId: number ) { this.router.navigate([ '/plan', this.plan.id, 'version', versionId, 'update']).then( r => console.log( r ))}
	
	addVersion ( ) {
		const verId			= this.plan.versions.length;
		const ver: Version	= { id: verId, labels: ['new'], events: []};
		this.plan.versions.push( ver )												// Todo: clean up array push with object.array or something
	}
	
	removeVersion ( rmVersionId: number ) {
		const rmIndex = this.plan.versions.findIndex(version => version.id === rmVersionId);
		if ( rmIndex !== -1 ) this.plan.versions[this.versionId].events!.splice(rmIndex, 1);
		this.save();
	}
	
	save () {
		this.ps.updatePlan( this.plan );
		this.reviewPlan();
	}
}
