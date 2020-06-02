import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import axios from 'axios'
import { JSDOM } from 'jsdom'

const getConnpassThumbnail = async (url: string): Promise<ArrayBuffer> => {
    const response = await axios.get(url)
    const dom = new JSDOM(response.data)

    // og:imageのurl
    const element = dom.window.document.querySelector("head > meta[property='og:image']") as HTMLMetaElement
    const imageUrl = element.content

    // 画像をcommpassのS3からダウンロード
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' })
    return imageResponse.data
}

// 追加されたeventsに対応するサムネイルをスクレイピングしてGCSにアップする
export const saveEventThumbnail = functions
    .region('asia-northeast1')
    .firestore
    .document('events/{eventId}')
    .onCreate(async (snapshot, _context) => {
        const data = snapshot.data()
        if (!data) return

        let image: ArrayBuffer | undefined
        if (data.service === 'connpass') {
            image = await getConnpassThumbnail(data.eventUrl)
        } else {
            return
        }

        // 自分のCloud Storageに画像をアップロードし直す
        // ファイル名はconnpass_140369.pngのようになる
        const eventId = snapshot.id
        const bucket = admin.storage().bucket()
        await bucket.file(`events/thumbnail/${eventId}.png`).save(image)
    })
