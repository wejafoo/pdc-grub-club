

import 'angular-server-side-configuration/process';

// V7
import { fire } from './env.stage';

const alias	= process.env.ALIAS	|| 'stage'
const title	= process.env.TITLE	|| 'Default Private Website Title';
const debug	= process.env.DEBUG	|| 'false';
const logs	= process.env.LOGS	|| 'true';
const thisHost	= 'http://localhost:4200/';
const thisMife	= thisHost + '#/';
const authMife	= thisMife;
const authService	= authMife;
const assetsBucket	= 'https://storage.googleapis.com/weja.us';
const cmsService	= 'https://foo.weja.us/cms';

// const rosterService = 'http://localhost:5430/query';
const rosterService	= 'http://localhost:8080/query';

export const environment = {
	production: Boolean(alias	===	'prod'),
	debug: Boolean(debug === 'true'),
	logs: Boolean(logs === 'true'),
	alias,
	local: true,
	remote: false,
	test: false,
	title,
	assets: { bucket: assetsBucket },
	mifen: { this: thisMife, private: thisMife, auth: authMife, register: authMife + 'register' },
	service: { auth: authService, cms: cmsService, roster: rosterService },
	authGuardRemoteFallbackURL:	authMife,
	authGuardRemoteLoggedInURL:	thisMife + 'logout',
	firebase: {
		creds: {
			appId:	fire.APP_ID,
			apiKey:	fire.API_KEY,
			authDomain:	fire.AUTH_DOMAIN,
			databaseURL:	fire.DATABASE_URL,
			messagingSenderId:	fire.MESSAGING_SENDER_ID,
			projectId:	fire.PROJECT_ID,
			storageBucket:	fire.STORAGE_BUCKET
		},
		configs: {
			authGuardFallbackURL:	authMife + 'login',
			authGuardLoggedInURL:	authMife + 'home',
			enableEmailVerification:	true,
			enableFirestoreSync:	true,
			nameMaxLength:	50,
			nameMinLength:	2,
			passwordMaxLength:	60,
			passwordMinLength:	8,
			toastMessageOnAuthSuccess:	false,
			toastMessageOnAuthError:	true,
			guardProtectedRoutesUntilEmailIsVerified: true
		}
	},
	timeZone: 'America/Denver'
};
