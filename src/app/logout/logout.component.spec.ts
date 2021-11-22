

import { waitForAsync		} from '@angular/core/testing';
import { ComponentFixture	} from '@angular/core/testing';
import { TestBed			} from '@angular/core/testing';
import { LogoutComponent	} from './logout.component';

describe('HomeComponent', () => {
	let component:	LogoutComponent;
	let fixture:	ComponentFixture<LogoutComponent>;
	beforeEach( waitForAsync(() => TestBed.configureTestingModule({ declarations: [LogoutComponent]}).compileComponents()));
	beforeEach(() => {
		fixture		= TestBed.createComponent( LogoutComponent );
		component	= fixture.componentInstance;
		fixture.detectChanges()
	});
	it('should create', () => expect( component ).toBeTruthy())
});
