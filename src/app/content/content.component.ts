

import { environment	} from '../../environments/environment';
import { Component 		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Observable		} from 'rxjs';
import { map			} from 'rxjs/operators';
import { PresbyService	} from '../presby/services/presby.service';
import { Presbies		} from '.ARCHIVE/models/plan';

@Component({ templateUrl: 'content.component.html' })

export class ContentComponent implements OnInit {
	env:		any;
	debug:		any;
	error:		any;
	presbies!:	Observable<Presbies>;
	
	constructor(
		public presbyS: PresbyService
	) { this.env = environment }
	
	ngOnInit() {
		this.presbies = this.presbyS.watch().valueChanges.pipe( map(( result: { data: { presbies: Presbies; }} ) => result.data.presbies ))
	}
}
