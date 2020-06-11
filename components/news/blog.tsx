import React from 'react';
import { FlatList, View, ActivityIndicator } from 'react-native';
import { BlogCard } from './cards';
import { useFeedItems } from './hooks';

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
