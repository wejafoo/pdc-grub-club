

import { NgModule					} from '@angular/core';
import { RouterModule				} from '@angular/router';
import { Routes						} from '@angular/router';
import { CanDeactivateGuard			} from '../services/can-deactivate.guard';
import { EventUpdateComponent		} from './plan-update/event-update/event-update.component';
import { PlanDetailComponent		} from './plan-detail/plan-detail.component';
import { PlanDetailResolverService	} from './services/plan-detail-resolver.service';
import { PlanListComponent			} from './plan-list/plan-list.component';
import { PlanUpdateComponent		} from './plan-update/plan-update.component';

const planRoutes: Routes = [
	{ path: 'plan/:planId/update/event/:eventId/update',	component: EventUpdateComponent,	canDeactivate: [CanDeactivateGuard], resolve: {plan: PlanDetailResolverService}},
	{ path: 'plan/:planId/update/event/:eventId',			component: PlanUpdateComponent,		canDeactivate: [CanDeactivateGuard], resolve: {plan: PlanDetailResolverService}},
	{ path: 'plan/:planId/update',							component: PlanUpdateComponent,		canDeactivate: [CanDeactivateGuard], resolve: {plan: PlanDetailResolverService}},
	{ path: 'plan',											component: PlanListComponent, 		children: [{ path: ':planId', component: PlanDetailComponent}]}
];

@NgModule({ imports: [RouterModule.forChild(planRoutes)], exports: [RouterModule]})
export class PlanRoutingModule { }

