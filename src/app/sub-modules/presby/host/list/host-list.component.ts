

import { environment	} from '../../../../../environments/environment';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { PresbyService	} from '../../services/presby.service';
import { Presbies		} from '../../../../../../.ARCHIVE/models/plan';

// import { Observable } from 'rxjs';

@Component({
	selector: 'app-presby-list',
	templateUrl: './host-list.component.html',
	styleUrls: ['./host-list.component.sass']
})
export class HostListComponent implements OnInit {
	env:	any;
	hosts!:	Presbies;
	
	constructor (
		private router: Router,
		private presby: PresbyService
	) { this.env = environment }
	
	ngOnInit() {
		this.hosts = this.presby.getData()
		console.log( 'RECEIVED PRESBIES in HOSTS LIST:', typeof this.hosts, this.hosts )
	}
	toGuests() { this.router.navigate(['/guests']).then(r => console.log(r))}
}


