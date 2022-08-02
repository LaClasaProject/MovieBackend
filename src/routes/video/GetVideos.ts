import Path from '../../base/Path'
import {
  HttpReq,
  IRoute
} from '../../types/Http'

class GetVideoById extends Path implements IRoute {
  public path   = '/api/videos'
  public method = 'get'

  public cache = true

  public async onRequest(req: HttpReq) {
    const {
      skip,
      limit,
      pinned,
      upcoming
    } = req.query,
      videos = await this.server.utils.getVideos(
        {
          skip: Number(skip),
          limit: Number(limit),
          pinned: pinned === 'true' ? true : undefined,
          upcoming: upcoming === 'true' ? true : undefined
        }
      )

    return {
      data: videos,
      code: 200
    }
  }
}

export default GetVideoById