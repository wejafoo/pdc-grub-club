

import { NgModule					} from '@angular/core';
import { BrowserAnimationsModule	} from '@angular/platform-browser/animations';
import { BrowserModule				} from '@angular/platform-browser';
import { FormsModule				} from '@angular/forms';
import { HttpClientModule			} from '@angular/common/http';

import { AppRoutingModule			} from './app-routing.module';
import { AuthModule					} from './auth/auth.module';
import { GraphQLModule				} from './sub-modules/graphql.module';
import { MaterialModule				} from './sub-modules/material.module';
import { PlanModule					} from './plan/plan.module';
import { PresbyModule				} from './presby/presby.module';

import { AppComponent				} from './app.component';
import { ComposeMessageComponent	} from './compose-message/compose-message.component';
import { NoSoupComponent			} from './no-soup/no-soup.component';

import { NavPipe					} from './_pipes/nav.pipe';
import { SafePipe					} from './_pipes/safe.pipe';

@NgModule({
	declarations:	[
		AppComponent,
		ComposeMessageComponent,
		NoSoupComponent,
		NavPipe,
		SafePipe,
	],
	imports: [
		BrowserModule,
		AuthModule,
		BrowserAnimationsModule,
		FormsModule,
		GraphQLModule,
		HttpClientModule,
		MaterialModule,
		PlanModule,
		PresbyModule,
		AppRoutingModule	// this absolutely MUST remain last!!!!!
	],
	bootstrap:	[AppComponent]
})

export class AppModule {
	/* Diagnostic router configuration inspector -- custom replacer displays function names pulled from route configs
	constructor ( router: Router ) {
		const replacer = ( key: any, value: {name: any}) => ( typeof value === 'function' ) ? value.name : value;
		if (this.debug) console.log( 'Routes: ', JSON.stringify( router.config, replacer, 2 ))
	} */
}
