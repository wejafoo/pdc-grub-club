

import { NgModule					} from '@angular/core';
import { RouterModule				} from '@angular/router';
import { Routes						} from '@angular/router';
import { PlanListComponent			} from './plan-list/plan-list.component';
import { PlanDetailComponent		} from './plan-detail/plan-detail.component';
import { PlanHomeComponent			} from './plan-home/plan-home.component';
import { CanDeactivateGuard			} from '../services/can-deactivate.guard';
import { PlanDetailResolverService	} from './services/plan-detail-resolver.service';

const planRoutes: Routes = [
	{ path: 'plans',	component: PlanListComponent,	children: [{ path: '**', component: PlanHomeComponent }]},
	{ path: 'plan',		component: PlanListComponent,	children: [
		{ path: ':id',	component: PlanDetailComponent, canDeactivate: [CanDeactivateGuard], resolve: {plan: PlanDetailResolverService}},
		{ path: '**',	component: PlanHomeComponent },
	]}
];

@NgModule({ imports: [RouterModule.forChild(planRoutes)], exports: [RouterModule]})
export class PlanRoutingModule { }


