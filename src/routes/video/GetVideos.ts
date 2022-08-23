import Path from '../../base/Path'
import { IUserTiers } from '../../types/Database'

import {
  HttpReq,
  IRoute
} from '../../types/Http'

class GetVideos extends Path implements IRoute {
  public path   = '/api/videos'
  public method = 'get'

  public requireUserToken = true

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
      ),
      user = await this.server.utils.getUserByToken(this.token)

    return {
      value: videos.filter(
        (video) => video.series ? (
          user.tier >= IUserTiers.PREM_1 &&
          Date.now() < (user.tierExpir || 0)
        ) : true
      ),
      code: 200
    }
  }
}

export default GetVideos