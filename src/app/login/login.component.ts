

import { environment		} from '../../environments/environment';
import { ActivatedRoute		} from '@angular/router';
import { AngularFireAuth	} from '@angular/fire/auth';
import { Component			} from '@angular/core';
import { OnInit				} from '@angular/core';
import { Router				} from '@angular/router';
import { AuthProvider		} from 'ngx-auth-firebaseui';
import { Theme				} from 'ngx-auth-firebaseui';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.sass']
})

export class LoginComponent implements OnInit {
	env:			any;
	controls:		any;
	error:			boolean;
	index:			number;
	returnService:	string;

	emailText				= 'E-mail';
	emailConfirmationText	= `A confirmation e-mail has been sent to you. Check your inbox and click on the link "Confirm my e-mail" to confirm your e-mail address.`;
	emailErrorPatternText	= 'Please enter a valid e-mail address';
	registerButtonText		= 'Register';
	resetPasswordTabText	= 'Reset e-mail address to password';
	resetPasswordInputText	= 'Reset e-mail address to password';
	signOutText				= 'Confirm Logout?';

	providers				= AuthProvider;
	themes					= Theme;
	// nameText = 'Name';
	
	constructor(
		public	fireAuth:	AngularFireAuth,
		private	route:		ActivatedRoute,
		public	router:		Router
	) {
		this.env			= environment
		this.error			= false;
		this.index			= 0;
		this.returnService	= this.route.snapshot.params.returnService;
	}
	
	ngOnInit() {}

	onSuccess(event: any) {
		this.error	= false;
		this.index	= 2;
		console.log( 'event:', event );
		if ( this.returnService != null ) {
			console.log( '>>>>>>>>>> HEY! the return service is NOT null, its:', this.returnService, '<<<<<<<<<<' );
			if ( this.returnService === 'private' ) {
				this.router.navigate(['/plan']).then()
			} else { window.location.replace('/' + this.returnService )}
		} else {
			if ( this.env.local ) {
				this.router.navigate(['/plan']).then()
			} else {
				console.log( '>>>>>>>>>> Returning to whence:', this.returnService, '<<<<<<<<<<' );
				window.location.replace( this.env.authGuardRemoteLoggedInURL )
			}
		}
	}
	
	onError( event: any ) {
		console.log( '>>LoginComponent -> onError -> event:', event );
		this.error = true;
	}
	
	logout():		void { this.fireAuth.signOut().then( r => console.log( '>> LoginComponent -> signOut:', r ))}
	onSignOut():	void { console.log( 'Sign-out successful!' )}
}

