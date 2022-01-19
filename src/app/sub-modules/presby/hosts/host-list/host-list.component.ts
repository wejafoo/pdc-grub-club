

import { environment	} from '../../../../../environments/environment';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { PresbyService	} from '../../presby.service';
import { Presbies		} from '../../../models/roster';

@Component({ templateUrl: './host-list.component.html'})
export class HostListComponent implements OnInit {
	env:		any;
	debug:		any;
	hosts:		Presbies;
	allowAdd:	boolean;
	
	constructor(
		public presby:	PresbyService,
		public router:	Router,
		public route:	ActivatedRoute
	) {
		this.env		= environment;
		this.debug		= this.env.debug;
		this.allowAdd	= false;
		console.log('>>> HostListComponent');
	}
	
	ngOnInit() {
		this.presby.apollo.watchQuery({query: this.presby.QUERY}).valueChanges.subscribe( ret => {
			this.allowAdd = true;
			console.log('>>> HostListComponent > PresbyService says:  Incoming roster update...');
			this.hosts = ret.data['presbies'];
		})
	}
	
	add() { console.log('>>> HostListComponent > add()')}
}


