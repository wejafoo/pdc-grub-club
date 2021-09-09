

import { environment } from '../../../environments/environment';

import { Injectable	 } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class ScheduleService {
	env:	any;
	debug:	boolean;
	// scheduleSubject	= new BehaviorSubject<Plans>(this.plans);
	
	constructor () {
		this.env	= environment;
		this.debug	= this.env.debug
	}
	
}




