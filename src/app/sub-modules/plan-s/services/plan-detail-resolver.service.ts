

import { environment			} from '../../../../environments/environment';
import { Injectable				} from '@angular/core';
import { Resolve				} from '@angular/router';
import { RouterStateSnapshot	} from '@angular/router';
import { ActivatedRouteSnapshot	} from '@angular/router';
import { Observable				} from 'rxjs';
import { of						} from 'rxjs';
import { EMPTY					} from 'rxjs';
import { PlanService			} from './plan.service';
import { Plan					} from '../../models/plan';

@Injectable({providedIn: 'root'})
export class PlanResolver implements Resolve<Plan> {
	env:	any;
	debug:	boolean;
	constructor(private plan: PlanService) {
		this.env	= environment;
		this.debug	= this.env.debug;
		console.log('>>> PlanResolver');
	}
	
	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Plan> | Observable<never> {
		const id: number = +route.paramMap.get( 'planId' )!;
		const tmpPlan = this.plan.getPlan( id );
		if ( tmpPlan ) {
			// if ( this.debug )
				console.log( '>>> PlanResolver says: Requested plan navigation was found VALID:', tmpPlan );
			return of( tmpPlan )
		} else {
			// if ( this.debug )
				console.log( '>>> PlanResolver says: Requested plan navigation was found INVALID:',	tmpPlan );
			return EMPTY
		}
	}
}
