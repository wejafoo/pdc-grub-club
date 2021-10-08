

import { NgModule					} from '@angular/core';
import { RouterModule				} from '@angular/router';
import { Routes						} from '@angular/router';
import { ComposeMessageComponent	} from './compose-message/compose-message.component';
import { NoSoupComponent			} from './no-soup/no-soup.component';
import { ContentComponent			} from './content/content.component';

const appRoutes: Routes = [
	{ path: 'compose', component: ComposeMessageComponent, outlet: 'popup'	},
	{ path: 'plans',	redirectTo: '/plan', 	pathMatch: 'full' },
	{ path: 'hosts',	redirectTo: '/host', 	pathMatch: 'full' },
	{ path: 'guests',	redirectTo: '/guest',	pathMatch: 'full' },
	{ path: 'content/:page', component: ContentComponent	},
	{ path: '',			redirectTo: '/guest',	pathMatch: 'full' },
	{ path: '**', component: NoSoupComponent }
];

// { path: 'plan',	loadChildren: './plan/plan.module#PlanModule'		},
// { path: 'host',	loadChildren: './presby/presby.module#PresbyModule'	},
// { path: 'guest',	loadChildren: './presby/presby.module#PresbyModule'	},
// { path: 'plan',	loadChildren: () => import('./plan/plan.module'		).then( m => m.PlanModule	), data: { preload: true }},
// { path: 'host',	loadChildren: () => import('./presby/presby.module'	).then( m => m.PresbyModule	), data: { preload: true }},
// { path: 'guest',	loadChildren: () => import('./presby/presby.module'	).then( m => m.PresbyModule	), data: { preload: true }},

@NgModule({
	imports: [RouterModule.forRoot( appRoutes, { enableTracing: false })],
	exports: [RouterModule]
})

export class AppRoutingModule { }


/*
	imports: [RouterModule.forRoot( appRoutes, { enableTracing: false, preloadingStrategy: SelectivePreloadingStrategyService })],
	import { AuthGuard } from './auth/auth.guard';
	import { SelectivePreloadingStrategyService	} from './services/selective-preloading-strategy.service';
		{ path: 'plan',	redirectTo: '/plan',		pathMatch: 'full' },
		{ path: 'presby',redirectTo: '/presby',		pathMatch: 'full' },
		{ path: 'plan',		loadChildren: () => import('./plan/plan.module').then( m => m.PlanModule), data: { preload: true }},
		{ path: 'admin',	loadChildren: () => import( './admin/admin.module'	).then( m => m.AdminModule	), canLoad: [AuthGuard]},
*/
