

import { NgModule		} from '@angular/core';
import { RouterModule	} from '@angular/router';
import { Routes			} from '@angular/router';

import { GuestDetailComponent	} from './guests/guest-detail/guest-detail.component';
import { GuestListComponent		} from './guests/guest-list/guest-list.component';
import { HostDetailComponent	} from './hosts/host-detail/host-detail.component';
import { HostListComponent		} from './hosts/host-list/host-list.component';
import { AuthGuard				} from '../../_guards/auth.guard';

const presbyRoutes: Routes = [
	{ path: 'guest/:guestId',	component: GuestDetailComponent,	canActivate: [AuthGuard]},
	{ path: 'host/:hostId', 	component: HostDetailComponent,		canActivate: [AuthGuard]},
	{ path: 'guests',			component: GuestListComponent,		canActivate: [AuthGuard]},
	{ path: 'hosts',			component: HostListComponent,		canActivate: [AuthGuard]}
];

@NgModule({ imports: [RouterModule.forChild(presbyRoutes)], exports: [RouterModule]})
export class PresbyRoutingModule { }
