

import { Injectable		} from '@angular/core';
import { Query			} from 'apollo-angular';
import { gql			} from 'apollo-angular';
import { PresbyQuery	} from '../../../../.ARCHIVE/models/plan';

@Injectable({ providedIn: 'root' })

export class PresbyService extends Query<PresbyQuery> {
	document = gql`{presbies{key id isActive last guests guestings{event seats key} hostings{event seats key} seats U S email home cell smail city st zip mmail}}`
}
