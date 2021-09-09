

import { NgModule					} from '@angular/core';
import { RouterModule				} from '@angular/router';
import { Routes						} from '@angular/router';
import { CanDeactivateGuard			} from '../services/can-deactivate.guard';
import { EventListComponent			} from './list/version-list/event/event-list.component';
import { VersionListComponent		} from './list/version-list/version-list.component';
import { VersionUpdateComponent		} from './update/version/version-update/version-update.component';
import { EventUpdateComponent		} from './update/version/version-update/event-update/event-update.component';
import { PlanDetailComponent		} from './list/plan-detail/plan-detail.component';
import { PlanDetailResolverService	} from './services/plan-detail-resolver.service';
import { PlanListComponent			} from './list/plan-list.component';
import { PlanUpdateComponent		} from './update/plan-update.component';
import { VersionDetailComponent		} from './update/version/version-detail/version-detail.component';

const planRoutes: Routes = [
	{ path: 'plan/:planId/version/:versionId/event/:eventId/update',	component: EventUpdateComponent,	canDeactivate: [CanDeactivateGuard], resolve: {plan: PlanDetailResolverService}},
	{ path: 'plan/:planId/version/:versionId/event/:eventId',	component: EventListComponent,		canDeactivate: [CanDeactivateGuard], resolve: {plan: PlanDetailResolverService}},
	{ path: 'plan/:planId/version/:versionId/update',	component: VersionUpdateComponent,	canDeactivate: [CanDeactivateGuard], resolve: {plan: PlanDetailResolverService}},
	{ path: 'plan/:planId/update/version',		component: PlanUpdateComponent, 	canDeactivate: [CanDeactivateGuard], resolve: {plan: PlanDetailResolverService},
		children: [{ path: ':versionId', component: VersionDetailComponent	}]
	},
	{ path: 'plan/:planId/update',	component: PlanUpdateComponent,		canDeactivate: [CanDeactivateGuard], resolve: {plan: PlanDetailResolverService}},
	{ path: 'plan/:planId/version',	component: VersionListComponent,	children: [{ path: ':versionId',	component: VersionDetailComponent	}]},
	{ path: 'plan',					component: PlanListComponent,		children: [{ path: ':planId',		component: PlanDetailComponent 		}]}
];
// { path: 'plan/:planId/version/:versionId', component: VersionDetailComponent }, // children: [], canDeactivate: [CanDeactivateGuard], resolve: { plan: PlanDetailResolverService}

@NgModule({ imports: [RouterModule.forChild(planRoutes)], exports: [RouterModule]})
export class PlanRoutingModule { }

