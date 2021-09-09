

import { environment	} from '../../../../../environments/environment';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ParamMap		} from '@angular/router';
import { Observable		} from 'rxjs';
import { switchMap		} from 'rxjs/operators';
import { PresbyService	} from '../../../services/presby.service';
import { Presby			} from '../../../../../../.ARCHIVE/models/plan';


@Component({
	selector: 'app-presby-detail',
	templateUrl: './guest-detail.component.html',
	styleUrls: ['./guest-detail.component.sass']
})

export class GuestDetailComponent implements OnInit {
	env:		any;
	debug:		boolean;
	presby$!:	Observable<Presby>;
	JSON:		JSON ;
	
	constructor (
		private	route:		ActivatedRoute,
		private	router:		Router,
		private	service:	PresbyService
	) {
		this.env	= environment;
		this.debug	= this.env.debug;
		this.JSON	= JSON
	}
	
	ngOnInit ()	{ this.presby$ = this.route.paramMap.pipe( switchMap(( params: ParamMap) => this.service.getPresby( params.get( 'guestId' )!)))}
	toGuests ()	{ this.router.navigate(['/guests']).then(r => {if (this.debug) console.log(r)})}
}
