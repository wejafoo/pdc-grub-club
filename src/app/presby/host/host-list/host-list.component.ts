

import { environment	} from '../../../../environments/environment';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { ActivatedRoute	} from '@angular/router';
import { Router			} from '@angular/router';
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
	env:		any;
	debug:		any;
	hosts$!:	Observable<Presby[]>;
	hostId = 0;
	
	constructor (
		private	service:	PresbyService,
		private	router:		Router,
		private	route:		ActivatedRoute
	) {
		this.env	= environment;
		this.debug	= this.env.debug
	}
	
	ngOnInit() {
		this.hosts$ = this.route.paramMap.pipe( switchMap(params => {
			this.hostId = parseInt( params.get( 'hostId' )!, 10 );
			return this.service.getPresbies()
		}))
	}
	
	toHosts() { this.router.navigate(['/guests']).then( r => {if (this.debug) console.log(r)})}
}
