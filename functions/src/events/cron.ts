import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { ConnpassClient } from '../client/connpass';
import { FirestoreSimple } from '@firestore-simple/admin';
import { ConnpassEvent, Event } from '../model/event';

const firestore = admin.firestore();
const firestoreSimple = new FirestoreSimple(firestore);

export const getConnpassEvents = functions
  .region('asia-northeast1')
  .pubsub.schedule('0 9-23 * * *')
  .timeZone('Asia/Tokyo')
  .onRun(async () => {
    const eventsCollection = firestoreSimple.collection<Event>({
      path: 'events',
    });

    const client = new ConnpassClient('tokyo');
    const apiResponse = await client.fetch();
    const events = apiResponse.map(
      (responseEvent) => new ConnpassEvent(responseEvent),
    );

    await eventsCollection.bulkSet(events);
  });
