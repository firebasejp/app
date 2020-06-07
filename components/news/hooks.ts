import React from 'react';
import { db } from '../../lib/firebase';
import {
  FeedItemConverter,
  ContentType,
} from '../../functions/src/feeds/v1/types';
import { FeedItem } from './types';

export function useFeedItems(
  type: ContentType,
): {
  isFetching: boolean;
  isNextFetching: boolean;
  items: FeedItem[];
  refresh: () => void;
  next: () => void;
} {
  const [isFetching, setIsFetching] = React.useState(true);
  const [isNextFetching, setIsNextFetching] = React.useState(false);
  const [data, setData] = React.useState<FeedItem[]>();
  const [lastVisible, setLastVisible] = React.useState<Date>();

  function fetchFeedItems(current?: FeedItem[], lastVisible?: Date) {
    let query = db
      .collectionGroup('feedItems_v1')
      .where('contentType', '==', type)
      .orderBy('published', 'desc');

    if (lastVisible) {
      query = query.startAfter(lastVisible);
    }

    query = query.limit(2);

    return query
      .get()
      .then((snap) => {
        return snap.docs.map((doc) => {
          const res: FeedItem = {
            id: doc.id,
            ...FeedItemConverter.fromFirestore(doc.data()),
          };

          return res;
        });
      })
      .then((docs) => {
        const items = (current ?? []).concat(docs);

        setLastVisible(items[items.length - 1].published);

        return items.filter(
          (item, i) =>
            items.findIndex((item2) => item.link === item2.link) === i,
        );
      })
      .then(setData);
  }

  React.useEffect(() => {
    fetchFeedItems().finally(() => setIsFetching(false));
  }, [type, setIsFetching]);

  function refresh() {
    setIsFetching(true);
    fetchFeedItems().finally(() => setIsFetching(false));
  }

  function next() {
    setIsNextFetching(true);
    fetchFeedItems(data, lastVisible).finally(() => setIsNextFetching(false));
  }

  return {
    isFetching,
    isNextFetching,
    items: data ?? [],
    refresh,
    next,
  };
}
