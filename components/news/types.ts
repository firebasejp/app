import { ContentType } from '../../functions/src/feeds/v1/types';
export type FeedItem = {
  id: string;
  contentType: ContentType;
  link: string;
  title: string;
  thumbnail: string;
  published: Date;
  content: string;
};
