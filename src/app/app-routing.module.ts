

import { NgModule					} from '@angular/core';
import { RouterModule				} from '@angular/router';
import { Routes						} from '@angular/router';
import { AuthGuard					} from './_guards/auth.guard';
import { ComposeMessageComponent	} from './compose-message/compose-message.component';
import { NoSoupComponent			} from './no-soup/no-soup.component';
import { LoginComponent				} from './login/login.component';
import { LogoutComponent			} from './logout/logout.component';

const appRoutes: Routes = [
	{ path: 'logout',	component: LogoutComponent, canActivate: [AuthGuard]},
	{ path: 'login',	component: LoginComponent							},
	{ path: 'compose',	component: ComposeMessageComponent,	outlet: 'popup'	},
	{ path: 'plans',	redirectTo: '/plan', 	pathMatch: 'full'			},
	{ path: 'hosts',	redirectTo: '/host', 	pathMatch: 'full'			},
	{ path: 'guests',	redirectTo: '/guest',	pathMatch: 'full'			},
	{ path: '',			redirectTo: '/plan',	pathMatch: 'full'			},
	{ path: '**',		component: NoSoupComponent							}
];

@NgModule({
	imports: [RouterModule.forRoot( appRoutes, { enableTracing: false })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
