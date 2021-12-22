

import { environment	} from '../../../../environments/environment';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { PresbyService	} from '../presby.service';
import { Presbies		} from '../../models/roster';

@Component({ templateUrl: './guest-list.component.html' })
export class GuestListComponent implements OnInit {
	env:	any;
	debug:	any;
	guests:	Presbies | undefined | null;
	
	constructor(
		private presby: PresbyService,
		private router: Router
	) {
		this.env	= environment;
		this.debug	= this.env.debug;
	}
	
	ngOnInit() {
		this.guests = this.presby.getData()
	}
	
	toHosts() {
		this.router.navigate(['/host/list']).then()
	}
}
