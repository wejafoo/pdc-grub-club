

import { environment	} from '../../../../../environments/environment';
import { ActivatedRoute	} from '@angular/router';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { of				} from 'rxjs';
import { switchMap		} from 'rxjs/operators';
import { Version		} from '../../../../../../.ARCHIVE/models/plan';
import { PlanService	} from '../../../services/plan.service';

@Component({
	selector:		'app-version-detail',
	templateUrl:	'./version-detail.component.html',
	styleUrls:		['./version-detail.component.sass']
})

export class VersionDetailComponent implements OnInit {
	env:		any;
	debug:		boolean;
	planId!:	number;
	versionId!:	number;
	loadedVer!:	Version;
	ver!:		Version;
	JSON:		JSON = JSON;

	constructor (
		public	planSvc:	PlanService,
		public	route:		ActivatedRoute,
		public	router:		Router
	) {
		this.env	= environment;
		this.debug	= this.env.debug
	}
	
	ngOnInit () {
		this.route.paramMap.pipe(switchMap(params => of(params.get('planId')))).subscribe( planId => this.planId = +planId!	)
		this.route.paramMap.pipe(switchMap(params => of(params.get('versionId')))).subscribe( versionId => {
			this.planSvc.setVersion( +versionId! );
			this.loadedVer 	= JSON.parse(JSON.stringify(this.planSvc.getVersion()));
			this.ver		= JSON.parse(JSON.stringify(this.loadedVer))
		})
	}
}
