

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
	tmpSheetUrl:	string;
	tmpServiceUrl:	string;
	
	public roster = {
		sheetUrl:	'https://docs.google.com/spreadsheets/d/1V8L8Ub1FRKhXo1pLxwxXiBwIz1TWtatqheHh4RPltJ8',
		serviceUrl:	'http://localhost:8080/tab/Presbies/query'
	}
	
	constructor(private router: Router) {
		this.env		= environment;
		this.debug		= this.env.debug;
		this.changed	= false;
		if ( localStorage.getItem('roster') !== null ) {
			this.roster = JSON.parse( localStorage.getItem('roster'))
		}
		this.tmpSheetUrl	= this.roster.sheetUrl;
		this.tmpServiceUrl	= this.roster.serviceUrl;
		this.panelOpenState = true;
		console.log('>>> AdminComponent > changed?', this.changed);
	}
	
	save() {
		this.roster.sheetUrl	= this.tmpSheetUrl;
		this.roster.serviceUrl	= this.tmpServiceUrl;
		localStorage.setItem('roster', JSON.stringify(this.roster));
		console.log('>>> AdminComponent > save()', this.roster);
		this.router.navigate(['/plan', 's']).then();
	}
	
	cancel() {
		this.tmpSheetUrl	= this.roster.sheetUrl;
		this.tmpServiceUrl	= this.roster.serviceUrl;
		this.changed		= false;
		console.log('!!! CHANGES CANCELLED !!!');
		this.router.navigate(['/plan', 's']).then()
	}
	
	rosterUrlChange(newValue: string): void {
		this.changed = true;
		console.log('Roster URL change detected:', newValue);
		this.tmpSheetUrl = newValue;
	}
	
	updateRosterService(newValue: string): void {
		this.changed = true;
		console.log('Service URL change detected:', newValue);
		this.tmpServiceUrl = newValue;
	}
}
