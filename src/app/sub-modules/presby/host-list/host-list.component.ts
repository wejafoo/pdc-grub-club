

import { environment	} from '../../../../environments/environment';

import { Component	} from '@angular/core';
import { OnInit		} from '@angular/core';
import { Router		} from '@angular/router';

import { PresbyService	} from '../presby.service';

import { Presbies	} from '../../models/roster';

@Component({ templateUrl: './host-list.component.html'})
export class HostListComponent implements OnInit {
	env:	any;
	debug:	any;
	hosts:	Presbies;
	
	constructor(
		private presby: PresbyService,
		private router: Router
	) {
		this.env	= environment;
		this.debug	= this.env.debug;
	}
	
	ngOnInit() {
		this.hosts = this.presby.getData()
	}
	
	toGuests() {
		this.router.navigate(['/guests']).then()
	}
}


