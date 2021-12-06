

import { environment	} from '../../../../../../../environments/environment';
import { ActivatedRoute	} from '@angular/router';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { Observable		} from 'rxjs';
import { of				} from 'rxjs';
import { switchMap		} from 'rxjs/operators';
import { Version		} from '../../../../../../../../.ARCHIVE/models/plan';
import { DialogService	} from '../../../../../../services/dialog.service';
import { PlanService	} from '../../../../services/plan.service';

@Component({
	selector: 'app-event-update',
	templateUrl: './event-update.component.html',
	styleUrls: ['./event-update.component.sass']
})

export class EventUpdateComponent implements OnInit {
	env:			any;
	debug:			boolean;
	loadedVer!:		Version;
	ver!:			Version;
	eventId!:		number;
	planId!:		number;
	versionId!:		number;
	JSON:			JSON	= JSON;
	eventSlug				= 'Mama gotta brand new event - owwwww!'

	constructor (
		public	dialog:	DialogService,
		public	ps:		PlanService,
		public	route:	ActivatedRoute,
		public	router:	Router
	) {
		this.env	= environment;
		this.debug	= this.env.debug;
		this.JSON	= JSON
	}
	
	ngOnInit () {
		this.route.paramMap.pipe(switchMap(params => of(params.get('planId')))).subscribe(planId => this.planId = +planId!)
		this.route.paramMap.pipe(switchMap(params => of(params.get('versionId')))).subscribe(versionId => {
			this.loadedVer	= JSON.parse(JSON.stringify(this.ps.getPlan(+versionId!)));
			this.ver		= JSON.parse(JSON.stringify(this.ps.getPlan(+versionId!)))
		});
		this.route.paramMap.pipe(switchMap(params => of(params.get('eventId')))).subscribe(eventId => this.eventId = +eventId!)
	}
	
	canDeactivate	(): Observable<boolean> | boolean {if ( JSON.stringify(this.ver) === JSON.stringify(this.loadedVer)) {return true} else {return this.dialog.confirm('Abandon changes?')}}
	cancel			() { this.toPlan() }
	reviewEvent		() { this.router.navigate(['/plan', this.planId, 'version', this.ver.id, 'event', this.eventId ]).then(r => {if (this.debug) console.log(r)})}
	toPlan			() { this.router.navigate(['/plan', this.planId, 'update', 'event', this.eventId	]).then(r => {if (this.debug) console.log(r)})}
	toPlans			() { this.router.navigate(['/plans']).then(r => {if (this.debug) console.log(r)})}
	save			() {
		this.loadedVer = JSON.parse(JSON.stringify(this.ver));
		// this.ps.updateVersion( this.ver );
		this.ps.addVersion(this.ver);
		this.toPlan()
	}
}
