import HttpServer from './base/HttpServer'
import { IVideoData, IAddVideoProps, IPartialVideoData } from './Types'

import { existsSync } from 'fs'

const videoProps = {
  title: 'MetaTitle',
  description: 'MetaDesc',
  
  poster: 'PosterUrl',
  cover: 'CoverUrl',

  video: 'CoverUrl',
  subs: 'SubtitlePath',

  episodes: 'Episodes',
  seasons: 'Seasons',

  isAvailable: 'IsAvailable',
  isSeries: 'IsSeries',
}

class Utils {
  public static async getVideoData(
    server: HttpServer,
    videoId: string
  ): Promise<IVideoData | null | undefined> {
    const fileMeta = server.videoMeta.get(videoId)
    if (fileMeta)
      return fileMeta

    const data = await server.db.select('*')
      .from('Videos')
      .whereRaw(
        'VideoId = ?',
        [
          videoId
        ]
      )
      .first<IVideoData>()

    if (data) {
      data.IsSeries = Boolean(data.IsSeries)
      server.videoMeta.set(videoId, data)

      // clear cache after 2 minutes
      setTimeout(
        () => {
          server.videoMeta.delete(videoId)
        },
        (60 * 1000) * 2
      )
    }

    return data
  }

  public static async getVideos(server: HttpServer) {
    const data = await server.db.select<IVideoData[]>('*')
      .from('Videos')

    return (
      data ?? []
    ).sort(
      (a, b) => a.MetaTitle.localeCompare(b.MetaTitle)
    )
  }

  public static pad(
    num: number,
    val: any,
    amount: number
  ) {
    return num.toString()
      .padStart(amount, val)
  }

  public static async addVideo(
    server: HttpServer,
    data: IVideoData
  ) {
    const {
      VideoId,
      IsSeries,
      MetaTitle,
      MetaDesc,
      Seasons,
      Episodes,
      PosterUrl,
      CoverUrl,
      IsAvailable,
      VideoUrl,
      AddedAt,
      SubtitlePath
    } = data

    let result = false

    try {
      await server.db.insert(
        {
          VideoId,
          IsSeries,
          MetaTitle,
          MetaDesc,
          Seasons,
          Episodes,
          PosterUrl,
          CoverUrl,
          IsAvailable,
          VideoUrl,
          AddedAt,
          SubtitlePath
        }
      )
      .into('Videos')

      result = true
    } catch {}

    return result
  }

  public static async updateVideoData(
    server: HttpServer,
    videoId: string,
    data: IAddVideoProps
   ) {
    const partialVideoData: IPartialVideoData = {},
      keys = Object.keys(data)

    for (const key of keys) {
      if (!videoProps[key]) continue
      
      if (typeof data[key] === 'string')
        data[key] = data[key].replaceAll(
          '{videoId}',
          videoId
        )

      if (Array.isArray(data[key]))
        data[key] = Buffer.from(data[key])

      partialVideoData[
        videoProps[key]
      ] = data[key]
    }

    try {
      return await server.db('Videos')
        .where(
          {
            VideoId: videoId
          }
        )
        .update(
          partialVideoData,
          keys
        )
    } catch {
      return null
    }
   }

  public static async getFilePath(
    server: HttpServer,
    videoId: string
  ) {
    const meta = await Utils.getVideoData(server, videoId)
    if (!meta) return null

    const cachedPath = server.fileNameCache.get(videoId)
      if (cachedPath)
        return cachedPath
    
    if (!existsSync(`${server.PROCESS_CWD}/movies/${videoId}`))
      return null

    if (!meta.IsSeries) {    
      const path = `${server.PROCESS_CWD}/movies/${videoId}/video.mp4`
      server.fileNameCache.set(videoId, path)

      return path
    } else {
      // for series
      const seasons = meta.Seasons,
        paths = []

      for (let i = 0; i < seasons; i++)
        for (let j = 0; j < meta.Episodes[0]; j++)
          paths.push(
            `${server.PROCESS_CWD}/movies/${videoId}/S${Utils.pad(i + 1, '0', 2)}/E${Utils.pad(j + 1, '0', 2)}.mp4`
          )

      server.fileNameCache.set(videoId, paths)
      return paths
    }
  }
}

export default Utils
