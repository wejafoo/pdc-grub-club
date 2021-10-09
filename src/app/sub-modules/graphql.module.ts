

import { environment	} from '../../environments/environment';
import { NgModule		} from '@angular/core';
import { APOLLO_OPTIONS	} from 'apollo-angular';
import { InMemoryCache	} from '@apollo/client/core';
import { HttpLink		} from 'apollo-angular/http';

const uri = 'http://localhost:8080';

@NgModule({
	providers: [{
		provide:	APOLLO_OPTIONS, useFactory( httpLink: HttpLink ) { return { cache: new InMemoryCache(), link: httpLink.create({ uri })}},
		deps:		[HttpLink]
	}]
})
export class GraphQLModule {
	env: any;
	uri: string;
	
	constructor() {
		this.env = environment;
		this.uri = this.env.cms.service;
		console.log( 'CMS:', this.uri );
	}
}

