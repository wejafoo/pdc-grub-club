

import { environment	} from '../../../../environments/environment';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { ActivatedRoute	} from '@angular/router';
import { Router			} from '@angular/router';
import { Presbies		} from '../../../../../.ARCHIVE/models/plan';
import { PresbyService	} from '../../services/presby.service';

@Component({ templateUrl: './guest-list.component.html' })
export class GuestListComponent implements OnInit {
	env:		any;
	guests!:	Presbies;
	
	constructor (
		private	route:	ActivatedRoute,
		private router:	Router,
		private presby: PresbyService
	) {
		this.env = environment;
	}
	
	ngOnInit() {
		this.guests = this.presby.getData()
		console.log( 'RECEIVED PRESBIES in GUESTS LIST:', typeof this.guests, Array.isArray(this.guests), this.guests )
	}
	toHosts() { this.router.navigate(['/hosts']).then(r => console.log(r))}
}
