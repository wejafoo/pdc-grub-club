

import { Injectable		} from '@angular/core';
import { Query			} from 'apollo-angular';
import { gql			} from 'apollo-angular';
import { PresbyQuery	} from '../../../../.ARCHIVE/models/plan';

@Injectable({ providedIn: 'root' })
export class PresbyService extends Query<PresbyQuery> {
	document = gql`
		{ presbies { id isActive last guests guestings hostings seats unknown1 unknown2 email home cell smail city st zip mmail }}
	`
}
