

import { environment 				} from '../environments/environment';
import { BrowserAnimationsModule	} from '@angular/platform-browser/animations';
import { BrowserModule				} from '@angular/platform-browser';
import { FormsModule				} from '@angular/forms';
import { NgModule					} from '@angular/core';
import { AngularFireModule			} from '@angular/fire';							// AUTH
import { HttpClientModule			} from '@angular/common/http';					// AUTH
import { InMemoryCache       		} from '@apollo/client/core';
import { APOLLO_NAMED_OPTIONS		} from 'apollo-angular';						// cms
import { HttpLink            		} from 'apollo-angular/http';
import { NamedOptions        		} from 'apollo-angular';
import { NgxAuthFirebaseUIModule	} from 'ngx-auth-firebaseui';					// AUTH

import { AppRoutingModule	} from './app-routing.module';
import { GraphQLModule		} from './sub-modules/graphql.module';
import { MaterialModule		} from './sub-modules/material.module';
import { PlanModule			} from './sub-modules/plan/plan.module';
import { PresbyModule		} from './sub-modules/presby/presby.module';
import { AdminComponent		} from './admin/admin.component';
import { AppComponent		} from './app.component';
import { MessageComponent	} from './compose-message/compose-message.component';
import { HomeComponent		} from './home/home.component';
import { LoginComponent		} from './login/login.component';
import { LogoutComponent	} from './logout/logout.component';
import { NoSoupComponent	} from './no-soup/no-soup.component';
import { NavPipe			} from './_pipes/nav.pipe';
import { SafePipe			} from './_pipes/safe.pipe';

import 'hammerjs';

export function firebaseAppNameFactory() { return `weja-us` }

@NgModule({
	declarations:	[
		AppComponent,
		AdminComponent,
		HomeComponent,
		LoginComponent,
		LogoutComponent,
		MessageComponent,
		NoSoupComponent,
		NavPipe,
		SafePipe
	],
	imports: [
		BrowserModule,
		AngularFireModule.initializeApp(
			environment.firebase.creds
		),
		BrowserAnimationsModule,
		FormsModule,
		GraphQLModule,
		HttpClientModule,
		MaterialModule,
		NgxAuthFirebaseUIModule.forRoot(
			environment.firebase.creds,
			firebaseAppNameFactory,
			environment.firebase.configs
		),
		PlanModule,
		PresbyModule,
		AppRoutingModule		// absolutely MUST remain last!!!
	],
	providers: [{
		provide: APOLLO_NAMED_OPTIONS, deps: [HttpLink],
		useFactory( httpLink: HttpLink ): NamedOptions {
			return {
				newClientName: {
					cache:	new InMemoryCache(),
					link:	httpLink.create({ uri: environment.service.roster })
				}
			}
		}
	}],
	bootstrap:	[AppComponent]
})
export class AppModule {}


// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // ELEMENT SUPPORT
// schemas:	[CUSTOM_ELEMENTS_SCHEMA],
// Diagnostic router configuration inspector --
// custom replacer displays function names pulled from route configs
// constructor(router:Router){
// 	const replacer=(key:any,value:{name:any})=>{
// 	(typeof value==='function')?value.name:value
// 	}
// 	if (this.debug) console.log('Routes:',JSON.stringify(router.config,replacer,2))
// }
// Register the ServiceWorker below asap,
// once the app is stable or after 30 seconds (whichever comes first).
// ServiceWorkerModule.register('ngsw-worker.js',
// {enabled:environment.production,registrationStrategy:'registerWhenStable:30000'}),
