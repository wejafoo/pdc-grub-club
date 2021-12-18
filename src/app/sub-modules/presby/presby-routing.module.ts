

import { NgModule		} from '@angular/core';
import { RouterModule	} from '@angular/router';
import { Routes			} from '@angular/router';

import { GuestDetailComponent	} from './guest-detail/guest-detail.component';
import { GuestListComponent		} from './guest-list/guest-list.component';
import { HostDetailComponent	} from './host-detail/host-detail.component';
import { HostListComponent		} from './host-list/host-list.component';
import { AuthGuard				} from '../../_guards/auth.guard';

const presbyRoutes: Routes = [
	{ path: 'guest/:guestId',	component: GuestDetailComponent,	canActivate: [AuthGuard]},
	{ path: 'host/:hostId', 	component: HostDetailComponent,		canActivate: [AuthGuard]},
	{ path: 'guests',			component: GuestListComponent,		canActivate: [AuthGuard]},
	{ path: 'hosts',			component: HostListComponent,		canActivate: [AuthGuard]}
];

@NgModule({ imports: [RouterModule.forChild(presbyRoutes)], exports: [RouterModule]})
export class PresbyRoutingModule { }
