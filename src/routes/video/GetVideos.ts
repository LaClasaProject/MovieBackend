import Path from '../../base/Path'
import {
  HttpReq,
  IRoute
} from '../../types/Http'

class GetVideoById extends Path implements IRoute {
  public path   = '/api/videos'
  public method = 'get'

  public async onRequest() {
    const videos = await this.server.utils.getVideos()

    return {
      data: videos,
      code: 200
    }
  }
}

export default GetVideoById