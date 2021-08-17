

import { NgModule					} from '@angular/core';
import { CommonModule				} from '@angular/common';
import { MatButtonModule			} from '@angular/material/button';
import { MatButtonToggleModule		} from '@angular/material/button-toggle';
import { MatCardModule				} from '@angular/material/card';
import { MatCheckboxModule			} from '@angular/material/checkbox';
import { MatIconModule				} from '@angular/material/icon';
import { MatInputModule				} from '@angular/material/input';
import { MatMenuModule				} from '@angular/material/menu';
import { MatProgressBarModule		} from '@angular/material/progress-bar';
import { MatProgressSpinnerModule	} from '@angular/material/progress-spinner';
import { MatRippleModule			} from '@angular/material/core';
import { MatSidenavModule			} from '@angular/material/sidenav';
import { MatTreeModule				} from '@angular/material/tree';
import { MatToolbarModule			} from '@angular/material/toolbar';

@NgModule({
	imports: [
		CommonModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatCardModule,
		MatCheckboxModule,
		MatIconModule,
		MatInputModule,
		MatMenuModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatRippleModule,
		MatSidenavModule,
		MatToolbarModule,
		MatTreeModule,
	],
	exports: [
		MatButtonModule,
		MatButtonToggleModule,
		MatCardModule,
		MatCheckboxModule,
		MatIconModule,
		MatInputModule,
		MatProgressSpinnerModule,
		MatMenuModule,
		MatProgressBarModule,
		MatRippleModule,
		MatSidenavModule,
		MatToolbarModule,
		MatTreeModule,
	]
})

export class MaterialModule {}
