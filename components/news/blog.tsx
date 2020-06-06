import React, { useEffect } from 'react';
import { FlatList, View } from 'react-native';
import { db } from '../../lib/firebase';
import { BlogCard } from './cards';

export type BlogViewItem = {
  id: string;
  title: string;
  thumbnail?: string;
  link: string;
};

const fetchBlogItems = async (): Promise<BlogViewItem[]> =>
  db
    .collectionGroup('feedItems_v1')
    .where('contentType', '==', 'blog')
    .orderBy('published', 'desc')
    .get()
    .then((res) => {
      const items: BlogViewItem[] = [];
      for (const doc of res.docs) {
        const data = doc.data();
        items.push({
          id: doc.id,
          title: data.title,
          thumbnail: data.thumbnail,
          link: data.link,
        });
      }

      return items;
    });

export function NewsBlog(): JSX.Element {
  const [isFetching, setIsFetching] = React.useState(true);
  const [data, setData] = React.useState<BlogViewItem[]>();
  useEffect(() => {
    fetchBlogItems()
      .then((data) => setData(data))
      .finally(() => setIsFetching(false));
  }, []);

  function onRefresh() {
    setIsFetching(true);
    fetchBlogItems()
      .then((data) => setData(data))
      .finally(() => setIsFetching(false));
  }

  if (!data) {
    return <View />;
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => <BlogCard item={item} index={index} />}
      onRefresh={onRefresh}
      refreshing={isFetching}
    />
  );
}
