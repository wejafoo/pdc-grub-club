

import { environment	} from '../../../../../environments/environment';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable		} from 'rxjs';
import { map			} from 'rxjs/operators';
import { PresbyService	} from '../../../services/presby.service';
import { Presbies	 	} from '../../../../../../.ARCHIVE/models/plan';

// import { ParamMap } from '@angular/router';

@Component({
	selector: 'app-presby-detail',
	templateUrl: './guest-detail.component.html',
	styleUrls: ['./guest-detail.component.sass']
})

export class GuestDetailComponent implements OnInit {
	env:		any;
	debug:		boolean;
	guests$!:	Observable<Presbies>;
	JSON:		JSON ;
	
	constructor (
		private	route:	ActivatedRoute,
		private	ps:		PresbyService,
		private	router:	Router
	) {
		this.env	= environment;
		this.debug	= this.env.debug;
		this.JSON	= JSON
	}
	
	ngOnInit ()	{ this.guests$ = this.ps.watch().valueChanges.pipe( map(result => result.data.presbies ))}
	toGuests ()	{ this.router.navigate(['/guests']).then( r => console.log(r))}
}
// ngOnInit ()	{ this.presby$ = this.route.paramMap.pipe( switchMap(( params: ParamMap) => this.service.getPresby( params.get( 'guestId' )!)))}
