

import { NgModule				} from '@angular/core';
import { RouterModule			} from '@angular/router';
import { Routes					} from '@angular/router';
import { EventListComponent		} from './version/event/event-list/event-list.component';
import { EventDetailComponent	} from './version/event/event-detail/event-detail.component';
import { EventUpdateComponent	} from './version/version-update/event-update/event-update.component';
import { PlanDetailComponent	} from './plan-detail/plan-detail.component';
import { PlanListComponent		} from './plan-list/plan-list.component';
import { PlanUpdateComponent	} from './plan-update/plan-update.component';
import { VersionDetailComponent	} from './version/version-detail/version-detail.component';
import { VersionUpdateComponent	} from './version/version-update/version-update.component';
import { AuthGuard				} from '../../_guards/auth.guard';
import { CanDeactivateGuard		} from '../../services/can-deactivate.guard';
import { PlanResolver			} from './services/plan-detail-resolver.service';

const planRoutes: Routes = [
	{ path: 'plan', canActivate: [AuthGuard], children: [
		{ path: 's', component: PlanListComponent, children: [
			{ path: ':planId', component: PlanDetailComponent }]},
		{ path: ':planId', children: [
			{ path: 'version', children: [
				{ path: 's', component: PlanUpdateComponent, canDeactivate: [CanDeactivateGuard], resolve: { plan: PlanResolver},	children: [
					{ path:	':versionId', component: VersionDetailComponent, canDeactivate: [CanDeactivateGuard], resolve: { plan: PlanResolver }}]},
				{ path: ':versionId', component: VersionUpdateComponent, canDeactivate: [CanDeactivateGuard], resolve: { plan: PlanResolver },	children: [{path: 'event', children: [
					{ path:	's', component: EventListComponent, canDeactivate: [CanDeactivateGuard], resolve: { plan: PlanResolver },	children: [{ path: ':eventId', component: EventDetailComponent }]},
					{ path:	':eventId', component: EventUpdateComponent, canDeactivate: [CanDeactivateGuard], resolve: { plan: PlanResolver }}]}]}]}]},
		{ path: '', redirectTo: '/plan/s', pathMatch: 'full' }
	]}
]

@NgModule({ imports: [RouterModule.forChild(planRoutes)], exports: [RouterModule]})
export class PlanRoutingModule { }

// import{NoSoupComponent}from'../../no-soup/no-soup.component'
// import{VersionListComponent}from'./version/version-list/version-list.component'
// import {PlanUpdateComponent}from'./plan-update/plan-update.component'
// {path:'plan/list',component:PlanListComponent,children:[{path:':planId',component:PlanDetailComponent}]},
// {path:'plan/:planId/plan-update',component:PlanUpdateComponent,canDeactivate:[CanDeactivateGuard],resolve:{plan:PlanResolver}},
// {path:'plan/:planId/version/:versionId/plan-update',component:VersionUpdateComponent,canDeactivate:[CanDeactivateGuard],resolve:{plan:PlanResolver}},
