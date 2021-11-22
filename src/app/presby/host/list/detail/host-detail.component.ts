

import { environment	} from '../../../../../environments/environment';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { map			} from 'rxjs/operators';
import { switchMap		} from 'rxjs/operators';
import { Observable		} from 'rxjs';
import { of				} from 'rxjs';
import { PresbyService	} from '../../../services/presby.service';
import { Presbies		} from '../../../../../../.ARCHIVE/models/plan';
import { Presby			} from '../../../../../../.ARCHIVE/models/plan';

@Component({selector: 'app-host-detail', templateUrl: './host-detail.component.html', styleUrls: ['./host-detail.component.sass']})
export class HostDetailComponent implements OnInit {
	env:		any;
	host!:		Presby;
	hostId!:	string;
	hosts!:		Observable<Presbies>;
	
	constructor (
		private	presbyS:	PresbyService,
		private	route:		ActivatedRoute,
		private	router:		Router
	) { this.env = environment }
	
	ngOnInit() {
		this.hosts = this.presbyS.watch().valueChanges.pipe( map(result => {
			this.route.paramMap.pipe( switchMap(params => of( params.get( 'hostId' )))).subscribe(hostId => this.hostId = hostId! )
			return result.data.presbies
		}))
	}
	
	toHost(host: Presby) { this.router.navigate(['/host', {id: host.id}]).then( r => console.log(r))}
}
