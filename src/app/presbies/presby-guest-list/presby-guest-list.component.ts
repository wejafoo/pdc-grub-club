

import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { ActivatedRoute	} from '@angular/router';
import { Observable		} from 'rxjs';
import { switchMap		} from 'rxjs/operators';
import { PresbyService	} from '../presby.service';
import { Presby			} from '../../models/presby';
																														// TODO: Feature Componetize like PlanningCenter

@Component({
	selector: 'app-presby-list',
	templateUrl: './presby-guest-list.component.html',
	styleUrls: ['./presby-guest-list.component.sass']
})
export class PresbyGuestListComponent implements OnInit {
	presbies$!: Observable<Presby[]>;
	selectedId = 0;
	
	constructor (
		private	service:	PresbyService,
		private	route:		ActivatedRoute
	) {}
	
	ngOnInit() {
		this.presbies$ = this.route.paramMap.pipe(
			switchMap(params => {
				this.selectedId = parseInt( params.get( 'id' )!, 10 );
				return this.service.getPresbies()
			})
		)
	}
}
