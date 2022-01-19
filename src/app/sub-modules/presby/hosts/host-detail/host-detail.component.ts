

import { environment	} from '../../../../../environments/environment';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { PresbyService	} from '../../presby.service';
import { Presbies		} from '../../../models/roster';
import { Presby			} from '../../../models/roster';

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
		private	router:	Router
	) {
		this.env	= environment;
		this.debug	= this.env.debug;
		console.log('>>> HostDetailComponent');
	}
	
	ngOnInit() {
		this.presby.apollo.watchQuery({query: this.presby.QUERY}).valueChanges.subscribe( ret => {
			console.log('>>> HostDetailComponent > PresbyService says:  Incoming roster update...');
			this.hosts = ret.data['presbies'];
		})
	}
	
	toHost(host: Presby) { this.router.navigate(['/host', {id: host.id}]).then()}
}
