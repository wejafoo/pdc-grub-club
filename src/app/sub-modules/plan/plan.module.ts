

import { NgModule				} from '@angular/core';
import { CommonModule			} from '@angular/common';
import { FormsModule			} from '@angular/forms';
import { EventDetailComponent	} from './version/event/event-detail/event-detail.component';
import { EventListComponent		} from './version/event/event-list/event-list.component';
import { VersionListComponent	} from './version/version-list/version-list.component';
import { VersionUpdateComponent	} from './version/version-update/version-update.component';
import { EventUpdateComponent	} from './version/version-update/event-update/event-update.component';
import { PlanDetailComponent	} from './plan-detail/plan-detail.component';
import { PlanUpdateComponent	} from './plan-update/plan-update.component';
import { PlanListComponent		} from './plan-list/plan-list.component';
import { PlanRoutingModule		} from './plan-routing.module';
import { MaterialModule			} from '../material.module';
import { VersionDetailComponent	} from './version/version-detail/version-detail.component';
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
		PlanListComponent,
		PlanUpdateComponent,
		VersionDetailComponent,
		VersionListComponent,
		OrderByPipe
	]
})

export class PlanModule {}
