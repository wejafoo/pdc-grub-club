

import { NgModule				} from '@angular/core';
import { CommonModule			} from '@angular/common';
import { FormsModule			} from '@angular/forms';
import { MatDialogModule		} from '@angular/material/dialog';
import { EventDetailComponent	} from './version-s/version/event/event-detail/event-detail.component';
import { EventListComponent		} from './version-s/version/event/event-list/event-list.component';
import { ScheduleComponent		} from './version-s/version/schedule/schedule.component';
import { EventUpdateComponent	} from './version-s/version/schedule/event-update/event-update.component';
import { PlanDetailComponent	} from './plan-detail/plan-detail.component';
import { VersionsComponent		} from './version-s/version-s.component';
import { PlansComponent			} from './plan-s.component';
import { PlanRoutingModule		} from './plan-routing.module';
import { MaterialModule			} from '../material.module';
import { VersionDetailComponent	} from './version-s/version-detail/version-detail.component';
import { VersionListComponent	} from './version-s/version/version-list/version-list.component';
import { OrderByPipe 			} from './services/order-by.pipe';
import { DialogContentComponent	} from './version-s/version/schedule/schedule.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		MaterialModule,
		PlanRoutingModule,
		MatDialogModule
	],
	declarations: [
		DialogContentComponent,
		EventDetailComponent,
		EventListComponent,
		EventUpdateComponent,
		PlanDetailComponent,
		PlansComponent,
		ScheduleComponent,
		VersionsComponent,
		VersionDetailComponent,
		VersionListComponent,
		OrderByPipe
	]
})

export class PlanModule {}
