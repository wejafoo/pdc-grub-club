

import 'angular-server-side-configuration/process';

// V7
import { fb		} from './fb.stage';
import { remote	} from './remote';
// import { local	} from "./local";

const realmBase		= process.env.REALM_BASE	|| 'https://too.weja.us';
const routeBase		= process.env.ROUTE_BASE	|| '/private-element/';
const privateMife	= process.env.PRIVATE_MIFE	|| realmBase + routeBase + '#/';		// DEFINES THIS MIFE
const thisMife		= privateMife;

const alias			= process.env.ALIAS			|| 'stage'
const title			= process.env.TITLE			|| 'Default Private Website Title';
const debug			= process.env.DEBUG			|| 'true';
const logs			= process.env.LOGS			|| 'true';
const authMife		= process.env.AUTH_MIFE		|| remote.default.AUTH_MIFE;
const chatMife		= process.env.CHAT_MIFE		|| remote.default.CHAT_MIFE;
const formMife		= process.env.FORM_MIFE		|| remote.default.FORM_MIFE;
const publicMife	= process.env.PUBLIC_MIFE	|| remote.default.PUBLIC_MIFE;
const authService	= process.env.AUTH_SERVICE	|| remote.default.AUTH_SERVICE;

const assetsBucket	= 'https://storage.googleapis.com/weja.us';							// GLOBAL DEFAULTS
const cmsSheet		= 'https://docs.google.com/spreadsheets/d/14T-GM6Cx-OpT_s4MCytc1VL8fQax8eOC8IHdne-1Wf4/edit#gid=1055269632';
const cmsAlias		= 'stage-EN_US';
const cmsService	= 'https://foo.weja.us/cms';										// const cmsService	= 'http://localhost:5430/query';
// const rosterService = 'http://localhost:5430/query';
// const rosterService = 'https://graphql--micro-server-go-graphql--weja-us--stage-rztmaxtwva-uc.a.run.app//query';
const rosterService	= 'https://foo.weja.us/api/pdc/query';

export const environment = {
	production: Boolean(alias	=== 'prod'),
	debug:		Boolean(debug	=== 'true'),
	logs:		Boolean(logs	=== 'true'),
	alias,
	local:		false,
	remote:		true,
	title,
	assets: { bucket: assetsBucket },
	mife: {
		this:		thisMife,
		private:	thisMife,
		auth:		authMife,
		chat:		chatMife,
		form:		formMife,
		public:		publicMife,
		register:	authMife + 'register'
	},
	service: {
		auth:		authService,
		cms:		cmsService,
		roster:		rosterService
	},
	cms: {
		service:	cmsService,
		sheet:		cmsSheet,
		alias:		cmsAlias
	},
	authGuardRemoteFallbackURL:	authMife + 'login',
	authGuardRemoteLoggedInURL:	authMife + 'home',
	firebase: {
		creds: {
			appId:				fb.APP_ID,
			apiKey:				fb.API_KEY,
			authDomain:			fb.AUTH_DOMAIN,
			databaseURL:		fb.DATABASE_URL,
			measurementId:		fb.GA4_MID,
			messagingSenderId:	fb.MESSAGING_SENDER_ID,
			projectId:			fb.PROJECT_ID,
			storageBucket:		fb.STORAGE_BUCKET,
		},
		configs: {
			authGuardFallbackURL:		authMife + 'login',
			authGuardLoggedInURL:		authMife + 'home',
			enableEmailVerification:	true,
			enableFirestoreSync:		true,
			nameMaxLength:				50,
			nameMinLength:				2,
			passwordMaxLength:			60,
			passwordMinLength:			8,
			toastMessageOnAuthSuccess:	false,
			toastMessageOnAuthError:	true,
			guardProtectedRoutesUntilEmailIsVerified:	true,
		},
	},
	google: { analytics: { trackingCode: fb.GA4_MID }},
	timeZone: 'America/Denver'
};

// import 'zone.js/plugins/zone-error';
