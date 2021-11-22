

import { environment		} from '../../environments/environment';
import { ActivatedRoute		} from '@angular/router';
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
	env: any;
	index		= 0;
	error		= false;
	loggedIn	= false;
	title		= 'Authentication Demo';
	
	constructor(
		private route:		ActivatedRoute,
		private fireAuth:	AngularFireAuth,
		public	router:		Router
	) {
		this.env = environment;
	}
	
	ngOnInit(): void	{
		this.fireAuth.authState.subscribe(auth => {
			console.log( '>> LogoutComponent -> authState change:', auth );
			this.loggedIn = ! auth === null;
		});
	}
	
	logout():			void { this.fireAuth.signOut().then( r => console.log( '>> HomeComponent -> logged out:', r ))}
	onSignOut():		void { console.log( 'Sign-out successful!'	)}
	onAccountDeleted():	void { console.log( 'Account Delete successful!' )}
}
