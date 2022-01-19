

import { environment	} from '../../../../../environments/environment';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { PresbyService	} from '../../presby.service';
import { Presbies		} from '../../../models/roster';

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
		console.log('>>> GuestListComponent');
	}
	
	ngOnInit()	{
		this.presby.apollo.watchQuery({query: this.presby.QUERY}).valueChanges.subscribe( ret => {
			console.log('>>> GuestListComponent > PresbyService says:  Incoming roster update...');
			this.guests = ret.data['presbies'];
		})
	}
	
	toHosts()	{ this.router.navigate(['/host/list']).then()}
}
