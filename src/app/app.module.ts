

import { NgModule					} from '@angular/core';
import { BrowserAnimationsModule	} from '@angular/platform-browser/animations';
import { BrowserModule				} from '@angular/platform-browser';
import { FormsModule				} from '@angular/forms';
import { Router						} from '@angular/router';
import { AppComponent				} from './app.component';
import { AppRoutingModule			} from './app-routing.module';
import { AuthModule					} from './auth/auth.module';
import { ComposeMessageComponent	} from './compose-message/compose-message.component';
import { PageNotFoundComponent		} from './page-not-found/page-not-found.component';
import { PlanModule					} from './plan/plan.module';
import { PresbiesModule				} from './presbies/presbies.module';

@NgModule({
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		PlanModule,
		PresbiesModule,
		AuthModule,
		AppRoutingModule,
	],
	declarations:	[
		AppComponent,
		ComposeMessageComponent,
		PageNotFoundComponent
	],
	bootstrap:		[
		AppComponent
	]
})

export class AppModule {
	// Diagnostic router configuration inspector -- custom replacer displays function names pulled from route configs
	/*
		constructor ( router: Router ) {
			const replacer = ( key: any, value: {name: any}) => ( typeof value === 'function' ) ? value.name : value;
			console.log( 'Routes: ', JSON.stringify( router.config, replacer, 2 ))}
	*/
}
