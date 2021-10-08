

import { environment	} from '../../../../environments/environment';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { map			} from 'rxjs/operators';
import { PresbyService	} from '../../services/presby.service';
import { Presby			} from '../../../../../.ARCHIVE/models/plan';

// import { Observable		} from 'rxjs';
// import { ActivatedRoute } from '@angular/router';
// import { switchMap } from 'rxjs/operators';

@Component({
	selector: 'app-presby-list',
	templateUrl: './host-list.component.html',
	styleUrls: ['./host-list.component.sass']
})

export class HostListComponent implements OnInit {
	env:	any;
	hosts!:	Presby[];
	
	hostId = 0;
	
	constructor (
		public presbyS:	PresbyService,
		public router:	Router,
	) {
		this.env = environment
	}
	
	ngOnInit() {
		this.presbyS.watch().valueChanges.pipe( map(result => {
			this.hosts = result.data.presbies
		} ))
	}
	toHosts		() { this.router.navigate(['/guests']).then(r => console.log(r))}
}

// this.route.paramMap.pipe( switchMap(params => {
// this.hostId = parseInt( params.get( 'hostId' )!, 10 );
// return this.service.getPresbies()
// 	}))
