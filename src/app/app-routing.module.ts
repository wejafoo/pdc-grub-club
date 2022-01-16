

import { NgModule		 	} from '@angular/core';
import { RouterModule	 	} from '@angular/router';
import { Routes			 	} from '@angular/router';
import { AdminComponent		} from './admin/admin.component';
import { LoginComponent	 	} from './login/login.component';
import { LogoutComponent 	} from './logout/logout.component';
import { MessageComponent	} from './compose-message/compose-message.component';
import { NoSoupComponent 	} from './no-soup/no-soup.component';
import { AuthGuard		 	} from './_guards/auth.guard';

const appRoutes: Routes = [
	{ path: 'plan',		loadChildren: './sub-modules/plan-s/plan.module#PlanModule'		},
	{ path: 'guests',	loadChildren: './sub-modules/presby/presby.module#PresbyModule'	},
	{ path: 'hosts',	loadChildren: './sub-modules/presby/presby.module#PresbyModule'	},
	{ path: 'login',	component: LoginComponent										},
	{ path: 'admin',	component: AdminComponent,	canActivate: [AuthGuard]			},
	{ path: 'logout',	component: LogoutComponent,	canActivate: [AuthGuard]			},
	{ path: 'compose',	component: MessageComponent, outlet: 'popup'					},
	{ path: '',			redirectTo: '/admin', pathMatch: 'full'							},
	{ path: '**',		component: NoSoupComponent										}
]

@NgModule({	imports: [RouterModule.forRoot( appRoutes, { enableTracing: false })], exports: [RouterModule]})
export class AppRoutingModule { }
