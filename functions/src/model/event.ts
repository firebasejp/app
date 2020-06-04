import { ConnpassResponseEvent } from '../client/connpass';
// @google-cloud/firestoreはfirebase-adminの依存としてインストールされている
import { GeoPoint } from '@google-cloud/firestore';

export interface Event {
  id: string; // firestore用の全サービス横断でユニークなid生成
  service: string; // イベント募集サービス名
  title: string; // イベント名
  description: string; // 概要
  eventUrl: string; // イベントurl
  hashtag?: string; // ハッシュタグ
  startedAt: Date; // 開始時間
  endedAt: Date; // 終了時間
  address: string; // 開催場所住所
  place: string; // 開催会場
  geoPoint: GeoPoint; // 緯度経度
  owner: string; // 主催者
  limit: number; // 定員
  accepted: number; // 参加者
  waiting: number; // 補欠者
  updatedAt: Date; // 更新日時
}

export class ConnpassEvent implements Event {
  id: string;
  service: string;
  title: string;
  description: string;
  eventUrl: string;
  hashtag?: string;
  startedAt: Date;
  endedAt: Date;
  address: string;
  place: string;
  geoPoint: GeoPoint;
  owner: string;
  limit: number;
  accepted: number;
  waiting: number;
  updatedAt: Date;

  constructor(res: ConnpassResponseEvent) {
    this.id = `connpass_${res.event_id}`;
    this.service = 'connpass';

    this.title = res.title;
    this.description = res.description;
    this.eventUrl = res.event_url;
    this.hashtag = res.hash_tag || undefined;
    this.startedAt = new Date(res.started_at);
    this.endedAt = new Date(res.ended_at);
    this.address = res.address;
    this.place = res.place;
    this.geoPoint = new GeoPoint(Number(res.lat), Number(res.lon));
    this.owner = res.owner_nickname;
    this.limit = res.limit;
    this.accepted = res.accepted;
    this.waiting = res.waiting;
    this.updatedAt = new Date(res.updated_at);
  }
}
