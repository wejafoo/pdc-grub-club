

import { NgModule				} from '@angular/core';
import { RouterModule			} from '@angular/router';
import { Routes					} from '@angular/router';
import { GuestDetailComponent	} from './guest/list/detail/guest-detail.component';
import { GuestListComponent		} from './guest/list/guest-list.component';
import { HostDetailComponent	} from './host/list/detail/host-detail.component';
import { HostListComponent		} from './host/list/host-list.component';

const presbyRoutes: Routes = [
	{ path: 'guest/:guestId',	component: GuestDetailComponent	},
	{ path: 'guest',			component: GuestListComponent	},
	{ path: 'host/:hostId',		component: HostDetailComponent	},
	{ path: 'host',				component: HostListComponent	}
];

@NgModule({ imports: [RouterModule.forChild(presbyRoutes)], exports: [RouterModule]})
export class PresbyRoutingModule { }


/*	{ path: 'guest/:guestId',	component: GuestDetailComponent,	data: {animation: 'heroes'}},
	{ path: 'guests',			component: GuestListComponent,		data: {animation: 'heroes'}},
	{ path: 'host/:hostId',		component: HostDetailComponent,		data: {animation: 'heroes'}},
	{ path: 'hosts',			component: HostListComponent,		data: {animation: 'heroes'}},*/
