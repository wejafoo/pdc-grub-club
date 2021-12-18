

import { environment		} from '../../environments/environment';
import { ActivatedRoute		} from '@angular/router';
import { AngularFireAuth	} from '@angular/fire/auth';
import { Component			} from '@angular/core';
import { Router				} from '@angular/router';

import { AuthProvider } from 'ngx-auth-firebaseui';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.sass']
})
export class LoginComponent {
	env:			any;
	error:			boolean;
	index:			number;
	returnService:	string;
	
	providers = AuthProvider;
	
	constructor(
		public	fireAuth:	AngularFireAuth,
		private	route:		ActivatedRoute,
		public	router:		Router
	) {
		this.env			= environment
		this.error			= false;
		this.index			= 0;
		this.returnService	= this.route.snapshot.params.returnService;
		console.log('>>> LoginComponent');
	}
	
	onSuccess(event: string) {
		this.error	= false;
		this.index	= 2;
		if (this.env.debug)  console.log('>>> LoginComponent -> event:', event);
		if ( this.returnService != null ) {
			if (this.returnService === 'private') {
				this.router.navigate(['/plan', 's']).then()
			} else {
				window.location.replace('/' + this.returnService)
			}
		} else {
			if (this.env.local) { this.router.navigate(['/plan', 's']).then()} else {
				window.location.replace(this.env.authGuardRemoteLoggedInURL);
			}
		}
	}
	
	onError(event: string) {
		this.error = true;
		if (this.env.debug)  console.log('>>> LoginComponent -> event:', event);
	}
	
	logout(): void {
		this.fireAuth.signOut().then(r => console.log('>>> LoginComponent -> signOut:', r))
	}
}

// console.log('HEY! the return service is NOT null, but:',this.returnService,'...event:',event)
// onSignOut():void{console.log('>>> LoginComponent -> onSignOut() -> successful?\t', true)}
// console.log('>>>LoginComponent says: returning to whence:',this.returnService,'... event:',event)
// import{OnInit} from '@angular/core';
// import{Theme} from 'ngx-auth-firebaseui'
// export class LoginComponent implements OnInit{
// ngOnInit(){}
// signOutText='Confirm Logout?'
// controls:any
// emailText='E-mail'
// emailConfirmationText=`A confirmation e-mail has been sent to you.
// Check your inbox and click on the link "Confirm my e-mail" to confirm your e-mail address.`
// emailErrorPatternText='Please enter a valid e-mail address'
// registerButtonText='Register'
// resetPasswordTabText='Reset e-mail address to password'
// resetPasswordInputText='Reset e-mail address to password'
// themes=Theme
// nameText='Name'
// onSuccess(event: any){
// onError(event: any){
