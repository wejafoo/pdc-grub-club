

import { NgModule				} from '@angular/core';
import { CommonModule			} from '@angular/common';
import { FormsModule			} from '@angular/forms';
import { GuestDetailComponent	} from './guests/guest-detail/guest-detail.component';
import { GuestListComponent		} from './guests/guest-list/guest-list.component';
import { HostDetailComponent	} from './hosts/host-detail/host-detail.component';
import { HostListComponent		} from './hosts/host-list/host-list.component';
import { PresbyRoutingModule	} from './presby-routing.module';
import { MaterialModule			} from '../material.module';

@NgModule({
	imports: [CommonModule, FormsModule, MaterialModule, PresbyRoutingModule],
	declarations: [GuestDetailComponent, GuestListComponent, HostDetailComponent, HostListComponent]
})
export class PresbyModule{}


