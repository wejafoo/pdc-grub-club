

import { environment	} from '../../../environments/environment'
import { Injectable		} from '@angular/core';

import { Apollo		} from 'apollo-angular';
import { ApolloBase	} from 'apollo-angular';
import { gql		} from 'apollo-angular';

import { Presbies	} from '../models/roster';

@Injectable({ providedIn: 'root' })
export class PresbyService {
	env:		any;
	debug:		any;
	presbies:	Presbies;
	
	private apollo:	ApolloBase;
	
	QUERY = gql`{ presbies {
		key id isActive last guests guestings hostings seats
		 unknown1 unknown2 email home cell smail city st zip mmail
	}}`;
	
	constructor(private apolloProvider: Apollo) {
		this.env	= environment;
		this.debug	= this.env.debug;
		this.apollo = this.apolloProvider.use('rosterClient');
		this.apollo.watchQuery(
			{query: this.QUERY}
		).valueChanges.subscribe( ret => {
			console.log('>>> PresbyService');
			this.presbies = ret.data['presbies'];
		});
	}
	
	getData() {
		console.log('!!! PresbyService > getData()');
		return this.presbies;
	}
}
