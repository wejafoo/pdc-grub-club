

import { NgModule				} from '@angular/core';
import { APOLLO_OPTIONS			} from 'apollo-angular';
import { InMemoryCache			} from '@apollo/client/core';
import { HttpLink				} from 'apollo-angular/http';

const uri = 'http://localhost:8080';

@NgModule({
	providers: [{
		provide:	APOLLO_OPTIONS, useFactory( httpLink: HttpLink ) { return { cache: new InMemoryCache(), link: httpLink.create({uri})}},
		deps:		[HttpLink]
	}]
})
export class GraphQLModule {}

// import { environment			} from '../../environments/environment';
// const uri = environment.cms.service;
// import { ApolloClientOptions } from '@apollo/client/core';
// export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> { return { link: httpLink.create({ uri }), cache: new InMemoryCache()}}
// providers: [{ provide: APOLLO_OPTIONS, useFactory: createApollo, deps: [HttpLink]}]
