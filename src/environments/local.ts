

const thisHost = 'http://localhost:7777';

export const local = {
	default: {
		THIS_HOST:		thisHost,
		AUTH_SERVICE:	'http://localhost:5002/',
		AUTH_MIFE: 		'http://localhost:4422/#/',
		CHAT_MIFE: 		'http://localhost:4415/#/',
		FORM_MIFE: 		'http://localhost:4423/#/',
		PRIVATE_MIFE:	'http://localhost:4423/#/',
		SPRINKLER_MIFE:	thisHost + '/#/',
		PUBLIC_MIFE: 	'http://localhost:4402/#/'
	}
}
