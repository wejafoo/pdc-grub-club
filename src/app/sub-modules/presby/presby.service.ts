

import { Injectable	} from '@angular/core';
import { Apollo		} from 'apollo-angular';
import { ApolloBase	} from 'apollo-angular';
import { gql		} from 'apollo-angular';
import { Presbies	} from '../../../../.ARCHIVE/models/plan';

@Injectable({ providedIn: 'root' })
export class PresbyService {
	presbies: Presbies;
	private apollo:	ApolloBase;
	
	QUERY = gql`{ presbies {
		key id isActive last guests guestings hostings seats unknown1 unknown2 email home cell smail city st zip mmail
	}}`;
	
	constructor(private apolloProvider: Apollo) {
		this.apollo = this.apolloProvider.use('newClientName');
		this.apollo.watchQuery({ query: this.QUERY }).valueChanges.subscribe( ret => {
			console.log('!!! PresbyService')
			this.presbies = ret.data['presbies'];
		})
	}
	
	getData() { return this.presbies }
}
