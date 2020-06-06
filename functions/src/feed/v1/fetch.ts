import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';
import crypto from 'crypto';
import { PubSub } from '@google-cloud/pubsub';
import { parseContent, ParserType } from './parsers';
function hash(data: string): string {
  const shasum = crypto.createHash('sha1');
  shasum.update(data);

  return shasum.digest('hex');
}

export type Feed = {
  url: string;
  parser?: ParserType;
  lastModified?: string;
  expires?: Date | null;
};

export const isFeed = (data: Record<string, unknown>): data is Feed => {
  return typeof data['url'] === 'string';
};

export type ContentType = 'blog';

export type FeedItem = {
  contentType: ContentType;
  link: string;
  title: string;
  thumbnail: string;
  published: Date;
  content: string;
};

/**
 *
 * ```shell
 * feed_v1.fetchFeed({data: Buffer.from(`{"url": "http://feeds.feedburner.com/FirebaseBlog", "parser", "feedburner"}`)})
 * ```
 */
export const fetchFeed = functions.pubsub
  .topic('fetch-feed')
  .onPublish(async (message) => {
    const { json: req } = message;
    if (!isFeed(req)) {
      return;
    }
    const { url, parser } = req;
    if (!parser) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        `Invalid feed parase`,
      );
    }

    const db = admin.firestore();
    const urlHash = hash(url);
    const docRef = db.doc(`/feed_v1/${urlHash}`).withConverter<Feed>({
      toFirestore: (model) => model,
      fromFirestore: (data) => {
        return {
          url: data['url'],
          lastModified: data['lastModified'],
          expires: data['expires'],
        };
      },
    });
    const doc = await docRef.get();
    const headers: {
      'if-modified-since': string | null;
    } = { 'if-modified-since': null };
    if (doc.exists) {
      const feed = doc.data();
      headers['if-modified-since'] = feed?.lastModified ?? null;
    }

    const res = await axios
      .get(url, {
        headers,
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 304) {
            console.log('304', {
              url,
              lastModified: headers['if-modified-since'],
            });

            return;
          }
        }
        throw err;
      });
    if (!res) {
      return;
    }

    console.log(`status = ${res.status}`);

    const feedItems = await parseContent(parser, res.data);

    const batch = db.batch();

    const feedItemsRef = docRef.collection('feedItems_v1');
    for (const item of feedItems) {
      const { link } = item;
      if (!link) {
        continue;
      }
      const id = hash(link);
      batch.set(feedItemsRef.doc(id), item);
    }

    const lastModified = res.headers['last-modified'];
    const expires = res.headers['expires'];
    batch.set(docRef, {
      url,
      expires: expires ? new Date(expires) : null,
      lastModified,
    });

    await batch.commit();

    console.log(`Save feed`, {
      url,
      count: feedItems.length,
    });

    return;
  });

export const runFetchFeeds = functions.pubsub
  .schedule('*/30 * * * *')
  .onRun(async () => {
    const db = admin.firestore();
    const res = await db
      .collection('feed_v1')
      .withConverter<Feed>({
        toFirestore: (model) => model,
        fromFirestore: (data) => {
          return {
            url: data['url'],
            lastModified: data['lastModified'],
            expires: data['expires'],
          };
        },
      })
      .where('expires', '<=', new Date())
      .get();

    const pubsub = new PubSub();
    const tasks: Promise<string>[] = [];

    for (const feed of res.docs) {
      tasks.push(
        pubsub
          .topic('fetch-feed')
          .publish(Buffer.from(JSON.stringify({ url: feed.data().url }))),
      );
    }

    await Promise.all(tasks);
  });
