

const TRR = process.env.TARGET_REMOTE_REALM	|| 'too.weja.us'
const PID = process.env.TARGET_PROJECT_ID	|| 'weja-us'
export const fire = {
	API_KEY:		'AIzaSyACF9vblOxUSQbRu6LsRgWuDBIqRjzYYyM',
	AUTH_DOMAIN:	TRR,
	DATABASE_URL:	'https://' + PID + '.firebaseio.com/',
	PROJECT_ID:		PID,
	STORAGE_BUCKET:	PID + '.appspot.com',
	APP_ID:			'"1:68199260028:web:e619292af013b9a10a8ef9',
	MESSAGING_SENDER_ID: '68199260028'
};
