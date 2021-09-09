

import { environment	} from '../../../environments/environment';
import { Injectable		} from '@angular/core';
import { Observable		} from 'rxjs';
import { of				} from 'rxjs';
import { map			} from 'rxjs/operators';
import { MessageService	} from '../../services/message.service';
import { PRESBIES		} from '../../../../.ARCHIVE/models/mock-presbies';
import { Presby			} from '../../../../.ARCHIVE/models/plan';

@Injectable({ providedIn: 'root' })

export class PresbyService {
	env:	any;
	debug:	boolean;
	
	constructor ( private messageService: MessageService ) {
		this.env	= environment;
		this.debug	= this.env.debug
	}
																														// TODO: send the message _after_ fetching the presbies
	getPresbies (): Observable<Presby[]> {
		this.messageService.add('PresbyService: fetched presbies');
		return of(PRESBIES)
	}
	
	getPresbyActive () {
		const returnActive: Presby[] = [];
		for ( let i = 0, iLen = PRESBIES.length; i < iLen; i++ ) {
			if ( PRESBIES[i].active === true ) {
				if (this.debug) console.log( PRESBIES[i].name, 'is ACTIVE!' );
				returnActive.push( PRESBIES[i] )
			} else {
				if (this.debug) console.log( PRESBIES[i].name, 'is not participating this time!' )
			}
		}
		return returnActive
	}
																													// keep an eye on this ---------v (exclamation point)
	getPresby ( id: number | string ) { return this.getPresbies().pipe( map(( presbies: Presby[] ) => presbies.find( presby => presby.id === +id)!))}
}

