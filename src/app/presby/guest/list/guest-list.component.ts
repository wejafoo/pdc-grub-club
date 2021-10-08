

import { environment	} from '../../../../environments/environment';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { ActivatedRoute	} from '@angular/router';
import { Router			} from '@angular/router';
import { map			} from 'rxjs/operators';
import { PresbyService	} from '../../services/presby.service';
import { Presbies		} from '../../../../../.ARCHIVE/models/plan';

@Component({ templateUrl: './guest-list.component.html' })

export class GuestListComponent implements OnInit {
	env:		any;
	guests!:	Presbies;
	
	constructor (
		private	presbyS:	PresbyService,
		private	route:		ActivatedRoute,
		private router:		Router
	) {
		this.env	= environment;
	}
	
	ngOnInit() {
		this.presbyS.watch().valueChanges.pipe( map(result => {
			this.guests = result.data.presbies
		}))
	}
	toHosts() { this.router.navigate(['/hosts']).then(r => console.log(r))}
}

// this.guests$ = this.route.paramMap.pipe( switchMap(params => {
// 	this.guestId = parseInt(params.get('guestId')!, 10);
// 	return this.service.getPresbies()

