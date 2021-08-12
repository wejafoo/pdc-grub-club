

import { NgModule					} from '@angular/core';
import { CommonModule				} from '@angular/common';
import { FormsModule				} from '@angular/forms';
import { PresbyGuestDetailComponent	} from './presby-guest-detail/presby-guest-detail.component';
import { PresbyHostDetailComponent	} from './presby-host-detail/presby-host-detail.component';
import { PresbyGuestListComponent	} from './presby-guest-list/presby-guest-list.component';
import { PresbyHostListComponent	} from './presby-host-list/presby-host-list.component';
import { PresbyRoutingModule		} from './presby-routing.module';
import { QrCodeModule				} from 'ng-qrcode';


@NgModule({
	imports:		[
		CommonModule,
		FormsModule,
		PresbyRoutingModule,
		QrCodeModule
	],
	declarations:	[
		PresbyGuestListComponent,
		PresbyHostListComponent,
		PresbyGuestDetailComponent,
		PresbyHostDetailComponent
	]
})

export class PresbiesModule {}
