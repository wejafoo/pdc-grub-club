

import { environment		} from '../../../environments/environment';
import { Component			} from '@angular/core';
import { NavigationExtras	} from '@angular/router';
import { Router				} from '@angular/router';
import { AuthService		} from '../services/auth.service';


@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.sass']
})

export class LoginComponent {
	env:		any;
	debug:		boolean;
	message:	string;
	
	constructor (
		public authService:	AuthService,
		public router:		Router
	) {
		this.env		= environment;
		this.debug		= this.env.debug;
		this.message	= this.getMessage()
	}
	
	getMessage() { return 'Logged ' + ( this.authService.isLoggedIn ? 'in' : 'out' )}
	
	login() {
		this.message = 'Trying to log in ...';
		this.authService.login().subscribe(() => {
			this.message = this.getMessage();
			if ( this.authService.isLoggedIn ) {
				const redirectUrl = '/admin';																			// Usually you would use the redirect URL from the auth service.  However to keep the example simple, we will always redirect to `/admin`.
				const navigationExtras: NavigationExtras = { queryParamsHandling: 'preserve', preserveFragment: true };	// Set our navigation extras object that passes on our global query params and fragment
				if ( this.debug ) console.log( 'Querying auth service:', this.authService.isLoggedIn );
				// this.router.navigate([redirectUrl], navigationExtras ).then( r => console.log( r ))					// Redirect user on success
			}
		})
	}
	
	logout() {
		this.authService.logout();
		this.message = this.getMessage()
	}
}
