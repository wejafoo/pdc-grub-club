

import { environment	} from '../../environments/environment';
import { NgModule		} from '@angular/core';
import { APOLLO_OPTIONS	} from 'apollo-angular';
import { InMemoryCache	} from '@apollo/client/core';
import { HttpLink		} from 'apollo-angular/http';

const uri = environment.service.roster;

@NgModule({
	providers: [{
		provide: APOLLO_OPTIONS,
		deps: [HttpLink],
		useFactory(httpLink: HttpLink) { return { cache: new InMemoryCache(), link: httpLink.create({ uri })}}
	}]
})

export class GraphQLModule {
	env:	any;
	cms:	string;
	roster:	string;
	
	constructor() {
		this.env	= environment;
		this.roster	= this.env.service.roster;
		this.cms	= this.env.service.cms;
		console.log('Roster:', this.roster);
		console.log('CMS:', this.cms);
	}
}

