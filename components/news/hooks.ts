import React from 'react';
import { db } from '../../lib/firebase';
import {
  FeedItemConverter,
  ContentType,
} from '../../functions/src/feeds/v1/types';
import { FeedItem } from './types';

type FetchFeedItemsState = {
  isFetching: boolean;
  isNextFetching: boolean;
  data: FeedItem[];
  lastVisible?: Date;
  error?: Error;
  refreshCount: number;
  nextCount: number;
};

type FetchFeedItemsAction =
  | FetchFeedItemDataAction
  | FetchFeedItemErrorAction
  | FetchFeedItemRefreshAction
  | FetchFeedItemNextAction;

type FetchFeedItemDataAction = {
  type: 'data';
  data: FeedItem[];
  lastVisible: Date;
};
type FetchFeedItemErrorAction = {
  type: 'error';
  error: Error;
};
type FetchFeedItemRefreshAction = {
  type: 'refresh';
};
type FetchFeedItemNextAction = {
  type: 'next';
};

const fetchFeedItemsReducer: React.Reducer<
  FetchFeedItemsState,
  FetchFeedItemsAction
> = (state, action) => {
  switch (action.type) {
    case 'data':
      return {
        ...state,
        data: action.data,
        lastVisible: action.lastVisible,
        isFetching: false,
      };
    case 'error':
      return {
        ...state,
        error: action.error,
        isFetching: false,
      };
    case 'refresh':
      return {
        ...state,
        refreshCount: state.refreshCount + 1,
        lastVisible: undefined,
        isFetching: true,
      };
    case 'next':
      return {
        ...state,
        nextCount: state.nextCount + 1,
        isNextFetching: true,
      };
    default:
      throw new Error(`unsupport action ${action}`);
  }
};

export function useFeedItems(
  type: ContentType,
): {
  isFetching: boolean;
  isNextFetching: boolean;
  items: FeedItem[];
  refresh: () => void;
  next: () => void;
} {
  const [state, dispatch] = React.useReducer(fetchFeedItemsReducer, {
    isFetching: true,
    isNextFetching: false,
    data: [],
    refreshCount: 0,
    nextCount: 0,
  });

  const {
    isFetching,
    isNextFetching,
    data,
    lastVisible,
    refreshCount,
    nextCount,
  } = state;

  React.useEffect(() => {
    let safeDispatch = (action: FetchFeedItemsAction) => dispatch(action);
    const current: FeedItem[] = data;
    let query = db
      .collectionGroup('feedItems_v1')
      .where('contentType', '==', type)
      .orderBy('published', 'desc');

    if (lastVisible) {
      query = query.startAfter(lastVisible);
    }

    query = query.limit(2);

    query
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

        if (items.length === 0) {
          return [];
        }

        const lastVisible = items[items.length - 1].published;

        const data = items.filter(
          (item, i) =>
            items.findIndex((item2) => item.link === item2.link) === i,
        );

        safeDispatch({
          type: 'data',
          data,
          lastVisible,
        });
      })
      .catch((error) => {
        safeDispatch({ type: 'error', error });
      });

    return function cleanup() {
      safeDispatch = () => {
        return;
      };
    };
  }, [refreshCount, nextCount]);

  return {
    isFetching,
    isNextFetching,
    items: data ?? [],
    refresh: (): void => dispatch({ type: 'refresh' }),
    next: (): void => dispatch({ type: 'next' }),
  };
}
