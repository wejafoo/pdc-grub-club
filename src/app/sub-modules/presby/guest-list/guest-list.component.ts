

import { environment	} from '../../../../environments/environment';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { PresbyService	} from '../presby.service';
import { Presbies		} from '../../../../../.ARCHIVE/models/plan';

@Component({ templateUrl: './guest-list.component.html' })
export class GuestListComponent implements OnInit {
	env:	any;
	guests:	Presbies | undefined | null;
	
	constructor( private router: Router, private presby: PresbyService ) { this.env = environment }
	ngOnInit() { this.guests = this.presby.getData()}
	toHosts(){ this.router.navigate(['/host/list']).then(r => console.log(r))}
}
