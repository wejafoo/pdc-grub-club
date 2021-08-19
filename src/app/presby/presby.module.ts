

import { NgModule				} from '@angular/core';
import { CommonModule			} from '@angular/common';
import { FormsModule			} from '@angular/forms';
import { QrCodeModule			} from 'ng-qrcode';
import { GuestDetailComponent	} from './guest/guest-detail/guest-detail.component';
import { GuestListComponent		} from './guest/guest-list/guest-list.component';
import { HostDetailComponent	} from './host/host-detail/host-detail.component';
import { HostListComponent		} from './host/host-list/host-list.component';
import { PresbyRoutingModule	} from './presby-routing.module';
import { MaterialModule			} from '../sub-modules/material.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		MaterialModule,
		PresbyRoutingModule,
		QrCodeModule
	],
	declarations: [
		GuestDetailComponent,
		GuestListComponent,
		HostDetailComponent,
		HostListComponent
	]
})

export class PresbyModule {}


