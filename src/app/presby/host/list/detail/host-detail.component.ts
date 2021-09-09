

import { environment	} from '../../../../../environments/environment';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable		} from 'rxjs';
import { switchMap		} from 'rxjs/operators';
import { PresbyService	} from '../../../services/presby.service';
import { Presby			} from '../../../../../../.ARCHIVE/models/plan';

@Component({
	selector: 'app-host-detail',
	templateUrl: './host-detail.component.html',
	styleUrls: ['./host-detail.component.sass']
})

export class HostDetailComponent implements OnInit {
	env:		any;
	debug:		boolean;
	host$!:		Observable<Presby>;
	
	constructor (
		private	route:	ActivatedRoute,
		private	router:	Router,
		private	ps:		PresbyService
	) {
		this.env	= environment;
		this.debug	= this.env.debug;
	}
	
	ngOnInit	(				) { this.host$ = this.route.paramMap.pipe(switchMap(params => this.ps.getPresby(params.get('hostId')!)))}
	toHosts		( host: Presby	) { this.router.navigate(['/host', {id: host.id}]).then(r => console.log(r))}
}
