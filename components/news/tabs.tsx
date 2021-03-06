import React from 'react';
import { FlatList, View, ActivityIndicator } from 'react-native';
import { EventCard, BlogCard } from './cards';
import { useFeedItems } from './hooks';

export function NewsEvents(): JSX.Element {
  const { isFetching, isNextFetching, items, refresh, next } = useFeedItems(
    'event',
  );

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.title}
      renderItem={({ item, index }) => <EventCard item={item} index={index} />}
      onRefresh={refresh}
      refreshing={isFetching}
      onScrollEndDrag={next}
      ListFooterComponent={isNextFetching ? <ActivityIndicator /> : <View />}
    />
  );
}

export function NewsVideos(): JSX.Element {
  const { isFetching, isNextFetching, items, refresh, next } = useFeedItems(
    'video',
  );

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.title}
      renderItem={({ item, index }) => <BlogCard item={item} index={index} />}
      onRefresh={refresh}
      refreshing={isFetching}
      onScrollEndDrag={next}
      ListFooterComponent={isNextFetching ? <ActivityIndicator /> : <View />}
    />
  );
}

export function NewsBlog(): JSX.Element {
  const { isFetching, isNextFetching, items, refresh, next } = useFeedItems(
    'blog',
  );

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.title}
      renderItem={({ item, index }) => <BlogCard item={item} index={index} />}
      onRefresh={refresh}
      refreshing={isFetching}
      onScrollEndDrag={next}
      ListFooterComponent={isNextFetching ? <ActivityIndicator /> : <View />}
    />
  );
}
