

import { NgModule					} from '@angular/core';
import { CommonModule				} from '@angular/common';
import { AdminComponent				} from './admin/admin.component';
import { AdminDashboardComponent	} from './admin-dashboard/admin-dashboard.component';
import { ManagePlansComponent		} from './manage-plans/manage-plans.component';
import { ManagePresbiesComponent	} from './manage-presbies/manage-presbies.component';
import { AdminRoutingModule			} from './admin-routing.module';


@NgModule({
  imports:		[CommonModule, AdminRoutingModule],
  declarations:	[AdminComponent, AdminDashboardComponent, ManagePlansComponent, ManagePresbiesComponent]
})
export class AdminModule {}
