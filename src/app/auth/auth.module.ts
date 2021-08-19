

import { NgModule			} from '@angular/core';
import { CommonModule		} from '@angular/common';
import { FormsModule		} from '@angular/forms';
import { LoginComponent		} from './login/login.component';
import { AuthRoutingModule	} from './auth-routing.module';
import { MaterialModule			} from '../sub-modules/material.module';

@NgModule({ imports: [CommonModule, FormsModule, MaterialModule, AuthRoutingModule], declarations: [LoginComponent]})
export class AuthModule {}
