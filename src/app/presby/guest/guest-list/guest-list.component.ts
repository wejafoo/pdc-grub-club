

import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { ActivatedRoute	} from '@angular/router';
import { Observable		} from 'rxjs';
import { switchMap		} from 'rxjs/operators';
import { PresbyService	} from '../../services/presby.service';
import { Presby			} from '../../models/presby';
																														// TODO: Feature Componetize like PlanningCenter
@Component({
	selector: 'app-guest-list',
	templateUrl: './guest-list.component.html',
	styleUrls: ['./guest-list.component.sass']
})

export class GuestListComponent implements OnInit {
	guests$!: Observable<Presby[]>;
	guestId = 0;
	
	constructor (
		private	service:	PresbyService,
		private	route:		ActivatedRoute
	) {}
	
	ngOnInit() {
		this.guests$ = this.route.paramMap.pipe(
			switchMap(params => {
				this.guestId = parseInt( params.get( 'guestId' )!, 10 );
				return this.service.getPresbies()
			})
		)
	}
}
