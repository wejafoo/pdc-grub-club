

import { NgModule				} from '@angular/core';
import { RouterModule			} from '@angular/router';
import { Routes					} from '@angular/router';
import { EventListComponent		} from './version-s/version/event/event-list/event-list.component';
import { EventDetailComponent	} from './version-s/version/event/event-detail/event-detail.component';
import { EventUpdateComponent	} from './version-s/version/schedule/event-update/event-update.component';
import { PlanDetailComponent	} from './plan-detail/plan-detail.component';
import { PlansComponent			} from './plan-s.component';
import { VersionsComponent		} from './version-s/version-s.component';
import { VersionDetailComponent	} from './version-s/version-detail/version-detail.component';
import { ScheduleComponent	} from './version-s/version/schedule/schedule.component';
import { AuthGuard				} from '../../_guards/auth.guard';
import { CanDeactivateGuard		} from '../../services/can-deactivate.guard';
import { PlanResolver			} from './services/plan-detail-resolver.service';

const planRoutes: Routes = [
	{ path: 'plan', canActivate: [AuthGuard], children: [
		{ path: 's', component: PlansComponent, children: [
			{ path: ':planId', component: PlanDetailComponent }]},
		{ path: ':planId', children: [
			{ path: 'version', children: [
				{ path: 's', component: VersionsComponent, canDeactivate: [CanDeactivateGuard], resolve: { plan: PlanResolver},	children: [
					{ path:	':versionId', component: VersionDetailComponent, canDeactivate: [CanDeactivateGuard], resolve: { plan: PlanResolver }}]},
				{ path: ':versionId', component: ScheduleComponent, canDeactivate: [CanDeactivateGuard], resolve: { plan: PlanResolver },	children: [{path: 'event', children: [
					{ path:	's', component: EventListComponent, canDeactivate: [CanDeactivateGuard], resolve: { plan: PlanResolver },	children: [{ path: ':eventId', component: EventDetailComponent }]},
					{ path:	':eventId', component: EventUpdateComponent, canDeactivate: [CanDeactivateGuard], resolve: { plan: PlanResolver }}]}]}]}]},
		{ path: '', redirectTo: '/plan/s', pathMatch: 'full' }
	]}
]

@NgModule({ imports: [RouterModule.forChild(planRoutes)], exports: [RouterModule]})
export class PlanRoutingModule { }
