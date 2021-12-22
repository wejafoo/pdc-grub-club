

import { environment	} from '../../../../environments/environment';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { PresbyService	} from '../presby.service';

import { Presbies	} from '../../models/roster';
import { Presby		} from '../../models/roster';

@Component({
	selector: 'app-host-host-detail',
	templateUrl: './host-detail.component.html',
	styleUrls: ['./host-detail.component.sass']
})
export class HostDetailComponent implements OnInit {
	env:	any;
	debug:	any;
	hosts:	Presbies | undefined | null;
	
	constructor (
		private presby:	PresbyService,
		private	route:	ActivatedRoute,
		private	router:	Router
	) {
		this.env	= environment;
		this.debug	= this.env.debug;
		console.log('>>> HostDetailComponent');
	}
	
	ngOnInit() {
		this.hosts = this.presby.getData()
	}
	
	toHost(host: Presby) {
		this.router.navigate(['/host', {id: host.id}]).then()
	}
}
