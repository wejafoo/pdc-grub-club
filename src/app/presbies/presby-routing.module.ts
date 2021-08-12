

import { NgModule					} from '@angular/core';
import { RouterModule				} from '@angular/router';
import { Routes						} from '@angular/router';
import { PresbyGuestListComponent	} from './presby-guest-list/presby-guest-list.component';
import { PresbyGuestDetailComponent	} from './presby-guest-detail/presby-guest-detail.component';
import { PresbyHostDetailComponent	} from './presby-host-detail/presby-host-detail.component';
import { PresbyHostListComponent	} from './presby-host-list/presby-host-list.component';

const presbyRoutes: Routes = [
	{ path: 'presbies',		component: PresbyGuestListComponent,	data: {animation: 'heroes'}},
	{ path: 'hosts',		component: PresbyHostListComponent,		data: {animation: 'heroes'}},
	{ path: 'presby/:id',	component: PresbyGuestDetailComponent,	data: {animation: 'heroes'}},
	{ path: 'host/:id',		component: PresbyHostDetailComponent,	data: {animation: 'heroes'}}
];

@NgModule({ imports: [RouterModule.forChild(presbyRoutes)], exports: [RouterModule]})
export class PresbyRoutingModule { }


/*
		{ path: 'presbies',		component: PresbyGuestListComponent		},
	{ path: 'hosts',		component: PresbyHostListComponent		},
	{ path: 'presby/:id',	component: PresbyGuestDetailComponent	},
	{ path: 'host/:id',		component: PresbyHostDetailComponent	}
 */
