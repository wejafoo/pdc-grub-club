

import { environment	} from '../../../../environments/environment';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PresbyService	} from '../presby.service';
import { Presbies		} from '../../../../../.ARCHIVE/models/plan';
import { Presby			} from '../../../../../.ARCHIVE/models/plan';

@Component({
	selector: 'app-host-host-detail',
	templateUrl: './host-detail.component.html',
	styleUrls: ['./host-detail.component.sass']
})

export class HostDetailComponent implements OnInit {
	env:	any;
	hosts:	Presbies | undefined | null;
	
	constructor (
		private	route:	ActivatedRoute,
		private	router:	Router,
		private presby:	PresbyService
	) {
		this.env = environment;
	}
	
	ngOnInit() { this.hosts = this.presby.getData()}
	toHost( host: Presby ) { this.router.navigate(['/host', {id: host.id}]).then( r => console.log(r))}
}
