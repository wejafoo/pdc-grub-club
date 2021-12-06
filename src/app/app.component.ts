

import { environment		} from '../environments/environment';
import { Component			} from '@angular/core';
import { RouterOutlet		} from '@angular/router';
import { slideInAnimation	} from './animations';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.sass'],
	animations: [slideInAnimation]
})
export class AppComponent {
	env:		any;
	
	constructor() {
		this.env = environment;
		console.log( 'env:', this.env );
	}
	getAnimationData( outlet: RouterOutlet ) { return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation }
}
