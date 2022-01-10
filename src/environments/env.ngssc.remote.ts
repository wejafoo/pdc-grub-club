

import 'angular-server-side-configuration/process';

// V8
import { fire } from './env.stage';

const alias			= process.env.ALIAS			|| 'stage'
const title			= process.env.TITLE			|| 'Default Private Website Title';
const debug			= process.env.DEBUG			|| 'true';
const logs			= process.env.LOGS			|| 'true';
const realmBase		= process.env.REALM_BASE	|| 'https://too.weja.us';
const routeBase		= process.env.ROUTE_BASE	|| '/pdc/';
const thisHost		= realmBase + routeBase;
const thisMife		= thisHost + '#';
const authService	= '/login';
const authMife		= thisMife + authService;
const assetsBucket	= 'https://storage.googleapis.com/weja.us';							// GLOBAL DEFAULTS
const cmsService	= 'https://foo.weja.us/cms';

// const rosterService = 'http://localhost:5430/query';

export const environment = {
	production: Boolean(alias === 'prod'),
	debug: Boolean(debug === 'true'),
	logs: Boolean(logs === 'true'),
	alias,
	local: false,
	remote: true,
	test: false,
	title,
	assets: {bucket: assetsBucket},
	mifen: {this: thisMife, private: thisMife, auth: authMife, register: authMife + 'register'},
	service: {auth: authService, cms: cmsService},	// roster: rosterService
	authGuardRemoteFallbackURL:	authMife,
	authGuardRemoteLoggedInURL:	thisMife,
	firebase: {
		creds: {
			appId:				fire.APP_ID,
			apiKey:				fire.API_KEY,
			authDomain:			fire.AUTH_DOMAIN,
			databaseURL:		fire.DATABASE_URL,
			messagingSenderId:	fire.MESSAGING_SENDER_ID,
			projectId:			fire.PROJECT_ID,
			storageBucket:		fire.STORAGE_BUCKET
		},
		configs: {
			authGuardFallbackURL:		authMife,
			authGuardLoggedInURL:		thisMife + 'home',
			enableEmailVerification:	true,
			enableFirestoreSync:		true,
			nameMaxLength:				50,
			nameMinLength:				2,
			passwordMaxLength:			60,
			passwordMinLength:			8,
			toastMessageOnAuthSuccess:	false,
			toastMessageOnAuthError:	true,
			guardProtectedRoutesUntilEmailIsVerified: true
		},
	},
	timeZone: 'America/Denver'
};
