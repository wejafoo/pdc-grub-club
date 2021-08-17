

import { NgModule					} from '@angular/core';
import { BrowserAnimationsModule	} from '@angular/platform-browser/animations';
import { BrowserModule				} from '@angular/platform-browser';
import { FormsModule				} from '@angular/forms';
import { MaterialModule				} from './sub-modules/material.module';
import { AppComponent				} from './app.component';
import { AppRoutingModule			} from './app-routing.module';
import { AuthModule					} from './auth/auth.module';
import { ComposeMessageComponent	} from './compose-message/compose-message.component';
import { NoSoupComponent			} from './no-soup/no-soup.component';
import { PlanModule					} from './plan/plan.module';
import { PresbyModule				} from './presby/presby.module';

// import { Router } from '@angular/router';		// Only necessary for routing diagnostics(commented out below)

@NgModule({
	imports: [
		BrowserModule,
		AuthModule,
		BrowserAnimationsModule,
		FormsModule,
		MaterialModule,
		PlanModule,
		PresbyModule,
		AppRoutingModule	// this absolutely MUST remain last!!!!!
	],
	declarations:	[AppComponent, ComposeMessageComponent, NoSoupComponent],
	bootstrap:		[AppComponent]
})

export class AppModule {
	/* Diagnostic router configuration inspector -- custom replacer displays function names pulled from route configs
	constructor ( router: Router ) {
		const replacer = ( key: any, value: {name: any}) => ( typeof value === 'function' ) ? value.name : value;
		if (this.debug) console.log( 'Routes: ', JSON.stringify( router.config, replacer, 2 ))
	} */
}
