

// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import { getTestBed 					} from '@angular/core/testing';
import { BrowserDynamicTestingModule	} from '@angular/platform-browser-dynamic/testing';
import { platformBrowserDynamicTesting	} from '@angular/platform-browser-dynamic/testing';

import 'zone.js/testing';

declare const require: {
	context( path: string, deep?: boolean, filter?: RegExp ): {
		keys(): string[];
		<T>(id: string): T
	}
};

getTestBed().initTestEnvironment( BrowserDynamicTestingModule, platformBrowserDynamicTesting());						// First, initialize the Angular testing environment.
const context = require.context('./', true, /\.spec\.ts$/);												// Then we find all the tests.
context.keys().map( context );																							// And load the modules.
