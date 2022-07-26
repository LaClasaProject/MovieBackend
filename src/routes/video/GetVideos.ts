import Path from '../../base/Path'
import {
  HttpReq,
  IRoute
} from '../../types/Http'

class GetVideoById extends Path implements IRoute {
  public path   = '/api/v2/videos'
  public method = 'get'

  public async onRequest(req: HttpReq) {
    const videos = await this.server.utils.getVideos()

    return {
      data: videos,
      code: 200
    }
  }
}

export default GetVideoById