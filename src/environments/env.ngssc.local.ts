
// V8
import 'angular-server-side-configuration/process';
import { fire } from './env.stage';

const alias			= process.env.ALIAS				|| 'stage'
const title			= process.env.TITLE				|| 'Default Private Website Title';
const debug			= process.env.DEBUG				|| 'true';
const logs			= process.env.LOGS				|| 'true';
const realmBase		= process.env.REALM_BASE		|| 'http://localhost';
const routeBase		= process.env.TARGET_LOCAL_PORT	|| ':7777/';
const thisHost		= realmBase + routeBase;
const thisMife		= thisHost + '#/';
const authMife		= thisMife;
const authService	= 'login';
const assetsBucket	= 'https://storage.googleapis.com/weja.us';		// GLOBAL DEFAULTS
const cmsService	= 'https://foo.weja.us/cms';
// const rosterService = 'http://localhost:5430/query';

export const environment = {
	production:	Boolean(alias === 'prod'),
	debug:		Boolean(debug === 'true'),
	logs:		Boolean(logs === 'true'),
	alias,
	local:	true,
	remote:	false,
	test:	false,
	assets:	{bucket: assetsBucket},
	authGuardRemoteFallbackURL:	authMife + 'login',
	authGuardRemoteLoggedInURL:	thisMife + 'logout',
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
			authGuardFallbackURL:		authMife + 'login',
			authGuardLoggedInURL:		authMife + 'home',
			enableEmailVerification:	true,
			enableFirestoreSync:		true,
			guardProtectedRoutesUntilEmailIsVerified: true,
			nameMaxLength:				50,
			nameMinLength:				2,
			passwordMaxLength:			60,
			passwordMinLength:			8,
			toastMessageOnAuthSuccess:	false,
			toastMessageOnAuthError:	true
		}
	},
	mifen:		{this: thisMife, private: thisMife, auth: authMife, register: authMife + 'register'},
	service: 	{auth: authService, cms: cmsService},	// roster: rosterService
	timeZone:	'America/Denver',
	title
};
