

import { NgModule				} from '@angular/core';
import { CommonModule			} from '@angular/common';
import { FormsModule			} from '@angular/forms';
import { GuestDetailComponent	} from './guest-detail/guest-detail.component';
import { GuestListComponent		} from './guest-list/guest-list.component';
import { HostDetailComponent	} from './host-detail/host-detail.component';
import { HostListComponent		} from './host-list/host-list.component';
import { PresbyRoutingModule	} from './presby-routing.module';
import { MaterialModule			} from '../material.module';

@NgModule({
	imports: [CommonModule, FormsModule, MaterialModule, PresbyRoutingModule],
	declarations: [GuestDetailComponent, GuestListComponent, HostDetailComponent, HostListComponent]
})
export class PresbyModule{}


