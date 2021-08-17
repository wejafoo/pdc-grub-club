

import { NgModule					} from '@angular/core';
import { CommonModule				} from '@angular/common';
import { FormsModule				} from '@angular/forms';
import { EventDetailComponent		} from './event/event-detail/event-detail.component';
import { EventUpdateComponent	} from './plan-update/event-update/event-update.component';
import { EventListComponent			} from './event/event-list/event-list.component';
import { EventHomeComponent			} from './event/event-home/event-home.component';
import { PlanDetailComponent		} from './plan-detail/plan-detail.component';
import { PlanUpdateComponent		} from './plan-update/plan-update.component';
import { PlanListComponent			} from './plan-list/plan-list.component';
import { PlanHomeComponent			} from './plan-home/plan-home.component';
import { PlanRoutingModule			} from './plan-routing.module';
import { MaterialModule				} from '../sub-modules/material.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		MaterialModule,
		PlanRoutingModule
	],
	declarations: [
		EventDetailComponent,
		EventUpdateComponent,
		EventHomeComponent,
		EventListComponent,
		PlanHomeComponent,
		PlanListComponent,
		PlanDetailComponent,
		PlanUpdateComponent
	]
})

export class PlanModule {}
