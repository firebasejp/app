import { ParserType } from './parsers';
import { FirestoreDataConverter, DocumentData } from '@google-cloud/firestore';
export type Feed = {
  url: string;
  parser?: ParserType;
  lastModified?: string;
  expires?: Date | null;
};

export const FeedConverter: FirestoreDataConverter<Feed> = {
  toFirestore: (model: Feed) => model,
  fromFirestore: (data: DocumentData) => {
    return {
      url: data['url'],
      lastModified: data['lastModified'],
      expires: data['expires'],
      parser: data['parser'],
    };
  },
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

export const FeedItemConverter: FirestoreDataConverter<FeedItem> = {
  toFirestore: (model: FeedItem) => model,
  fromFirestore: (data: DocumentData) => {
    return {
      contentType: data['contentType'],
      link: data['link'],
      title: data['title'],
      thumbnail: data['thumbnail'],
      published: data['published'],
      content: data['content'],
    };
  },
};
