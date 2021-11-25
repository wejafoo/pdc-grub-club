

import { environment		} from '../../environments/environment';
import { Component			} from '@angular/core';
import { HttpClient			} from '@angular/common/http';
import { Input				} from '@angular/core';
import { OnInit				} from '@angular/core';
import { ActivatedRoute		} from '@angular/router';
import { AngularFireAuth	} from '@angular/fire/auth';
import { Router				} from '@angular/router';
import { Theme				} from 'ngx-auth-firebaseui';

import firebase from 'firebase';
import IdTokenResult = firebase.auth.IdTokenResult;

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.sass']
})

export class HomeComponent implements OnInit {
	env:	any;
	error:	boolean;
	index:	number;
	login:	false;
	title:	string;
	
	loggedIn	= false;
	themes		= Theme;
	
	@Input() apiReply: {};
	
	constructor(
		private fireAuth:	AngularFireAuth,
		private route:		ActivatedRoute,
		public	router:		Router,
		private http:		HttpClient
	) { this.env = environment }
	
	
	ngOnInit(): void	{
		this.fireAuth.authState.subscribe(auth => {
			if ( this.env.debug ) console.log( '>> HomeComponent -> authState change:', auth );
			this.loggedIn = !auth === null;
			if ( this.loggedIn ) {
				auth.getIdTokenResult().then(( idTokenResult: IdTokenResult ) => {
					if (this.env.debug) console.log( '>> HomeComponent -> Local token result:', idTokenResult );
					const dest = this.env.service.auth;
					const headers = { Authorization: 'Bearer ' + idTokenResult.token };
					this.http.get<any>(dest, {headers}).subscribe(data => {
						if (this.env.debug) console.log( '\nRetrieving:', dest, '\nResult:', data );
						data.idTokenResult = idTokenResult;
						this.apiReply = data;
					})
				})
			}
		})
	}

	logout(): void { this.fireAuth.signOut().then( r => console.log( '>> HomeComponent -> logged out:', r ))}
	onSignOut(): void { console.log( 'Sign-out successful!' )}
	onAccountDeleted(): void { console.log( 'Account Delete successful!' )}
}
