

import { environment	} from '../../../environments/environment';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable		} from 'rxjs';
import { switchMap		} from 'rxjs/operators';
import { PresbyService	} from '../presby.service';
import { Presby			} from '../../models/presby';

// import { ParamMap	} from '@angular/router';

@Component({
	selector: 'app-presby-detail',
	templateUrl: './presby-host-detail.component.html',
	styleUrls: ['./presby-host-detail.component.sass']
})

export class PresbyHostDetailComponent implements OnInit {
	env:		any;
	debug:		boolean;
	presby$!:	Observable<Presby>;
	
	constructor (
		private	route:		ActivatedRoute,
		private	router:		Router,
		private	service:	PresbyService
	) {
		this.env	= environment;
		this.debug	= this.env.debug;
	}
	
	ngOnInit() { this.presby$ = this.route.paramMap.pipe( switchMap(params => this.service.getPresby( params.get( 'id' )! )))}
	
	gotoPresbies( presby: Presby ) {
		const presbyId = presby ? presby.id : null;																		// Pass along the presbyId for component to route.
		this.router.navigate(['/presbies', { id: presbyId }]).then( r => {
			if ( this.debug ) console.log( 'Navigating from host-detail->gotoPresbies():', r )
		})
 	}
}


// this.router.navigate(['/presbies', {id: presbyId, foo: 'foo'}]).then(r => console.log( r ))
