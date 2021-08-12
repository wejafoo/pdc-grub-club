

import 'angular-server-side-configuration/process';

// V7
import { fb		} from "./fb.stage";
import { remote	} from "./remote";
import { local	} from "./local";


const thisHost		= local.default.THIS_HOST;
const privateMife	= process.env.PRIVATE_MIFE	|| local.default.PRIVATE_MIFE;			// DEFINES THIS MIFE
const thisMife		= privateMife;

const alias			= process.env.ALIAS			|| 'dev';
const title			= process.env.TITLE			|| 'Default Private Website Title';
const debug			= process.env.DEBUG			|| 'false';
const logs			= process.env.LOGS			|| 'false';
const authMife		= process.env.AUTH_MIFE		|| remote.default.AUTH_MIFE;
const chatMife		= process.env.CHAT_MIFE		|| remote.default.CHAT_MIFE;
const formMife		= process.env.FORM_MIFE		|| remote.default.FORM_MIFE;
const publicMife	= process.env.PUBLIC_MIFE	|| remote.default.PUBLIC_MIFE;
const authService	= process.env.AUTH_SERVICE	|| remote.default.AUTH_SERVICE;

const assetsBucket	= 'https://storage.googleapis.com/weja.us';							// GLOBAL DEFAULTS
const cmsService	= 'https://foo.fb.weja.us/cms';
const cmsSheet		= 'https://docs.google.com/spreadsheets/d/14T-GM6Cx-OpT_s4MCytc1VL8fQax8eOC8IHdne-1Wf4/edit#gid=1055269632';
const cmsAlias		= 'stage-EN_US';


export const environment = {
	production: Boolean(alias	=== 'prod'),
	debug:		Boolean(debug	=== 'true'),
	logs:		Boolean(logs	=== 'true'),
	alias,
	local:		true,
	remote:		false,
	title,
	assets: { bucket:	assetsBucket	},
	this:	{ host:		thisHost		},
	mife: {
		this:		thisMife,
		private:	thisMife,
		auth:		thisMife,
		chat:		chatMife,
		form:		formMife,
		public:		publicMife,
		register:	authMife + 'register'
	},
	service: {
		auth:		authService,
		cms:		cmsService
	},
	cms: {
		service:	cmsService,
		sheet:		cmsSheet,
		alias:		cmsAlias
	},
	authGuardRemoteFallbackURL:	thisMife + 'login',
	authGuardRemoteLoggedInURL:	thisMife + 'home',
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
			authGuardFallbackURL:		thisMife + 'login',
			authGuardLoggedInURL:		thisMife + 'home',
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

import 'zone.js/plugins/zone-error';
