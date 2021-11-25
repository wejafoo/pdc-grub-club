

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
		@Inject(NgxAuthFirebaseUIConfigToken)
		private config:	NgxAuthFirebaseUIConfig,
		private router:		Router,
		private authProcess:	AuthProcessService
	) { this.env = environment }
	
	canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<boolean> {
		console.log( 'DEBUG >>> AuthGuard() -> canActivate() -> auth config:', this.config )
		return this.authProcess.afa.user.pipe( map( user => {
			console.log( 'DEBUG >>> AuthGuard() -> canActivate() -> user:', user )
			if ( user ) {
				if ( this.config.guardProtectedRoutesUntilEmailIsVerified  && this.env.remote  &&  !user.emailVerified  &&  !user.isAnonymous ) {
					console.log( 'INFO\t>>> Oops...  you are logged in to a envRemote system with an account that has an unverified email address.' );
					console.log( 'DEBUG\t>>> AuthGuard -> canActivate() -> Redirecting to:', this.env.authGuardRemoteFallbackURL );
					window.location.href = this.env.authGuardRemoteFallbackURL;
				}
				return true
			} else {
				console.log( 'INFO\t>>> AuthGuard -> ACCESS DENIED -> Redirecting to:', this.env.authGuardRemoteFallbackURL, '--->', this.env.service.auth );
				// this.router.navigate([this.env.service.auth]);
				this.router.navigate(['/login']).then()
				return false 	// mifedom auth integration	// if ( this.env.local ) { this.router.navigate(['/login']).then()} else {window.location.href = this.env.authGuardRemoteFallbackURL + '?returnUrl=' + this.env.mifen.this}
}}))}}
