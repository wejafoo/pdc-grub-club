

import { NgModule				} from '@angular/core';
import { CommonModule			} from '@angular/common';
import { FormsModule			} from '@angular/forms';
import { EventDetailComponent	} from './list/version-list/event/event-detail/event-detail.component';
import { EventListComponent		} from './list/version-list/event/event-list.component';
import { VersionListComponent	} from './list/version-list/version-list.component';
import { VersionUpdateComponent	} from './update/version/version-update/version-update.component';
import { EventUpdateComponent	} from './update/version/version-update/event-update/event-update.component';
import { PlanDetailComponent	} from './list/plan-detail/plan-detail.component';
import { PlanUpdateComponent	} from './update/plan-update.component';
import { PlanListComponent		} from './list/plan-list.component';
import { PlanHomeComponent		} from './list/plan-home/plan-home.component';
import { PlanRoutingModule		} from './plan-routing.module';
import { MaterialModule			} from '../sub-modules/material.module';
import { VersionDetailComponent	} from './update/version/version-detail/version-detail.component';
import { OrderByPipe 			} from './services/order-by.pipe';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		MaterialModule,
		PlanRoutingModule
	],
	declarations: [
		EventDetailComponent,
		EventListComponent,
		VersionUpdateComponent,
		EventUpdateComponent,
		PlanDetailComponent,
		PlanHomeComponent,
		PlanListComponent,
		PlanUpdateComponent,
		VersionDetailComponent,
		VersionListComponent,
		OrderByPipe
	]
})

export class PlanModule {}
