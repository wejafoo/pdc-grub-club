

import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { ActivatedRoute	} from '@angular/router';
import { Observable		} from 'rxjs';
import { switchMap		} from 'rxjs/operators';
import { PresbyService	} from '../../services/presby.service';
import { Presby			} from '../../models/presby';
																														// TODO: Feature Componetize like PlanningCenter
@Component({
	selector: 'app-presby-list',
	templateUrl: './host-list.component.html',
	styleUrls: ['./host-list.component.sass']
})
export class HostListComponent implements OnInit {
	hosts$!: Observable<Presby[]>;
	hostId = 0;
	
	constructor (
		private	service:	PresbyService,
		private	route:		ActivatedRoute
	) {}
	
	ngOnInit() {
		this.hosts$ = this.route.paramMap.pipe( switchMap(params => {
			this.hostId = parseInt( params.get( 'hostId' )!, 10 );
			return this.service.getPresbies()
		}))
	}
}
