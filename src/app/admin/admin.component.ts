

import { environment	} from '../../environments/environment';
import { Component		} from '@angular/core';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.sass']
})
export class AdminComponent {
	env:	any;
	debug:	any;
	
	changed	= false;
	public rosterUrl =
		'https://docs.google.com/spreadsheets/d/1V8L8Ub1FRKhXo1pLxwxXiBwIz1TWtatqheHh4RPltJ8';
	public serviceUrl = 'http://localhost:8080/query';
	
	constructor() {
		this.env	= environment;
		this.debug	= this.env.debug;
		console.log('>>> AdminComponent');
	}
	
	rosterUrlChange(newValue: string): void {
		console.log('event:', newValue);
		localStorage.setItem('rosterUrl', JSON.stringify(newValue));
	}
	
	rosterServiceChange(newValue: string): void {
		console.log('event:', newValue);
		localStorage.setItem('rosterService', JSON.stringify(newValue));
	}
}
