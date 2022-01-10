

import { environment	} from '../../../../environments/environment';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PresbyService	} from '../presby.service';
import { Presbies	 	} from '../../models/roster';

@Component({
	selector: 'app-presby-host-detail',
	templateUrl: './guest-detail.component.html',
	styleUrls: ['./guest-detail.component.sass']
})
export class GuestDetailComponent implements OnInit {
	env:	any;
	debug:	boolean;
	guests:	Presbies;
	
	JSON:	JSON = JSON;
	
	constructor (
		private presby: PresbyService,
		private	route:	ActivatedRoute,
		private	router:	Router
	) {
		this.env	= environment;
		this.debug	= this.env.debug;
		console.log('>>> GuestDetailComponent');
	}
	
	ngOnInit() {
		this.presby.apollo.watchQuery(
			{query: this.presby.QUERY}
		).valueChanges.subscribe( ret => {
			console.log(
				'>>> GuestDetailComponent > ' +
				'PresbyService says:  Incoming roster update...'
			);
			this.guests = ret.data['presbies'];
		})
	}
	
	toGuests() {
		this.router.navigate(['/guests']).then()
	}
}
