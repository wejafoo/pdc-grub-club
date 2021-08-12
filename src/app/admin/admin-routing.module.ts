

import { NgModule					} from '@angular/core';
import { RouterModule				} from '@angular/router';
import { Routes						} from '@angular/router';
import { AdminComponent				} from './admin/admin.component';
import { AdminDashboardComponent	} from './admin-dashboard/admin-dashboard.component';
import { ManagePlansComponent		} from './manage-plans/manage-plans.component';
import { ManagePresbiesComponent	} from './manage-presbies/manage-presbies.component';
import { AuthGuard					} from '../auth/services/auth.guard';

const adminRoutes: Routes = [
	{ path: '', component: AdminComponent, canActivate: [AuthGuard], children: [
		{ path: '', canActivateChild: [AuthGuard], children: [
				{ path: 'plans',	component: ManagePlansComponent	},
				{ path: 'presbies',	component: ManagePresbiesComponent	},
				{ path: '',			component: AdminDashboardComponent	}
		]}
	]}
];


@NgModule({ imports: [RouterModule.forChild(adminRoutes)], exports: [RouterModule]})
export class AdminRoutingModule {}
