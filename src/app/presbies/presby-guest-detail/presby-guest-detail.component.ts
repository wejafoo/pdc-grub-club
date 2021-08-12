

import { environment	} from '../../../environments/environment';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ParamMap		} from '@angular/router';
import { Observable		} from 'rxjs';
import { switchMap		} from 'rxjs/operators';
import { PresbyService	} from '../presby.service';
import { Presby			} from '../../models/presby';

@Component({
	selector: 'app-presby-detail',
	templateUrl: './presby-guest-detail.component.html',
	styleUrls: ['./presby-guest-detail.component.sass']
})

export class PresbyGuestDetailComponent implements OnInit {
	env:		any;
	debug:		boolean;
	presby$!:	Observable<Presby>;
	
	constructor (
		private	route:		ActivatedRoute,
		private	router:		Router,
		private	service:	PresbyService
	) {
		this.env	= environment;
		this.debug	= this.env.debug
	}
	
	ngOnInit() { this.presby$ = this.route.paramMap.pipe( switchMap(( params: ParamMap) => this.service.getPresby( params.get( 'id' )!)))}
	gotoPresbies() { this.router.navigate(['/presbies']).then( r => {
		if ( this.debug ) console.log( 'Navigating from guest-detail->gotoPresbies()', r )
	})}
}


// gotoPresbies( presby: Presby ) {
// 		const presbyId = presby ? presby.id : null;
// 		console.log( '!!!!!!!!!!!!!!!!! ?????????? gotoPresbies in guest-detail would have router.navigate`d  ?????????? !!!!!!!!!!!!!!' );
