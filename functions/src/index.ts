import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

export * as feed_v1 from './feed/v1';
export * as events_v1 from './events/v1';
