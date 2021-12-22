

import { environment		} from '../../environments/environment';
import { AngularFireAuth	} from '@angular/fire/auth';
import { Component			} from '@angular/core';
import { OnInit				} from '@angular/core';
import { Router				} from '@angular/router';

@Component({
	selector: 'app-logged-out',
	templateUrl: './logout.component.html',
	styleUrls: ['./logout.component.sass']
})
export class LogoutComponent implements OnInit {
	env:	any;
	debug:	any;
	
	index		= 0;
	error		= false;
	loggedIn	= false;
	title		= 'Authentication Demo';
	
	constructor(
		private fireAuth:	AngularFireAuth,
		public	router:		Router
	) {
		this.env	= environment;
		this.debug	= this.env.debug;
		console.log('>>> LogoutComponent');
	}

	ngOnInit(): void {
		this.fireAuth.authState.subscribe(auth => {
			return this.loggedIn = (!auth === null)
		})
	}

	logout(): void {
		this.fireAuth.signOut().then(r => console.log(
			'>>> LogoutComponent says: logging out user:', r
		))
	}

	onSignOut(): void {
		console.log('>>> LogoutComponent says: Sign-out successful!')
	}

	onAccountDeleted():	void {
		console.log('>>> LogoutComponent says: account deletion successful!')
	}
}
