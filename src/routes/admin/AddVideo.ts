import Path from '../../base/Path'
import {
  HttpReq,
  IAddVideoProps,
  IRoute,
} from '../../Types'

import { randomUUID } from 'crypto'
import Utils from '../../Utils'

class AddVideo extends Path implements IRoute {
  public path   = '/api/admin/new'
  public method = 'post'

  public async onRequest(req: HttpReq) {
    const data = req.body as unknown as IAddVideoProps,
      adminKey = req.headers.authorization

    if (!this.server.config.adminKeys.includes(adminKey))
      return {
        code: 401,
        message: 'Unauthorized request.'
      }

    if (!data.title || !data.description)
      return {
        code: 400,
        message: 'Incorrect parameters.'
      }

    if (!data.video)
      data.video = ''
    
    const videoId = randomUUID()

    for (const [key, value] of Object.entries(data))
      if (typeof data[key] === 'string')
        data[key] = data[key].replaceAll(
          '{videoId}',
          videoId
        )

    const result = await Utils.addVideo(
      this.server,
      {
        VideoId: videoId,
        IsSeries: data.isSeries,

        MetaTitle: data.title,
        MetaDesc: data.description,

        PosterUrl: data.poster,
        CoverUrl: data.cover,

        Seasons: data.seasons,
        Episodes: Buffer.from(
          Array.isArray(data.episodes) ? (
            data.episodes.filter(
              (item) => !isNaN(item)
            )
          ) : []
        ),

        IsAvailable: data.isAvailable,
        VideoUrl: data.video,

        AddedAt: Date.now(),
        SubtitlePath: data.subs
      }
    )

    return {
      code: result ? 200 : 400,
      message: result ? 'Video added.' : 'Video not added.',
      data: {
        videoId
      }
    }
  }
}

export default AddVideo
