import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

export * as feeds_v1 from './feeds/v1';
export * as events_v1 from './events/v1';
