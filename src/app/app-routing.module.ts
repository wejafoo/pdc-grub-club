

import { NgModule					} from '@angular/core';
import { RouterModule				} from '@angular/router';
import { Routes						} from '@angular/router';
import { ComposeMessageComponent	} from './compose-message/compose-message.component';
import { PageNotFoundComponent		} from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
	{ path: 'compose',	component: ComposeMessageComponent,	outlet: 'popup'	},
	{ path: 'plans',	redirectTo: '/plans',		pathMatch: 'full'		},
	{ path: 'plan',		redirectTo: '/plan',		pathMatch: 'full'		},
	{ path: 'hosts',	redirectTo: '/hosts',		pathMatch: 'full'		},
	{ path: '',			redirectTo: '/presbies',	pathMatch: 'full'		},
	{ path: '**',		component: PageNotFoundComponent					}
];

@NgModule({
	imports: [RouterModule.forRoot( appRoutes, { enableTracing: false })],
	exports: [RouterModule]
})

export class AppRoutingModule { }


// imports: [RouterModule.forRoot( appRoutes, { enableTracing: false, preloadingStrategy: SelectivePreloadingStrategyService })],
// import { SelectivePreloadingStrategyService	} from './services/selective-preloading-strategy.service';
// 	{ path: 'plan',	loadChildren: () => import('./plan/plan.module').then( m => m.PlanModule), data: { preload: true }},
// 	{ path: 'plans', loadChildren: './plan/plan.module' },
// import { AuthGuard							} from './auth/auth.guard';
// { path: 'admin',	loadChildren: () => import( './admin/admin.module'	).then( m => m.AdminModule	), canLoad: [AuthGuard]},
