import Path from '../../base/Path'
import {
  HttpReq,
  IRoute
} from '../../types/Http'

// TODO: Fix GetVideoById.
// Make it flexible, allow pagination, filter by pinned videos or upcoming videos.
class GetVideoById extends Path implements IRoute {
  public path   = '/api/videos'
  public method = 'get'

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