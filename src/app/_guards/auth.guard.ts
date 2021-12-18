

import { environment					} from '../../environments/environment';
import { ActivatedRouteSnapshot			} from '@angular/router';
import { CanActivate					} from '@angular/router';
import { Inject							} from '@angular/core';
import { Injectable						} from '@angular/core';
import { Router							} from '@angular/router';
import { RouterStateSnapshot			} from '@angular/router';
import { AuthProcessService				} from 'ngx-auth-firebaseui';
import { NgxAuthFirebaseUIConfig		} from 'ngx-auth-firebaseui';
import { NgxAuthFirebaseUIConfigToken	} from 'ngx-auth-firebaseui';
import { map							} from 'rxjs/operators';
import { Observable						} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
	env: any;
	constructor(
		private auth:		AuthProcessService,
		@Inject( NgxAuthFirebaseUIConfigToken )
		private config:		NgxAuthFirebaseUIConfig,
		private router:		Router
	) {
		this.env = environment;
		console.log('>>> AuthGuard');
	}
	
	canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<boolean> {
		if (this.env.debug)  console.log('!!! AuthGuard() -> canActivate() -> auth config:', this.config );
		return this.auth.afa.user.pipe( map( user => {
			if (this.env.debug) console.log( '!!! AuthGuard() -> canActivate() -> user:', user );
			if ( user ) {
				if ( this.config.guardProtectedRoutesUntilEmailIsVerified  && this.env.remote  &&  !user.emailVerified  &&  !user.isAnonymous ) {
					if (this.env.debug) {
						console.log(
							'??? AuthGuard says: Oops, this account is yet unverified.' +
							' YOU SHALL NOT PASS!'
						);
						console.log(
							'!!! AuthGuard says: just kidding:) -> Redirecting:',
							this.env.authGuardRemoteFallbackURL
						);
						window.location.href = this.env.authGuardRemoteFallbackURL;
					}
				}
				return true
			} else {
				if (this.env.debug)  console.log(
					'INFO\t>>> AuthGuard -> ACCESS DENIED -> Redirecting to:',
					this.env.authGuardRemoteFallbackURL,
					'--->', this.env.service.auth
				);
				this.router.navigate(['/login']).then()
				return false
}}))}}

// mifedom auth integration	// if ( this.env.local ) { this.router.navigate(['/login']).then()} else {window.location.href = this.env.authGuardRemoteFallbackURL + '?returnUrl=' + this.env.mifen.this}
// this.router.navigate([this.env.service.auth]);
