

import { Injectable	} from '@angular/core';
import { Apollo		} from 'apollo-angular';
import { ApolloBase	} from 'apollo-angular';
import { gql		} from 'apollo-angular';
import { Presbies	} from '../../../../../.ARCHIVE/models/plan';

@Injectable({ providedIn: 'root' })
export class PresbyService {
	presbies: Presbies;
	private apollo:	ApolloBase;
	QUERY = gql`{ presbies { key id isActive last guests guestings hostings seats unknown1 unknown2 email home cell smail city st zip mmail }}`;
	
	constructor( private apolloProvider: Apollo ) {
		this.apollo = this.apolloProvider.use('newClientName');
		this.apollo.watchQuery({ query: this.QUERY }).valueChanges.subscribe( ret => this.presbies = ret.data['presbies'])
	}
	
	getData() { return this.presbies }
}
	// import { Observable } from 'rxjs';
	// console.log( 'LOADING PRESBIES', typeof this.presbies, this.presbies );
	// if ( this.presbies === undefined ) {
	// 	return this.presbies;
	// } else {
	// 	const stream = Observable.create( observer => {
	// 		observer.next(this.presbies);
	// 		observer.complete();
	// 	})
	// 	stream.subscribe(data => console.log(data))
	// 	return stream;
	// }
