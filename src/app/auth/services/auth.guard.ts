

import { environment			} from '../../../environments/environment';
import { ActivatedRouteSnapshot	} from '@angular/router';
import { CanActivate			} from '@angular/router';
import { CanActivateChild		} from '@angular/router';
import { CanLoad				} from '@angular/router';
import { Injectable				} from '@angular/core';
import { NavigationExtras		} from '@angular/router';
import { Route					} from '@angular/router';
import { RouterStateSnapshot	} from '@angular/router';
import { AuthService			} from './auth.service';

// import { Router	} from '@angular/router';
// private router: Router

@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
	env:	any;
	debug:	boolean;
	
	constructor ( private authService: AuthService ) {
		this.env	= environment;
		this.debug	= this.env.debug
	}
	
	canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean {
		const url: string = state.url;
		return this.checkLogin( url );
	}
	
	canActivateChild( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean { return this.canActivate( route, state )}
	
	canLoad( route: Route ): boolean {
		const url = `/${route.path}`;
		return this.checkLogin( url );
	}
	
	checkLogin( url: string ): boolean {
		if ( this.authService.isLoggedIn ) return true;
		this.authService.redirectUrl = url;																				// Store the attempted URL for redirecting
		// const sessionId = 123456789;																					// Create a dummy session id
		// const navigationExtras: NavigationExtras = {queryParams: { session_id: sessionId }, fragment: 'anchor'};		// Set our navigation extras object that contains our global query params and fragment
		if ( this.debug ) console.log( 'AuthGuard redirect to:', url );
		// this.router.navigate(['/login'], navigationExtras ).then( r => {												// Navigate to the login page with extras
		// if ( this.debug ) console.log( r ));})
		return false;
	}
}
