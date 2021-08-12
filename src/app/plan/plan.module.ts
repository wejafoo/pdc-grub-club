

import { NgModule					} from '@angular/core';
import { CommonModule				} from '@angular/common';
import { FormsModule				} from '@angular/forms';
import { PlanDetailComponent		} from './plan-detail/plan-detail.component';
import { PlanListComponent			} from './plan-list/plan-list.component';
import { PlanHomeComponent			} from './plan-home/plan-home.component';
import { PlanRoutingModule			} from './plan-routing.module';

@NgModule({
	imports: [CommonModule, FormsModule, PlanRoutingModule],
	declarations: [PlanListComponent, PlanHomeComponent, PlanDetailComponent]
})
export class PlanModule {}
