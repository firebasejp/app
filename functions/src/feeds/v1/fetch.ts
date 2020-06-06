import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';
import crypto from 'crypto';
import { PubSub } from '@google-cloud/pubsub';
import { parseContent, ParserType } from './parsers';
import { logger } from '../../logger';

export const FEEDS_COLLECTION = 'feeds_v1';
export const FEED_ITENS_DOC = 'feedItems_v1';
export const FETCH_FEED_TOPIC = 'fetch-feed';

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
 * feeds_v1.fetchFeed({data: Buffer.from(`{"url": "http://feeds.feedburner.com/FirebaseBlog", "parser": "feedburner"}`)})
 * ```
 */
export const fetchFeed = functions.pubsub
  .topic(FETCH_FEED_TOPIC)
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
    const docRef = db
      .doc(`/${FEEDS_COLLECTION}/${urlHash}`)
      .withConverter<Feed>({
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
            logger.info({
              message: 'Not Modified',
              status: 304,
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

    logger.info({
      status: res.status,
      contentSize: res.headers['content-length'],
    });

    const feedItems = await parseContent(parser, res.data);

    const batch = db.batch();

    const feedItemsRef = docRef.collection(FEED_ITENS_DOC);
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
      parser,
      expires: expires ? new Date(expires) : null,
      lastModified,
    });

    await batch.commit();

    logger.info({
      message: 'Save feeds',
      count: feedItems.length,
    });

    return;
  });

export const runFetchFeeds = functions.pubsub
  .schedule('*/30 * * * *')
  .onRun(async () => {
    const db = admin.firestore();
    const res = await db
      .collection(FEEDS_COLLECTION)
      .withConverter<Feed>({
        toFirestore: (model) => model,
        fromFirestore: (data) => {
          return {
            url: data['url'],
            lastModified: data['lastModified'],
            expires: data['expires'],
            parser: data['parser'],
          };
        },
      })
      .where('expires', '<=', new Date())
      .get();

    logger.info({
      message: 'Get feeds',
      size: res.size,
    });

    const pubsub = new PubSub();
    const tasks: Promise<string>[] = [];

    for (const feed of res.docs) {
      logger.debug({
        data: feed.data(),
      });
      const { url, parser } = feed.data();
      const payload = { url, parser };
      logger.info({
        message: 'Add fetch-feed task',
        payload,
      });
      tasks.push(
        pubsub
          .topic(FETCH_FEED_TOPIC)
          .publish(Buffer.from(JSON.stringify(payload))),
      );
    }

    await Promise.all(tasks);
  });
