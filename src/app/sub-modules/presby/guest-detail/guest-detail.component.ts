

import { environment	} from '../../../../environments/environment';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PresbyService	} from '../presby.service';
import { Presbies	 	} from '../../../../../.ARCHIVE/models/plan';

@Component({
	selector: 'app-presby-host-detail',
	templateUrl: './guest-detail.component.html',
	styleUrls: ['./guest-detail.component.sass']
})
export class GuestDetailComponent implements OnInit {
	env:	any;
	debug:	boolean;
	guests:	Presbies;
	JSON:	JSON;
	
	constructor (
		private	route:	ActivatedRoute,
		private	router:	Router,
		private presby: PresbyService
	) {
		this.env	= environment;
		this.debug	= this.env.debug;
		this.JSON	= JSON;
		console.log( '>>> GuestDetailComponent' );
	}
	
	ngOnInit()	{ this.guests = this.presby.getData()}
	toGuests ()	{ this.router.navigate(['/guests']).then( r => console.log(r))}
}
