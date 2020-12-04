import * as fs from 'fs'
import * as path from 'path'
import axios from 'axios'
import DeviantArt from 'deviantart.ts'
import { Fetcher, Secret } from '../types'

export class DeviantartFetcher extends Fetcher {
    async fetch(secret: Secret): Promise<void> {
        if (secret.deviantart === undefined) {
            console.error('ERR: secret.deviantart is undefined')
            return
        }

        const deviantArt = await DeviantArt.login(secret.deviantart.id, secret.deviantart.secret)

        const folders = []
        let moreFolders = true
        let offsetFolders = 0

        while (moreFolders) {
            const request = await deviantArt.collections.folders({
                username: "progrestian",
                offset: offsetFolders
            })

            folders.push(...request.results)
            moreFolders = request.has_more
            offsetFolders = request.next_offset ?? offsetFolders
        }

        const deviations = []

        for (const folder of folders) {
            let moreDeviations = true
            let offsetDeviations = 0

            while (moreDeviations) {
                const request = await deviantArt.collections.get({
                    username: "progrestian",
                    offset: offsetDeviations,
                    folderid: folder.folderid
                })

                deviations.push(...request.results)
                moreDeviations = request.has_more
                offsetDeviations = request.next_offset ?? offsetDeviations
            }
        }

        const minWidth = 1920
        const minHeight = 1080

        for (const deviation of deviations) {
            const image = await axios({
                method: "GET",
                url: deviation.content?.src,
                responseType: "stream",
            })

            if ((deviation.content?.width ?? 0 >= minWidth) && (deviation.content?.height ?? 0 >= minHeight)) {
                await image.data.pipe(fs.createWriteStream(path.join(this.localdir, 'images', `${deviation.author?.username} - ${deviation.title}.jpg`)));
            }
        }
    }
}