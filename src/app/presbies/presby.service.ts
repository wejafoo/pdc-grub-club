

import { Injectable		} from '@angular/core';
import { Observable		} from 'rxjs';
import { of				} from 'rxjs';
import { map			} from 'rxjs/operators';
import { MessageService	} from '../services/message.service';
import { Presby			} from '../models/presby';
import { PRESBIES		} from '../models/mock-presbies';

@Injectable({ providedIn: 'root' })
export class PresbyService {
	
	constructor ( private messageService: MessageService ) { }
																														// TODO: send the message _after_ fetching the presbies
	getPresbies(): Observable<Presby[]> {
		this.messageService.add('PresbyService: fetched presbies');
		return of( PRESBIES );
	}
																														// (+) before `id` turns the string into a number
	getPresby( id: number | string ) {
		return this.getPresbies().pipe(
			map(( presbies: Presby[] ) => presbies.find( presby => presby.id === + id )!)
		)
	}
}

