import React from 'react';
import { FlatList, View } from 'react-native';
import { EventCard } from './cards';

export type EventViewItem = {
  id: string;
  url: string;
  title: string;
  thumbnail_url: string;
  started_at: Date;
};

const DATA: EventViewItem[] = [
  {
    id: '175985',
    url: 'https://firebase-community.connpass.com/event/175985/',
    title: 'Firebase Realtime Meetup',
    thumbnail_url:
      'https://connpass-tokyo.s3.amazonaws.com/thumbs/66/b7/66b7b7d84ab00aefd0c8d0310ce5e01a.png',
    started_at: new Date('2020-06-26T18:00:00+09:00'),
  },
  {
    id: '1',
    url: 'https://firebase-community.connpass.com/event/175985/',
    title: 'Firebase Realtime Meetup',
    thumbnail_url:
      'https://connpass-tokyo.s3.amazonaws.com/thumbs/66/b7/66b7b7d84ab00aefd0c8d0310ce5e01a.png',
    started_at: new Date('2020-06-26T18:00:00+09:00'),
  },
  {
    id: '2',
    url: 'https://firebase-community.connpass.com/event/175985/',
    title: 'Firebase Realtime Meetup',
    thumbnail_url:
      'https://connpass-tokyo.s3.amazonaws.com/thumbs/66/b7/66b7b7d84ab00aefd0c8d0310ce5e01a.png',
    started_at: new Date('2020-06-26T18:00:00+09:00'),
  },
];

export function NewsEvents(): JSX.Element {
  if (!DATA || DATA.length === 0) {
    return <View />;
  }

  return (
    <FlatList
      data={DATA}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => <EventCard item={item} index={index} />}
    />
  );
}
