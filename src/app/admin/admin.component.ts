

import { environment	} from '../../environments/environment';
import { Component		} from '@angular/core';
import { Router			} from '@angular/router';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.sass']
})
export class AdminComponent {
	env:			any;
	debug:			any;
	changed:		boolean;
	panelOpenState:	boolean;
	saveService:	string;
	public rosterUrl =
		'https://docs.google.com/spreadsheets/d/1V8L8Ub1FRKhXo1pLxwxXiBwIz1TWtatqheHh4RPltJ8';
	public serviceUrl =
		JSON.parse( localStorage.getItem('rosterService')) ||
			'http://localhost:8080/tab/Presbies/query';
	
	constructor(
		private router: Router
	) {
		this.env = environment;
		this.debug = this.env.debug;
		this.changed = false
		this.saveService = localStorage.getItem('rosterService')
		this.panelOpenState = true;
		console.log('>>> AdminComponent > changed?', this.changed);
	}
	
	reload() {
		console.log(
			'!!!!\n\tReloading:\t>'	+
			localStorage.getItem('rosterService') + '<'
		);
		console.log( 'orig:', window.location.origin );
		window.location.replace(window.location.origin + '/plan/s');
	}
	
	cancelChange() {
		console.log(
			'!!!!\n\tReplacing:\t>'	+ localStorage.getItem('rosterService') +
			'<\n\t     with:\t>'	+ this.saveService + '<'
		);
		localStorage.setItem('rosterService', this.saveService)
		this.router.navigate(['/plan', 's']).then()
	}
	
	rosterUrlChange(newValue: string): void {
		this.changed = true;
		console.log('event:', newValue);
		localStorage.setItem('rosterUrl', JSON.stringify(newValue));
	}
	
	updateRosterService(newValue: string): void {
		this.changed = true;
		console.log('event:', newValue);
		localStorage.setItem('rosterService', JSON.stringify(newValue));
	}
}
