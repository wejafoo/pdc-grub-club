

import { Injectable			} from '@angular/core';
import { PreloadingStrategy	} from '@angular/router';
import { Route				} from '@angular/router';
import { Observable			} from 'rxjs';
import { of					} from 'rxjs';

@Injectable({ providedIn: 'root' })

export class SelectivePreloadingStrategyService implements PreloadingStrategy {
	
	preloadedModules: string[] = [];
	
	preload( route: Route, load: () => Observable<any> ): Observable<any> {
	
		if ( route.data && route.data.preload && route.path != null ) {
			this.preloadedModules.push( route.path );						// add the route path to the preloaded module array
			console.log( 'Preloaded: ' + route.path );						// log the route path to the console
			
			return load()
		} else {
			return of(null );
		}
	}
}
