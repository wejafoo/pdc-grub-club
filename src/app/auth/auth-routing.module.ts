

import { NgModule		} from '@angular/core';
import { RouterModule	} from '@angular/router';
import { Routes			} from '@angular/router';
import { LoginComponent } from './login/login.component';

// import { AuthGuard } from './services/auth.guard';
// import { AuthService } from './services/auth.service';

const authRoutes: Routes = [{ path: 'login', component: LoginComponent }];

@NgModule({ imports: [RouterModule.forChild(authRoutes)], exports: [RouterModule]})
export class AuthRoutingModule {}
