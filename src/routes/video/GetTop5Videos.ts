import Path from '../../base/Path'
import {
  HttpReq,
  IRoute
} from '../../types/Http'

class GetTop5Videos extends Path implements IRoute {
  public path   = '/api/videos/top5'
  public method = 'get'

  public async onRequest() {
    const videos = await this.server.utils.getTop5Videos()

    return {
      data: videos,
      code: 200
    }
  }
}

export default GetTop5Videos