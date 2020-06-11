import xml2js from 'xml2js';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import { FeedItem } from './types';

export type ParserType = 'feedburner' | 'medium' | 'youtube' | 'connpass';

const parseFeedburner = async (content: string): Promise<FeedItem[]> => {
  const parser = new xml2js.Parser();
  const parsed = await parser.parseStringPromise(content);

  const { feed } = parsed;
  const res: FeedItem[] = [];

  for (const item of feed.entry) {
    const link = item.link.find(
      (l: { $: { rel: string } }) => l.$.rel === 'alternate',
    ).$.href;
    const content = item.content[0]._;
    const dom = new JSDOM(content);
    const element = dom.window.document.querySelector(
      `meta[name='twitter:image']`,
    ) as HTMLMetaElement;

    let thumbnail = element?.content ?? '';

    if (!thumbnail) {
      const elements = dom.window.document.querySelectorAll(`img`);
      thumbnail =
        Array.from(elements)
          .find((e) => e.dataset.originalWidth !== e.dataset.originalHeight)
          ?.getAttribute('src') ?? '';
    }

    res.push({
      contentType: 'blog',
      link,
      title: item.title[0]._,
      thumbnail,
      published: new Date(item.published[0]),
      content,
    });
  }

  return res;
};

const parseMedium = async (content: string): Promise<FeedItem[]> => {
  const parser = new xml2js.Parser();
  const parsed = await parser.parseStringPromise(content);

  const res: FeedItem[] = [];
  const { item: items } = parsed.rss.channel[0];
  for (const item of items) {
    const link = item.link[0];
    const response = await axios.get(link);
    const dom = new JSDOM(response.data);
    const element = dom.window.document.querySelector(
      "head > meta[property='og:image']",
    ) as HTMLMetaElement;
    const thumbnail = element.content;

    res.push({
      contentType: 'blog',
      link,
      title: item.title[0],
      thumbnail,
      published: new Date(item.pubDate[0]),
      content: item['content:encoded']
        ? item['content:encoded'][0]
        : item['description'][0],
    });
  }

  // console.log({ res });

  return res;
};

export const parseYouTube = async (content: string): Promise<FeedItem[]> => {
  const parser = new xml2js.Parser();
  const parsed = await parser.parseStringPromise(content);

  const { feed } = parsed;
  const res: FeedItem[] = [];

  for (const item of feed.entry) {
    const link = item.link.find(
      (l: { $: { rel: string } }) => l.$.rel === 'alternate',
    ).$.href;
    const mediaGroup = item['media:group'][0];

    res.push({
      contentType: 'video',
      link,
      title: mediaGroup['media:title'][0] ?? '',
      thumbnail: mediaGroup['media:thumbnail'][0].$.url ?? '',
      published: new Date(item.published[0]),
      content: mediaGroup['media:description'][0] ?? '',
    });
  }

  return res;
};

export const parseConnpass = async (content: string): Promise<FeedItem[]> => {
  const parser = new xml2js.Parser();
  const parsed = await parser.parseStringPromise(content);

  const { feed } = parsed;
  const res: FeedItem[] = [];

  for (const item of feed.entry) {
    const link = item.link.find(
      (l: { $: { rel: string } }) => l.$.rel === 'alternate',
    ).$.href;
    const response = await axios.get(link);
    const dom = new JSDOM(response.data);
    const element = dom.window.document.querySelector(
      "head > meta[property='og:image']",
    ) as HTMLMetaElement;
    const thumbnail = element.content;

    res.push({
      contentType: 'event',
      link,
      title: item['title'][0] ?? '',
      thumbnail,
      published: new Date(item.published[0]),
      content: item['summary'][0]._ ?? '',
    });
  }

  return res;
};

export async function parseContent(
  parser: ParserType,
  content: string,
): Promise<FeedItem[]> {
  switch (parser) {
    case 'feedburner':
      return parseFeedburner(content);
    case 'medium':
      return parseMedium(content);
    case 'youtube':
      return parseYouTube(content);
    case 'connpass':
      return parseConnpass(content);
    default:
      throw new Error(`unsupport parase ${parser}`);
  }
}
