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
      upcoming,
      recently_added: recentlyAdded
    } = req.query,
      videos = await this.server.utils.getVideos(
        {
          skip: Number(skip || 0),
          limit: Number(limit || 0),
          pinned: pinned === 'true' ? true : undefined,
          upcoming: upcoming === 'true' ? true : undefined,
          recentlyAdded: recentlyAdded === 'true' ? true : undefined
        }
      )

    return {
      value: videos,
      code: 200
    }
  }
}

export default GetVideoById