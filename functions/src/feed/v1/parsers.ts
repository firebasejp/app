import xml2js from 'xml2js';
import { JSDOM } from 'jsdom';
import { FeedItem } from './fetch';

export type ParserType = 'feedburner';

const parseFeedburner = async (content: string): Promise<FeedItem[]> => {
  const parser = new xml2js.Parser();
  const parsed = await parser.parseStringPromise(content);

  const { feed } = parsed;
  const res: FeedItem[] = [];

  for (const item of feed.entry) {
    const link = item.link[0].$.href;
    const content = item.content[0]._;
    const dom = new JSDOM(content);
    const element = dom.window.document.querySelector(
      `meta[name='twitter:image']`,
    ) as HTMLMetaElement;

    const thumbnail = element?.content ?? '';
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

export async function parseContent(
  parser: 'feedburner',
  content: string,
): Promise<FeedItem[]>;
export async function parseContent(
  parser: ParserType,
  content: string,
): Promise<FeedItem[]> {
  switch (parser) {
    case 'feedburner':
      return parseFeedburner(content);
    default:
      throw new Error(`unsupport parase ${parser}`);
  }
}
