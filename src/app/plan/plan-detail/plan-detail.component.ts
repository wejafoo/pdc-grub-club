

import { environment	} from '../../../environments/environment';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router			} from '@angular/router';
import { Observable		} from 'rxjs';
import { Plan			} from '../models/plan';
import { DialogService	} from '../../services/dialog.service';

@Component({
	selector: 'app-plan-detail',
	templateUrl: './plan-detail.component.html',
	styleUrls: ['./plan-detail.component.sass']
})

export class PlanDetailComponent implements OnInit {
	env:	any;
	debug:	boolean;
	plan!:	Plan;
	editName = '';
	
	constructor (
		private	route:			ActivatedRoute,
		private	router:			Router,
		public	dialogService:	DialogService
	) {
		this.env	= environment;
		this.debug	= this.env.debug;
	}
	
	ngOnInit() {
		this.route.data.subscribe(data => {
			const plan: Plan	= data.plan;
			this.editName		= plan.name;
			this.plan			= plan;
		})
	}
	
	save() {
		this.plan.name = this.editName;
		this.gotoPlans()
	}
	
	cancel() { this.gotoPlans() }
	
	canDeactivate(): Observable<boolean> | boolean {																	// Synchronous navigation if plan is unchanged, otherwise ask user to discard
		if ( this.debug ) console.log( 'Current plan =>' + JSON.stringify( this.plan ) + '<' );
		if ( ! this.plan || this.plan.name === this.editName ) return true;
		return this.dialogService.confirm( 'Unsaved changes found, continue anyway?' )
	}
	
	gotoPlans() { this.router.navigate(['/plans']).then( r => {
		if ( this.debug ) console.log( 'Navigating from plan-details->gotoPlans():', r )
	})}
}


// Pass along the plan id if available so that the PlanListComponent can select that plan.
// const planId = this.plan ? this.plan.id : null;
// this.router.navigate(['../', {id: planId, foo: 'foo'}], {relativeTo: this.route}).then( r => console.log( r ));
