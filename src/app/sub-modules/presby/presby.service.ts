

import { environment	} from '../../../environments/environment'
import { Injectable		} from '@angular/core';
import { Apollo			} from 'apollo-angular';
import { ApolloBase		} from 'apollo-angular';
import { gql			} from 'apollo-angular';
import { Presbies		} from '../models/roster';

@Injectable({ providedIn: 'root' })
export class PresbyService {
	env:			any;
	debug:			any;
	presbies:		Presbies;
	public apollo:	ApolloBase;
	
	QUERY = gql`{
		presbies {
			key id isActive last guests guestings hostings
			seats subs steps email home	cell smail city st zip
		}
	}`;
	
	constructor(private apolloProvider: Apollo) {
		this.env	= environment;
		this.debug	= this.env.debug;
		this.apollo = this.apolloProvider.use('rosterClient');
		this.apollo.watchQuery({query: this.QUERY}).valueChanges.subscribe( p => {
			this.presbies = p.data['presbies'];
			console.log('>>> PresbyService says:  Incoming roster update...\n', this.presbies);
		})
	}

	getPresbies() { return this.presbies }
}

