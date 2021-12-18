

import { environment	} from '../../../../environments/environment';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { PresbyService	} from '../presby.service';
import { Presbies		} from '../../../../../.ARCHIVE/models/plan';

@Component({ templateUrl: './host-list.component.html'})
export class HostListComponent implements OnInit {
	env:	any;
	hosts:	Presbies;
	
	constructor( private router: Router, private presby: PresbyService ) { this.env = environment }
	
	ngOnInit() { this.hosts = this.presby.getData()}
	toGuests() { this.router.navigate(['/guests']).then(r => console.log(r))}
}


